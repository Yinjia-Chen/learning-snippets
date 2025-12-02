// demo.worker.js

self.addEventListener('message', e => {
  self.postMessage(e.data); // 返回接收到的消息
})