# Web Worker

------

## 介绍

### 定义

- H5 标准的一部分
- 用于开辟新的 Worker 线程，可以用 Worker 线程处理运算任务，**不阻塞 JS 线程**

### 上下文

- 禁用：window、parent、document
- 仅可读：location、navigator
- **顶级全局：self**

------

## 使用

### 1. 创建 Worker

- `const worker = new Worker(path, options)`
- 参数：
  - `path` ：遵循同源策略且有效的 `.worker.js` 文件路径，否则报错 `SECURITY_ERR`
  - `options` ：三个可选项 `options.type` & `options.credentials` & `options.name`
    - `options.type` ：指定 `worker` 类型，可选 `classic` 或 `module` ，默认 `classic` 
    - `options.credentials` ：指定 worker 凭证，可选 `omit` / `same-origin` / `include` ，默认 `omit`（无凭证）
    - `options.name` ：在 `DedicatedWorkerGlobalScope`  时，表示 `worker` 的 `scope` 的一个 `DOMString` 值，主要用于调试
  



### 2. JS 主线程 与 Worker 线程数据传递

- 统一
  - 使用 `postMessage` 发送消息
  - 监听 `message` 事件接收消息

- 示例：

```javascript
// main.js 主线程

const myWorker = new Worker('./demo.worker.js') // 创建 worker
// const myWorker = new Worker(new URL('./demo.worker.js', import.meta.url)) // 绝对路径版

// 接收 worker 线程的消息
// e 泛指浏览器触发 message 事件时传入的 MessageEvent 对象
myWorker.addEventListener('message', e => {
  console.log(e.data); // 打印 worker 线程发送的消息
})

// 另一种写法
// myWorker.onmessage = e => {
//   console.log(e.data);
// }

myWorker.postMessage('来自 主线程 的消息')
```

```javascript
// demo.worker.js worker线程
self.addEventListener('message', e => {
  console.log(e.data); // 主线程发送的消息
  self.postMessage('来自 worker 线程的消息'); // 向主线程发送消息
})
```





### 3. 监听错误信息



### 4. 关闭 Worker 线程



### 5. Worker 线程引用其他 JS 文件



### 6. ESModule 模式



### 5. 主线程 和 Worker 线程 可传递的数据类型