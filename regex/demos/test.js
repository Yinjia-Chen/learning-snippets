const text = "Item: A-12, B-7, A-34.";

// 1. test：是否存在匹配
const testRes = /A-\d+/.test(text) // 字符串"A-xxx"，\d表示数字，+表示可以是1个or多个重复(只作用于前一个表达式)
console.log("testRes:", testRes); // true


