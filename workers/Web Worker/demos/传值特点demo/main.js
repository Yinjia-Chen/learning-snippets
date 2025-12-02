// main.js

const myWorker = new Worker('./demo.worker.js');

const obj = { name: 'kya' };
myWorker.addEventListener('message', e => {
  console.log(e.data === obj); // 比较 发送过去的对象 和 直接返回的对象
})

myWorker.postMessage(obj)

// 输出：false