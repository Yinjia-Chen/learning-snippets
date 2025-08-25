// 基本文本
const text = "Items: A-12, B-7, A-34.";

// exec：配合 g 循环拿到每个匹配的分组与索引
const re = /([A-Z])-(\d+)/g;
let m;
while ((m = re.exec(text)) !== null) {
  // m[0] 整体匹配；m[1]/m[2] 分组；m.index 起始位置
  console.log("exec:", { match: m[0], letter: m[1], number: m[2], index: m.index });
}
