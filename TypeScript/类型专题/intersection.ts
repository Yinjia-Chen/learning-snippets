type A_Intersection = {
  a: number;
}

type B_Intersection = {
  b: string;
}

type I = A_Intersection & B_Intersection;

function fn(params: I) {
  console.log(params);
}

fn({ a: 1 }); // Error 缺 b
fn({ b: 'hello' }); // Error 缺 a
fn({ a: 1, b: 'hello' }); // Allow
fn({ a: 1, b: 'hello', d:'' }); // Error 不能写未包含的属性

let y: { a: number } & { b: string };
y = { a: 1, b: 's' };

let tmp = { a: 1, b: 'hello', c: true };
let v: I = tmp; // Allow
console.log(v); // { a: 1, b: 'hello', c: true }

export { };