const s = "a1b22c333";

[...s.matchAll(/\d+/g)].map(m => m[0]); // ["1", "22", "333"]

for (const m of s.matchAll(/\d+/g)) {
  console.log(m[0], m.index); // "1" 1, "22" 3, "333" 6
}