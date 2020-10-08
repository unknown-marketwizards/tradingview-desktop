const {app, BrowserWindow, Menu} = require('electron')
const windowStateKeeper = require("electron-window-state")

let mainWindow = null

app.on('ready', function () {
  let mainWindowStateKeeper = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 700
  })

  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height
  })
  mainWindowStateKeeper.manage(mainWindow);

  let session = mainWindow.webContents.session

  session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    callback({cancel: false, requestHeaders: details.requestHeaders});
  })

  /* get lang */
  session.cookies.get({
    url: 'https://www.tradingview.com',
    name: 'langCode'
  }).then((cookies) => {
    let langCode = 'www'
    if (cookies.length > 0) {
      langCode = cookies[0].value
    }

    mainWindow.loadURL('https://' + langCode + '.tradingview.com/chart/').then(_r => {
    })
  })

  /* block trial-notification */
  const filter = {urls: ["https://*.tradingview.com/static/bundles/trial-notification.*.js"]}
  session.webRequest.onBeforeRequest(filter, (_details, _callback) => {
  })

  mainWindow.webContents.on('will-prevent-unload', function (event) {
    event.preventDefault()
  })

  mainWindow.webContents.on('did-navigate', function (event, url, httpResponseCode) {
    if (httpResponseCode !== 200) {
      return
    }

    /* set lang */
    const subCode = url.match('https://(.*?)\\.tradingview.com');
    if (subCode) {
      let code = subCode[1]
      session.cookies.set({
        url: 'https://www.tradingview.com',
        name: 'langCode',
        value: code,
        expirationDate: Math.floor(new Date().getTime() / 1000) + 360000000
      }).then(_r => {
      })
    }
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})