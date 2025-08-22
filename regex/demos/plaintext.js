// 基本文本
const text = "Items: A-12, B-7, A-34.";

// 1) test：是否存在匹配（true/false）
const hasMatch = /A-\d+/.test(text);
console.log("test:", hasMatch); // true

// 2) match：
// - 不带 g 返回第一个匹配及分组
console.log("match (no g):", text.match(/([A-Z])-(\d+)/));
// - 带 g 返回所有匹配的字符串列表（没有分组详情）
console.log("match (g):", text.match(/([A-Z])-(\d+)/g)); // ["A-12","B-7","A-34"]

// 3) exec：配合 g 循环拿到每个匹配的分组与索引
const re = /([A-Z])-(\d+)/g;
let m;
while ((m = re.exec(text)) !== null) {
  // m[0] 整体匹配；m[1]/m[2] 分组；m.index 起始位置
  console.log("exec:", { match: m[0], letter: m[1], number: m[2], index: m.index });
}

// 4) matchAll：一次性拿到所有匹配（含分组），返回迭代器
const all = [...text.matchAll(/([A-Z])-(\d+)/g)].map(x => ({
  match: x[0],
  letter: x[1],
  number: x[2],
  index: x.index
}));
console.log("matchAll:", all);

// 5) replace：使用分组重排/脱敏
const masked = text.replace(/([A-Z])-\d+/g, "$1-XX"); // 保留字母，掩码数字
console.log("replace:", masked); // "Items: A-XX, B-XX, A-XX"