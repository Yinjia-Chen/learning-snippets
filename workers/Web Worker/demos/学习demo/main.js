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