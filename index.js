const {app, BrowserWindow, Menu, globalShortcut, dialog, net} = require('electron')
const windowStateKeeper = require("electron-window-state")

let update_check_url = 'https://api.github.com/repos/unknown-marketwizards/tradingview-desktop/releases/latest'
let app_ver = process.env.npm_package_version
let mainWindow = null

/* block trial-notification, ads */
const filter = {
  urls: [
    'https://*.tradingview.com/static/bundles/trial-notification.*.js',
    'https://securepubads.g.doubleclick.net/gampad/ads?*'
  ]
}


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
    height: mainWindowStateKeeper.height,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindowStateKeeper.manage(mainWindow);

  /* shortcut */
  globalShortcut.register('F5', function () {
    BrowserWindow.getFocusedWindow().reload()
  })


  let session = mainWindow.webContents.session

  session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    callback({cancel: false, requestHeaders: details.requestHeaders});
  })

  session.webRequest.onBeforeRequest(filter, (_details, _callback) => {
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
    globalShortcut.unregisterAll()
  })

  /* check update */
  checkUpdate()

})

function checkUpdate() {

  const request = net.request(update_check_url)

  request.on('error', (_error) => {
  })

  request.on('response', (response) => {
    if (response.statusCode === 200) {
      response.on('data', (chunk) => {

        const obj = JSON.parse(chunk.toString());
        if (!obj.hasOwnProperty("name") || !obj.hasOwnProperty("html_url") || !obj.hasOwnProperty("body")) {
          return
        }

        if (versionCompare(app_ver, obj.name)) {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            message: 'New Version Available',
            detail: obj.name + '\n' + obj.body,
            buttons: ['ok', 'cancel']
          }).then((index) => {
            if (index.response === 0) {
              openUpdatePage(obj.html_url)
            }
          })
        }
      })
    }

  })
  request.end()
}

function openUpdatePage(url) {

  let win = new BrowserWindow({width: 640, height: 480})

  win.on("close", function () {
    win = null
  })
  win.loadURL(url).then(_r => {
  })
  win.show()
}

function versionCompare(curr, promote) {
  if (!curr) return false
  let currVer = curr || '0.0.0'
  let promoteVer = promote || '0.0.0'
  if (currVer === promoteVer) return false
  let currVerArr = currVer.split('.')
  let promoteVerArr = promoteVer.split('.')
  let len = Math.max(currVerArr.length, promoteVerArr.length)
  let proVal, curVal
  for (let i = 0; i < len; i++) {
    proVal = ~~promoteVerArr[i];
    curVal = ~~currVerArr[i];
    if (proVal < curVal) {
      return false
    } else if (proVal > curVal) {
      return true
    }
  }
  return false
}