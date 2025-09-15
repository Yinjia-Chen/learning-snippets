# VxeTable  [官方文档](https://vxetable.cn/#/demo/list)

> vxe 是基于 Vue 的 UI 组件库生态，涵盖表格、表单等多种组件，专注于企业级应用场景。
> vxe-table 是 vxe 生态中的核心表格组件，专注于解决复杂表格场景，支持大数据、编辑、虚拟滚动等功能。

------

[API](https://vxetable.cn/v4/#/table/api?apiKey=table)

使用示例：

```vue
<template>
  <div>
    <vxe-table class="debug" :data="tableData" >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="name" title="Name"></vxe-column>
      <vxe-column field="sex" title="Sex"></vxe-column>
      <vxe-column field="age" title="Age"></vxe-column>
      <vxe-column field="a" title="N"></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
const tableData = [
  { name: '小王', sex: '男', age: 18, a: 60 },
  { name: '小张', sex: '女', age: 8, a: 'b' },
]
</script>

<style scoped>
.debug {
  width: 900px;           /* 调试期固定宽度 */
}</style>
```

