# Schema 设计思路（简洁版）

目的
- 约束投研场景下图表配置的 JSON 结构，保证前端表单、后端校验和图表渲染之间的数据契约一致。
- 支持多种图表类型（折线、柱状、饼图、矩形树图、散点、热力图等），并能根据类型只校验/渲染对应字段。

总体结构
- 根对象包含三块主数据：`chartType`、`echartsConfig`、`businessConfig`。
	- `chartType`（根级枚举）决定变体（oneOf）。
	- `echartsConfig` 保存各类型的子配置（如 `lineConfig`、`pieConfig`、`treemapConfig`）和通用样式 `styleConfig`。
	- `businessConfig` 存放业务层参数（模板、导出类型、权限等），与可视化渲染解耦。

变体设计（oneOf）
- 使用 `oneOf` 在根级按 `chartType` 匹配不同的 `dataConfig`：
	- Treemap：`nameField` / `valueField` / `nodes（递归）`。
	- Pie：`nameField` / `valueField`。
	- Scatter / Heatmap：`xField` / `yFields` / `valueField`（heatmap）等。
	- Axis（line/bar/radar/waterfall）：`xField` / `yFields`。
- 优点：表单生成器可以根据根级 `chartType` 只渲染对应字段，校验也更精确。

数据模型关键点
- `definitions.node`：用于 treemap 的递归节点定义（name/value/children），支持任意深度树。
- `additionalProperties: false`：禁止未声明字段，保证数据干净，便于后端严格校验。
- `required`：根级必须包含 `chartType`、`echartsConfig`、`businessConfig`。变体中声明各自必填字段。
- `default`：在样式与子配置中提供默认值，配合 AJV 的 `useDefaults` 可在前端自动填充。
- `errorMessage`：配合 `ajv-errors` 给出友好错误提示（如“必须选择图表类型”）。

实现与运作流程（建议）
1. 前端生成表单后，使用 AJV 校验并：
	 - `useDefaults` 填充默认值；
	 - `removeAdditional: 'all'` 清除多余字段；
	 - 若校验失败，将 `validate.errors` 转换为字段级提示并展示。
2. 将校验/清理后的对象映射为后端所需 `params`（示例：{chartType, data, style, business}）。
3. 后端按 `chartType` 聚合/查询并返回渲染数据（约定返回字段如 `series`, `xAxis`, `yAxis`, `nodes`, `visualMap`）。
4. 前端合并用户配置与后端数据，生成 ECharts `options` 并渲染。

设计要点与建议
- 把 `chartType` 放根级是关键：多数表单生成器和校验器更容易根据根级 `oneOf` 做变体选择。
- 若目标生成器支持，考虑使用 `discriminator`（draft-2019-09/2020-12）替代 `oneOf` 作更稳定的变体分发。
- UI 层仍应做条件显示（兼容生成器差异）：即使 schema 已经分了变体，也在渲染层用 `v-if`/uiSchema 隐藏不相关控件。
- 在 treemap 等需要树编辑的场景，前端提供树编辑器或 JSON 编辑器，并在提交前校验节点结构。

示例（简短）
- Axis（折线）返回对象示例：
```
{
	"chartType": "line",
	"dataConfig": { "xField":"date", "yFields":["net_value"] },
	"echartsConfig": { "lineConfig":{ "smooth":true }, "styleConfig":{ "colors":["#1890ff"] } },
	"businessConfig": { "template":"net_value_trend" }
}
```

- Treemap（树图）返回对象示例：
```
{
	"chartType": "treemap",
	"dataConfig": { "nameField":"name","valueField":"value","nodes":[{"name":"A","value":60}] },
	"echartsConfig": { "treemapConfig":{ "visibleMin":10 } },
	"businessConfig": { "template":"position_distribution" }
}
```

小结（一句话）
- 以根级 `chartType + oneOf` 分支变体、用 `definitions` 支持递归、并结合 `additionalProperties:false` 与 `default`/`errorMessage`，能在保证数据干净、校验友好和 UI 渲染一致性之间取得良好平衡。

如果你需要，我可以：
- 生成一组示例 JSON 文件（line/pie/treemap）并保存到 `demos/Echarts/`；或
- 把 schema 改写为带 `discriminator` 的 draft-2020-12 版本（需确认生成器支持）。

