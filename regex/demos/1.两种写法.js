// 创建一个正则表达式

// 1. 字面量写法
const regexp1 = /abc/;

// 2. 构造函数写法：入参是字符串
// const regexp2 = new RegExp("123")
const regexp2 = new RegExp(123) // js 会自动 ToString

// 这两种写法都是匹配连续字符字串 即是否存在子串 "abc" "123"

console.log(Object.prototype.toString.call(regexp1)); // [object regexp1]
console.log(typeof regexp1); // object
console.log(regexp1); // /abc/
console.log(regexp2); // /123/