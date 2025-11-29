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



### 2. JS 主线程 与 Worker 线程数据传递



### 3. 监听错误信息



### 4. 关闭 Worker 线程



### 5. Worker 线程引用其他 JS 文件



### 6. ESModule 模式



### 5. 主线程 和 Worker 线程 可传递的数据类型