# TypeScript

### 定义：是 JS 的超集，完全兼容 JS

------

### 数据类型：

1. 基于 JS 的基础类型：string、boolean、number、null、undefined、object、bigInt、symbol、......
2. **着重**讲 TS 特有数据类型：any、enum、tuple、union、intersection

#### any：任意类型

​	用于跳过类型校验，是一种不安全的类型，用于保证 TS 规范但无需约束的参数或返回值

#### enum：枚举类型

​	是一组常量的集合，用 {  } 包裹，用 具名标识 代替 数字或字符串

#### tuple：元组

​	本质是一个数组，但是数组中可以存放各种数据类型的元素，不如 js 一般一个数组中只能有一种元素

#### union：联合

​	A | B，A和B任意一种类型都可以

#### intersection：交叉

​	A & B，A和B两种类型都要有

#### Record：映射

------


### 相关概念：

#### 泛型：

​	在定义时不固定具体类型，将类型作为一个参数（占位符）T，表示可替换的类型，在使用时由编译器自动推断并约束类型

```typescript
function indentify<T>(x: T): T { return x; } // 泛型函数 identify，类型参数 T，总称泛型

// 使用
identify<number>(123); // 123，人为注入 T = number
identify('hello'); // hello，编译器自动推断 T = string
```



#### type 类型别名：

​	为类型创建别名

```typescript
type ID = number | string;
type Point = { x: number; y: number; };
type ReadonlyPoint = Readonly<Point>;
```



#### interface 接口：

​	定义对象的结构

```typescript
interface User {
  id: number;
  name: string;
  greet(msg: string): void;
}
```



#### type VS interface

| 特性              | type                                        | interface                               |
| ----------------- | ------------------------------------------- | --------------------------------------- |
| 定义范围          | 可定义任意类型（基础类型/联合/交叉/元组等） | 仅定义 对象/函数/类                     |
| 扩展方式          | 支持 & 交叉类型，不可重复声明同名 type      | 支持 extends 继承，可重复声明，自动合并 |
| 类实现            | 不支持类（联合类型也不行）                  | 类可通过 implements 实现接口            |
| 索引类型/映射类型 | 完美支持映射类型、联合类型、元组类型        | 支持索引签名，映射类型支持有限          |



#### : 和 <>：

​	: 用于在 变量/参数/属性/返回 处注解类型

​	<> 用于泛型参数断言，声明 泛型的 类型参数 `<T>`



#### 索引签名：
