// ...existing code...
import userConfig from './模拟userConfig.json';
import schema from './chart.schema.json';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

// 默认后端接口地址，可按需覆盖
const DEFAULT_FETCH_URL = '/api/chart/data';
// 走 x/y 轴渲染逻辑的图表类型集合
const AXIS_CHART_TYPES = new Set(['line', 'bar', 'radar', 'waterfall']);

// 深拷贝用户表单数据，避免 AJV 应用默认值时污染原始引用
function cloneConfig(payload) {
  // 优先使用 structuredClone，失败时回退到 JSON 深拷贝
  if (!payload) return {};
  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(payload);
    } catch (err) {
      console.warn('[schema] structuredClone 失败，回退到 JSON 克隆：', err);
    }
  }
  return JSON.parse(JSON.stringify(payload));
}

/**
 * 目的：在前端机械化流程中按顺序完成：
 * 1) 用 AJV 编译并校验/清理用户表单（apply defaults, remove additional）
 * 2) 从校验后的 config 构建发给后端的 param
 * 3) 调用后端（示例 fetch），拿回用于绘图的数据
 * 4) 合并后端返回与用户配置，生成 ECharts options
 * 5) 渲染图表（占位函数）
 *
 * 注意：此文件为 Vue script 抽出部分，省略组件生命周期与 UI 逻辑，仅实现“机械步骤”。
 */

/* ---------- AJV 初始化 ---------- */
const ajv = new Ajv({
  allErrors: true, // 不在第一个错误处停顿，收集错误并继续校验，最后一并返回
  useDefaults: true, // 把 schema.default 应用到数据上（会修改对象）
  removeAdditional: 'all',   // 移除 schema 未声明的字段
  strict: false
});
addFormats(ajv); // 启用 format 验证
ajvErrors(ajv); // 启用 errorMessage 支持

const validateFn = ajv.compile(schema);

/* ---------- 1. 校验并清理用户配置 ---------- */
// 执行 AJV 校验并返回 { ok, data, errors }，同时写入默认值、移除多余字段
function validateAndSanitize(rawConfig) {
  // 深拷贝：避免 useDefaults 修改原始对象
  const data = cloneConfig(rawConfig);
  const ok = validateFn(data);
  const errors = validateFn.errors ? JSON.parse(JSON.stringify(validateFn.errors)) : [];
  return { ok, data, errors };
}

/* ---------- 2. 从 config 构建 backend params ---------- */
// 将 schema 中的核心片段映射为后端接口参数结构
function buildParamsFromConfig(config = {}) {
  // 通过解构一次取出需要的片段，减少重复 optional chaining
  const {
    chartType,
    dataConfig = {},
    echartsConfig: { styleConfig = {} } = {},
    businessConfig = {}
  } = config;

  return {
    chartType,
    data: dataConfig,
    style: styleConfig,
    business: businessConfig
  };
}

/* ---------- 3. 调用后端获取渲染所需数据（示例） ---------- */
// 调用后端接口，根据 schema 生成的参数换取绘图数据
async function fetchRenderData(params, endpoint = DEFAULT_FETCH_URL) {
  // 示例：POST 到后端，返回结构约定：{ series, xAxis, legend, extra }
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    return { ok: true, data: json };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

// 创建一份基础 ECharts options，供各类型图表 builder 复用
function createBaseOptions() {
  // 提供一份基础骨架，方便后续 builder 在其上增删字段
  return {
    tooltip: { trigger: 'axis' },
    legend: { show: true },
    xAxis: {},
    yAxis: {},
    series: []
  };
}

// 将 styleConfig 写入 ECharts options（颜色、图例位置、grid 等）
function applyStyleOptions(options, style = {}) {
  // 把 schema 中 styleConfig 的内容映射到 ECharts options
  if (!style) return;
  const { colors, legendShow, legendPosition, grid } = style;
  if (Array.isArray(colors) && colors.length) options.color = colors;
  if (typeof legendShow === 'boolean') options.legend.show = legendShow;
  if (legendPosition) {
    if (legendPosition === 'top' || legendPosition === 'bottom') {
      options.legend.top = legendPosition;
    } else if (legendPosition === 'left' || legendPosition === 'right') {
      options.legend.left = legendPosition;
    }
  }
  if (grid) options.grid = { ...options.grid, ...grid };
}

// 针对不同 chartType 的构建器映射
const chartBuilders = {
  treemap: buildTreemapOptions,
  pie: buildPieOptions,
  scatter: buildScatterOptions,
  heatmap: buildHeatmapOptions
};

// Treemap 图 builder：只关注树形数据，移除坐标轴
function buildTreemapOptions(serverData, config, options) {
  // treemap 系列主要依赖树形节点，不需要 x/y 轴
  options.series = [{
    type: 'treemap',
    data: serverData.nodes || config.dataConfig?.nodes || []
  }];
  delete options.xAxis;
  delete options.yAxis;
  return options;
}

// Pie 图 builder：使用 radius + data，不需要 x/y 轴
function buildPieOptions(serverData, config, options) {
  // 饼图使用 radius + data 列表，同样无需坐标轴
  const radius = config.echartsConfig?.pieConfig?.radius || [0, 70];
  options.series = [{
    type: 'pie',
    radius,
    data: serverData.series || serverData.data || []
  }];
  delete options.xAxis;
  delete options.yAxis;
  return options;
}

// Scatter 图 builder：保留后端返回的坐标轴与 series
function buildScatterOptions(serverData, _config, options) {
  // 散点图保留后端返回的坐标轴定义
  options.series = (serverData.series || []).map(s => ({ type: 'scatter', ...s }));
  if (serverData.xAxis) options.xAxis = serverData.xAxis;
  if (serverData.yAxis) options.yAxis = serverData.yAxis;
  return options;
}

// Heatmap 图 builder：支持 visualMap 以及二维坐标
function buildHeatmapOptions(serverData, _config, options) {
  // 热力图可能额外依赖 visualMap
  options.series = [{ type: 'heatmap', data: serverData.series || [] }];
  if (serverData.visualMap) options.visualMap = serverData.visualMap;
  if (serverData.xAxis) options.xAxis = serverData.xAxis;
  if (serverData.yAxis) options.yAxis = serverData.yAxis;
  return options;
}

// Axis 类 builder：折线/柱状/雷达/瀑布等共享 x/y 轴结构
function buildAxisChartOptions(serverData, config, options) {
  // 折线/柱状/雷达/瀑布等共享 x/y 轴结构，瀑布图复用柱状渲染
  const chartType = AXIS_CHART_TYPES.has(config.chartType) ? config.chartType : 'line';
  const mappedType = chartType === 'waterfall' ? 'bar' : chartType;
  options.series = (serverData.series || []).map(s => ({ type: mappedType, ...s }));
  if (serverData.xAxis) options.xAxis = serverData.xAxis;
  if (serverData.yAxis) options.yAxis = serverData.yAxis;
  return options;
}

/* ---------- 4. 把后端数据和用户 config 合并成 ECharts options ---------- */
// 根据 chartType 选择对应 builder，生成最终 ECharts options
function mergeToEchartsOptions(serverData = {}, config = {}) {
  const options = createBaseOptions();
  applyStyleOptions(options, config.echartsConfig?.styleConfig);
  const builder = chartBuilders[config.chartType] || buildAxisChartOptions;
  return builder(serverData, config, options);
}

/* ---------- 5. 渲染图表（占位，Vue 中请在组件内调用） ---------- */
// 占位渲染函数：实际项目中替换为 echarts.init + setOption
function renderEchart(options, dom) {
  // dom: DOMElement 或 DOM id 字符串
  // 此处不引入 echarts 实例，示例为伪代码
  // 在项目中：import * as echarts from 'echarts'; const chart = echarts.init(domEl); chart.setOption(options);
  console.log('渲染 ECharts options 到 DOM：', dom);
  console.log(options);
}

/* ---------- 6. 顶层流程：校验 -> 构建 param -> 调用后端 -> 合并 -> 渲染 ---------- */
// 流程编排：串联第 1~5 步并返回执行结果，供组件调用
async function generateAndRender(rawConfig, dom) {
  // 1. 校验并清理
  const { ok, data, errors } = validateAndSanitize(rawConfig);
  if (!ok) {
    // 在真实场景中把 errors 转换为前端友好提示展示
    console.warn('校验失败：', errors);
    // 返回错误用于上层处理
    return { ok: false, errors };
  }

  // 2. 构建后端参数
  const params = buildParamsFromConfig(data);

  // 3. 请求后端
  const resp = await fetchRenderData(params);
  if (!resp.ok) {
    console.error('后端请求失败：', resp.error);
    return { ok: false, error: resp.error };
  }

  // 4. 合并生成 options
  const options = mergeToEchartsOptions(resp.data, data);

  // 5. 渲染（组件内替换为实际 echarts 渲染逻辑）
  renderEchart(options, dom);

  return { ok: true, options };
}

/* ---------- 快速自测（示例用法） ---------- */
// 开发期自测：使用模拟 userConfig 跑完整流程
async function _selfTest() {
  const result = await generateAndRender(userConfig, 'chart-container');
  if (!result.ok) {
    console.error('生成失败：', result);
  } else {
    console.log('生成成功，options 准备好', result.options);
  }
}
// 注：取消注释以本地快速测试
// _selfTest();
