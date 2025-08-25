const text = "Item: A-12, B-7, A-34.";

// 1. test：是否存在匹配  RegExp.test(String)
const testRegex = /A-\d+/.test(text) // 字符串"A-xxx"，\d表示数字，+表示可以是1个or多个重复(只作用于前一个表达式)
console.log("testRes: ", testRegex); // true

// 2. match: 带 g 返回所有匹配项组成的数组，不带返回首个匹配项及相关内容的数组
// 2.1 有 g 返回所有匹配项组成的数组: String.match(/RegExp/g)
const matchRegex1 = text.match(/([A-Z])-(\d+)/g)
console.log("matchRes(with g): ", matchRegex1); // [ 'A-12', 'B-7', 'A-34' ]
// 2.2 无 g 返回首个匹配项及相关内容的数组: String.match(/RegExp/)
const matchRegex2 = text.match(/([A-Z])-(\d+)/)
console.log("matchRes(without g): ", matchRegex2); // ['A-12', 'A', '12', index: 6, input: 'Item: A-12, B-7, A-34.', groups: undefined]

// 3. replace: 简单替换  String.replace(/RegExp/, "str")
const str = 'Hello 123';
const ezReplaceRegex = str.replace(/\d+/, 'World');
console.log("ezReplaceRes: ", ezReplaceRegex); // Hello World