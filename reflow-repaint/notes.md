# 回流（重排）& 重绘
> 涉及**浏览器渲染**，一般作为**性能优化**的关键点

------

## 一、核心定义

- **回流（Reflow / Layout）**：浏览器计算元素的**几何信息**（宽、高、位置、盒模型等）。它会遍历渲染树并重新计算受影响节点的布局，代价高。
- **重绘（Repaint / Paint）**：在已知几何信息的前提下，把元素绘制成像素（颜色、阴影、边框等）。比回流便宜但也消耗资源。
- **回流一定伴随重绘，重绘不一定伴随回流**

> 概括：**“改变尺寸或位置 → 回流；改变样式颜色 → 重绘”**。

------

## 二、渲染流程（简写）

1. 解析 HTML → **DOM 树**
2. 解析 CSS → **CSSOM**
3. 合并 DOM + CSSOM → **Render Tree（渲染树）**（只包含可见节点）
4. **布局 / 回流（Layout）**：计算每个节点的大小与位置
5. **绘制 / 重绘（Paint）**：把每个节点绘制成像素到图层缓存（bitmaps）
6. **Display**：将像素发送给GPU，展示在页面上

> 重点：只有在步骤 4 改变时才会发生回流。重绘（步骤 5）则只需要已知几何时发生。

------

## 三、触发时机

- **会触发回流** 的例子：
  - `width / height`、`margin / padding`、`display` 切换
  - `position`、`top / left`（或 `float`）
  - 修改字体（`font-size`）、文本内容变化、DOM 增删、窗口 `resize`

- **只会触发重绘（不回流）** 的例子：
  - `color`、`background-color`、`box-shadow`、`outline`、`text-shadow`
  - `visibility: hidden`（注意：`display: none` 会回流）

- **合成层（Composite）优先，通常不触发回流/重绘**：
  - `transform`（`translate/scale/rotate`）与 `opacity`。

------

## 四、工程实践要点

- **优先原则**：能不回流就不回流；能只合成就只合成。
- **读写分离**：把所有读取布局的操作集中，再执行所有写入操作。
- **批量 DOM 操作**：用 `DocumentFragment` 或 `innerHTML` 聚合插入。
- **rAF（requestAnimationFrame）**：把视觉更新放到 rAF，避免跨多帧的小改动。
- **节流/防抖**：对 `scroll`、`resize` 等高频事件做 throttle/debounce。
- **谨慎使用 `will-change`**：短期提示浏览器提前创建图层，长期使用会浪费内存。
- **虚拟化长列表**：通过只渲染可视区域减少 DOM 节点（如 react-window）。
- **控制合成层数量**：合成层过多会占用大量 GPU/内存，需权衡。