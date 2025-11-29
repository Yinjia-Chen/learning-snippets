// demo.worker.js worker线程
self.addEventListener('message', e => {
  console.log(e.data); // 主线程发送的消息
  self.postMessage('来自 worker 线程的消息'); // 向主线程发送消息
})