// 数字枚举
enum Color {
  Red, // 枚举值默认从 0 开始递增
  Green, // 1
  Blue // 2
}
let c: Color = Color.Green;
console.log(c); // 1
console.log(Color[1]); // Green

// 字符串枚举
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
let d: Direction = Direction.Left;
console.log(d); // LEFT