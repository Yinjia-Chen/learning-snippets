# for 循环相关问题

> 本次讨论内容：for，for of，forEach，arr.map，for in 相关问题

## 1. 相关概念

### 1.1 for

最常见的循环，用索引作遍历，`for ( let i = 0; i < condition; i ++ ) {}`

### 1.2 for of

遍历可迭代对象，`for char of str`

可迭代对象：

- 数组 Array ：遍历数组元素值
- 字符串 String ：遍历每个字符
- 哈希 Map ：遍历 [key, value] 键值对数组
- 哈希 Set ：遍历集合中的每个值
- 类数组对象：arguments、DOM集合（NodeList）
- 其他

### 1.3 forEach

遍历并执行回调，使用局限性较大，只可用于内置 `forEach` 的特殊对象

比如：Array，Set，Map，类数组

- `arr.forEach((item, index) => {})`
- `set.forEach((value) => {})`
- `map.forEach((value, key) => {})`

### 1.4 arr.map

遍历并执行回调，回调返回一个新数组，新数组由原数组中每个元素调用一次提供的函数后的返回值组成

`arr.map((x) => x * 2)`

### 1.5 for in

遍历对象：枚举自身及可继承的属性（名）（忽略symbol引用类型）`for (let key in obj) {}`

遍历数组：遍历数组索引（及数组对象的可枚举属性） `for (let key in arr) {}`

注意：使用 for in 遍历 obj 的时候，会自动遍历 obj 原型的属性

解决：搭配 `obj.hasOwnProperty(key)` 使用，判断是否是自身属性，是则返回 true

## 2. 性能比较

for > for of > forEach > arr.map > for in

解析：

- for **没有函数调用开销**，采用索引方式遍历，性能最好
- for of 调用**迭代器接口**，遍历可迭代对象，涉及额外的对象创建和方法引用，**性能接近 for**
- forEach 数组方法，**需调用回调函数**（遍历并执行回调），有**函数调用开销**
- arr.map **需调用回调函数**，同样有函数调用开销，还需要**返回一个新数组**，因此性能更差
- for in 遍历对象属性，遍历同时**检查该类型是否可枚举**（symbol 不可），同时会**遍历原型链**，性能最差

## 3. 使用选择

### 3.1 一般情况

普通遍历：需要索引用 for，不需要索引用 for of

需要调用回调函数：需要返回数组用 map，原数组用 forEach

遍历对象：for in

### 3.2 异步处理必须使用 for of

```javascript
// WRONG : await 无效 所有回调不一定能按顺序执行
arr.forEach(async (item) => {
	await do sth
})

// 按顺序执行
for(const item of arr){
    await do(item)
}
```

原因：forEach 中的 await 只阻塞回调函数的执行，不阻塞 forEach 的入（调用）栈；for of 直接迭代，每次迭代都会等回调执行结束后进入下一次迭代
