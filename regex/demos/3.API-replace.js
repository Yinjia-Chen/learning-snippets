// 基本文本
const text = "Items: A-12, B-7, A-34.";

// replace：使用分组重排/脱敏
const masked = text.replace(/([A-Z])-\d+/g, "$1-XX"); // 保留字母，掩码数字
console.log("replace:", masked); // "Items: A-XX, B-XX, A-XX"