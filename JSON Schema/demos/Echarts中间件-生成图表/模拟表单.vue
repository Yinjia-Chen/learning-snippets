<!-- 放到 https://play.vuejs.org/ 上运行 -->

<template>
  <div class="container">
    <div class="cols">
      <section class="card">
        <h3>数据配置</h3>

        <label>图表类型（chartType）</label>
        <select v-model="form.chartType">
          <option v-for="t in chartTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>

        <!-- Axis fields (for axis-based charts) -->
        <div v-if="isAxis">
          <label>X 轴字段（xField）</label>
          <select v-model="form.dataConfig.xField">
            <option value="">— 选择 —</option>
            <option v-for="f in xFieldOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>

          <label>Y 轴字段（yFields，逗号分隔）</label>
          <input v-model="yFieldsText" placeholder="例如：net_value,cumulative_return" />
        </div>

        <!-- Name/Value for pie/treemap/heatmap -->
        <div v-if="showNameValue">
          <label>名称字段（nameField）</label>
          <input v-model="form.dataConfig.nameField" />

          <label>数值字段（valueField）</label>
          <input v-model="form.dataConfig.valueField" />
        </div>

        <!-- nodes for treemap -->
        <div v-if="form.chartType === 'treemap'">
          <label>节点（nodes，JSON）</label>
          <textarea v-model="nodesText" rows="5"></textarea>
        </div>

        <h4 style="margin-top:10px">过滤条件</h4>
        <label>开始时间（timeFilter.startTime）</label>
        <input v-model="form.dataConfig.filter.timeFilter.startTime" placeholder="2025-01-01T00:00:00Z" />
        <label>结束时间（timeFilter.endTime）</label>
        <input v-model="form.dataConfig.filter.timeFilter.endTime" placeholder="2025-12-31T23:59:59Z" />

        <label>行业过滤（industryFilter，逗号分隔）</label>
        <input v-model="industryText" />
        <label>产品过滤（productFilter，逗号分隔）</label>
        <input v-model="productText" />
      </section>

      <section class="card">
        <h3>ECharts 配置</h3>

        <label>子配置（根据图表类型显示）</label>

        <div v-if="form.chartType === 'line'" class="sub">
          <h4>折线图设置</h4>
          <label><input type="checkbox" v-model="form.echartsConfig.lineConfig.smooth" /> 平滑曲线（smooth）</label>
          <label><input type="checkbox" v-model="form.echartsConfig.lineConfig.showSymbol" /> 显示符号（showSymbol）</label>
          <label>线宽（lineWidth）</label>
          <input type="number" v-model.number="form.echartsConfig.lineConfig.lineWidth" />
        </div>

        <div v-if="form.chartType === 'pie'" class="sub">
          <h4>饼图设置</h4>
          <label>半径（radius，逗号分隔）</label>
          <input v-model="pieRadiusText" />
          <label><input type="checkbox" v-model="form.echartsConfig.pieConfig.showLabel" /> 显示标签（showLabel）</label>
        </div>

        <div v-if="form.chartType === 'treemap'" class="sub">
          <h4>矩形树图设置</h4>
          <label>最小可见值（visibleMin）</label>
          <input type="number" v-model.number="form.echartsConfig.treemapConfig.visibleMin" />
          <label><input type="checkbox" v-model="form.echartsConfig.treemapConfig.breadcrumb" /> 面包屑（breadcrumb）</label>
        </div>

        <div v-if="form.chartType === 'scatter'" class="sub">
          <h4>散点图设置</h4>
          <label>点大小（symbolSize）</label>
          <input type="number" v-model.number="form.echartsConfig.scatterConfig.symbolSize" />
          <label><input type="checkbox" v-model="form.echartsConfig.scatterConfig.regression" /> 回归线（regression）</label>
        </div>

        <div v-if="form.chartType === 'heatmap'" class="sub">
          <h4>热力图设置</h4>
          <label>渐变颜色（gradient，逗号分隔）</label>
          <input v-model="heatmapGradientText" />
          <label>最小值（minValue）</label>
          <input type="number" v-model.number="form.echartsConfig.heatmapConfig.minValue" />
          <label>最大值（maxValue）</label>
          <input type="number" v-model.number="form.echartsConfig.heatmapConfig.maxValue" />
        </div>

        <h4 style="margin-top:12px">样式设置</h4>
        <label>颜色（colors，逗号分隔）</label>
        <input v-model="colorsText" />
        <label><input type="checkbox" v-model="form.echartsConfig.styleConfig.legendShow" /> 显示图例（legendShow）</label>
        <label>图例位置（legendPosition）</label>
        <select v-model="form.echartsConfig.styleConfig.legendPosition">
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
          <option value="left">左侧</option>
          <option value="right">右侧</option>
        </select>
      </section>

      <aside class="card aside">
        <h3>业务配置</h3>
        <label>模板（template）</label>
        <select v-model="form.businessConfig.template">
          <option value="net_value_trend">净值走势</option>
          <option value="drawdown_analysis">回撤分析</option>
          <option value="factor_exposure">因子暴露</option>
          <option value="position_distribution">仓位分布</option>
          <option value="return_attribution">收益归因</option>
        </select>

        <label><input type="checkbox" v-model="form.businessConfig.showTotal" /> 显示总计（showTotal）</label>

        <label>导出类型（exportType，逗号分隔）</label>
        <input v-model="exportTypeText" />

        <label>权限（permission）</label>
        <input v-model="form.businessConfig.permission" />

        <div style="margin-top:12px">
          <button class="btn" @click="loadDemo">加载 demo</button>
        </div>
      </aside>
    </div>

      <div class="preview">
      <h4>JSON 预览（只读）</h4>
      <pre>{{ prettyJson }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const chartTypes = [
  { value: 'line', label: '折线图' },
  { value: 'bar', label: '柱状图' },
  { value: 'pie', label: '饼图' },
  { value: 'radar', label: '雷达图' },
  { value: 'waterfall', label: '瀑布图' },
  { value: 'treemap', label: '矩形树图' },
  { value: 'scatter', label: '散点图' },
  { value: 'heatmap', label: '热力图' }
]

const xFieldOptions = [
  { value: 'date', label: '日期' },
  { value: 'industry', label: '行业' },
  { value: 'product_code', label: '产品代码' },
  { value: 'risk_level', label: '风险等级' },
  { value: 'scale', label: '规模' }
]

const form = reactive({
  chartType: 'line',
  dataConfig: {
    xField: '',
    yFields: [],
    nameField: 'name',
    valueField: 'value',
    nodes: [],
    filter: { timeFilter: { startTime: '', endTime: '' }, industryFilter: [], productFilter: [] }
  },
  echartsConfig: {
    lineConfig: { smooth: true, showSymbol: true, lineWidth: 2 },
    pieConfig: { radius: [0,70], showLabel: true },
    treemapConfig: { visibleMin: 10, breadcrumb: true },
    scatterConfig: { symbolSize: 6, regression: false },
    heatmapConfig: { gradient: ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'], minValue: null, maxValue: null },
    styleConfig: { colors: ['#1890ff','#2fc25b','#facc15'], legendShow: true, legendPosition: 'top' }
  },
  businessConfig: { template: 'net_value_trend', showTotal: true, exportType: ['png'], permission: 'research_chart' }
})

const isAxis = computed(() => ['line','bar','radar','waterfall'].includes(form.chartType))
const showNameValue = computed(() => ['pie','treemap','heatmap'].includes(form.chartType))

const yFieldsText = computed({
  get: () => form.dataConfig.yFields.join(','),
  set: v => { form.dataConfig.yFields = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const nodesText = computed({
  get: () => JSON.stringify(form.dataConfig.nodes || [], null, 2),
  set: v => { try { form.dataConfig.nodes = v ? JSON.parse(v) : [] } catch { form.dataConfig.nodes = null } }
})

const colorsText = computed({
  get: () => form.echartsConfig.styleConfig.colors.join(','),
  set: v => { form.echartsConfig.styleConfig.colors = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const pieRadiusText = computed({
  get: () => (form.echartsConfig.pieConfig.radius || []).join(','),
  set: v => { form.echartsConfig.pieConfig.radius = v.split(',').map(s => Number(s)) }
})

const industryText = computed({
  get: () => (form.dataConfig.filter.industryFilter || []).join(','),
  set: v => { form.dataConfig.filter.industryFilter = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const productText = computed({
  get: () => (form.dataConfig.filter.productFilter || []).join(','),
  set: v => { form.dataConfig.filter.productFilter = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const heatmapGradientText = computed({
  get: () => (form.echartsConfig.heatmapConfig.gradient || []).join(','),
  set: v => { form.echartsConfig.heatmapConfig.gradient = v.split(',').map(s => s.trim()).filter(Boolean) }
})

const exportTypeText = computed({
  get: () => (form.businessConfig.exportType || []).join(','),
  set: v => { form.businessConfig.exportType = v.split(',').map(s => s.trim()).filter(Boolean) }
})

function loadDemo(){
  form.chartType = 'line'
  form.dataConfig.xField = 'date'
  form.dataConfig.yFields = ['net_value','cumulative_return']
  form.dataConfig.nameField = 'name'
  form.dataConfig.valueField = 'value'
  form.dataConfig.nodes = [{ name: 'A', value: 40 }, { name: 'B', value: 60 }]
  form.dataConfig.filter.timeFilter.startTime = '2025-01-01T00:00:00Z'
  form.dataConfig.filter.timeFilter.endTime = '2025-12-31T23:59:59Z'
  form.dataConfig.filter.industryFilter = ['科技','金融']
  form.dataConfig.filter.productFilter = ['PROD_001','PROD_002']

  form.echartsConfig.styleConfig.colors = ['#1890ff','#2fc25b','#facc15']
  form.echartsConfig.lineConfig = { smooth: true, showSymbol: true, lineWidth: 2 }

  form.businessConfig.template = 'net_value_trend'
  form.businessConfig.showTotal = true
  form.businessConfig.exportType = ['png','pdf']
  form.businessConfig.permission = 'research_chart'
}

const prettyJson = computed(() => JSON.stringify(form, null, 2))
</script>

<style scoped>
.container { padding:16px; font-family: Arial, "Microsoft YaHei", sans-serif; }
.cols { display:flex; gap:16px; align-items:flex-start; }
.card { width:420px; background:#fff; padding:12px; border:1px solid #eee; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.03); }
.aside { width:360px; }
label { display:block; margin-top:8px; font-weight:600; font-size:13px; }
input, select, textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; }
.sub { background:#fafafa; padding:8px; margin-top:8px; border-radius:4px; border:1px dashed #eee; }
.preview { margin-top:16px; background:#fafafa; padding:12px; border-radius:6px; border:1px solid #eee; }
pre { background:#fff; padding:12px; border-radius:4px; overflow:auto; max-height:380px; }
.btn { padding:8px 10px; border-radius:4px; border:none; background:#1890ff; color:#fff; cursor:pointer; }
</style>