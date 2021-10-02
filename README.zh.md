# 非官方 TradingView 桌面版

非官方 TradingView 桌面版使用 [Electron](https://www.electronjs.org) 构建

![](assets/images/screenshot.png)

# 特性

* 拦截广告
* 拦截试用通知窗口
* 刷新（F5 或 Ctrl+R）
* 检查新版本

# 解决登陆失败问题

如果登陆时遇到下面错误

> You have been locked out due to too many login attempts. Please try again later.

可以通过下面步骤解决：

* 点击左上角菜单
* 选择 Home
* 选择 ZH 简体中文
* 重新登陆

# 如何构建

* 安装 [Node.js](https://nodejs.org)

* 打开 终端 / PowerShell / Cmd

* Clone 本仓库

  ```bash
  git clone https://github.com/unknown-marketwizards/tradingview-desktop.git
  ```

* 进入文件夹

  ```bash
  cd tradingview-desktop
  ```

* 下载 electron

  ```bash
  npm install
  ```

* 构建

  ```bash
  npm run build
  ```

---
欢迎加入`交易奇才 Slack 交流群`，让我们一起成为更好的交易者！

![](assets/images/qrcode.jpeg)

> 可扫码关注公众号，并回复：**加群**