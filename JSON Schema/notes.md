# JSON Schema 教程

> 官网：[JSON Schema](https://json-schema.org/)

## 一、概念与目的

> 概括：用结构化的方式描述 JSON 的 “形状” 和 “约束”，便于验证、生成文档与校验输入

### 目的

- 生成表单 + 校验 JSON

### 概念

1. Schema = 规则集合（约束字段类型、必填项、格式、数值/长度范围等）
2. 校验器（validator）用 schema 检查 JSON 是否符合规则（常用 ajv 外部依赖）
3. JSON Schema 本身是 JSON 格式



## 二、常用关键字

> 官方文档：[JSON Schema - Type-specific Keywords](https://json-schema.org/understanding-json-schema/reference/type#type-specific-keywords)

- anyOf / oneOf / allOf 控制 子 schema
  - anyOf：至少满足其中一个子 schema
  - oneOf：必须且仅满足一个子 schema
  - allOf：必须同时满足所有子 schema
- $schema: 本 schema 遵循的草案，用以决定关键字的有效性和解析规则，例如："https://json-schema.org/draft/2020-12/schema"
- $id: 指定的全局标识符 / 基准 URI，可以是 http 等网络地址，也可以是本地相对/绝对路径，在当前 schema 跨服务/文件使用时用到
- title: 标题名
- description: 描述
- type: "string" | "number" | "integer" | "boolean" | "object" | "array" | "null"
- properties: 对象字段（及其 schema）
- required: 必填字段数组
- additionalProperties: 是否允许未声明字段（false 用于严格校验）默认true
- items: 数组元素的 schema（单一 schema 或 schema 列表）`{ "type": "array", "items": { "type": "string" } }`
- enum: 枚举限制
- pattern: 正则（适用于字符串）（注意 \ 在 JSON 中写为 \\）
- format: 常见格式（"email", "date-time", "uri"等，依赖校验器）（校验时要安装 ajv-formats 依赖）
- minimum/maximum、minLength/maxLength、minItems/maxItems
- examples: 合格的实例


### 最小示例

Schema：

```json
{
    "allOf":[
        {
            "type": "object",
            "properties": {
                "name": { "type": "string", "minLength": 1 },
                "age": { "type": "integer", "minimum": 0 },
                "email": { "type": "string", "format": "email" },
                "tags": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["name", "email"],
            "additionalProperties": false
        }
    ]
}
```

合格实例：

```json
{
    "name": "张三",
    "age": 30,
    "email": "zhang@example.com",
    "tags": ["dev", "json"]
}
```

### 使用流程

1. 设计 schema：列出字段、类型、必填与边界（是否可以写未规定的字段）

   ```json
   // xxx.schema.json
   {
       ...
   }
   ```

2. 编译 schema：引入并解析 schema，调用 ajv 解析 schema

   ```javascript
   // xxx.js 实际使用 安装依赖 ajv
   import userSchema from 'schema路径' // 引入 schema
   import Ajv from 'ajv' // 引入校验依赖
   const ajv = new Ajv(); // 创建依赖对象
   const validate = ajv.compile(userSchema) // 编译 schema 生成校验器
   ```

3. 校验 JSON：调用校验器，处理错误信息并反馈

   ```javascript
   const validateRes = validate(userConfig) // 假设 userConfig 已有（待校验的 json 串），校验成功则为 true，否则 false
   if (!validateRes) console.log(validate.errors) // 校验失败时的原始对象数组
   ```




## 三、结论

用 JSON Schema 明确数据契约，优先定义必填与禁止多余字段，配合稳定的校验器在入参层拦截错误，能显著提高接口健壮性与可维护性。