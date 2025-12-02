const obj = { name: 'kya' };

const obj2 = JSON.parse(JSON.stringify(obj));

console.log(obj === obj2); // false

// 深拷贝拷贝对象的值，不拷贝地址，比较是比较对象的地址