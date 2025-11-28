* 定义：编译后用于约束 JSON 串
* 关键字：
  * 必填：required
  * 禁止多余字段：additionalProperties: false
  * 数组的元素类型：item `{ "type": "array", "items": { "type": "string" } }`
  * 条件分支：oneOf / anyOf / allOf / not
