# vue-curve-converter
- 一个基于 Vue + ElementUI 的面向曲线的 Gcode 生成器，欢迎借鉴。<br>
- 支持使用鼠标交互，在选择曲线的类型并选择常数提交表单后，生成代码并可以下载。<br>
- 拟合算法是用 Matlab 先完成的，再用 JavaScript 改写存放于 /src/lib/algorithm 下面。
## 开发环境
1. 编程语言：JavaScript
2. 前端框架：Vue.js 2.x + ElementUI
3. 渲染引擎：Three.js
4. 编程环境：Visual studio code
## 示例
### 输入被拟合曲线
![Snipaste_2021-07-14_22-44-29.png](https://s2.loli.net/2022/09/13/BwDnZpvo7k2JEjh.png)
### 拟合并执行仿真动画
![Snipaste_2021-07-14_22-45-14.png](https://s2.loli.net/2022/09/13/Ba4rCDGm1wuIxTg.png)
### 生成 Gcode 指令
![Snipaste_2021-07-14_22-45-34.png](https://s2.loli.net/2022/09/13/9p1AHRyudONv8jk.png)
## 本地运行
1. 克隆项目到本地，使用 vs code 打开该项目
2. 到文件根目录下运行终端，输入
~~~
npm install
~~~
3. 再启动项目
~~~
npm run serve 
~~~
4. 生成静态资源
~~~
npm run build
~~~
