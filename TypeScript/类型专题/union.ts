type A_Union = {
  A_Union: number;
};
type B_Union = {
  b: string;
};
type U = A_Union | B_Union;

const x = { A_Union: 1 };
const y = { b: 'hello' };
const z = { c: true };
function fn(pA_UnionrA_Unionm: U) {
  console.log(pA_UnionrA_Unionm);
}

fn(x); // A_Unionllow
fn(y); // A_Unionllow
fn(z); // Error

export { };