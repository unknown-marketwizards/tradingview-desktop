import {app, BrowserWindow, dialog, globalShortcut, Menu} from 'electron'
import windowStateKeeper from "electron-window-state"
import {checkUpdate} from './update'
import path from 'path'
import { register } from '@/common/ipc/main'

let mainWindow: BrowserWindow | null = null

function mainWin() {
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
            preload: path.join(__dirname, '../preload/index.js'),
            nodeIntegration: true
        }
    })
    mainWindowStateKeeper.manage(mainWindow);

    /* shortcut */
    globalShortcut.register('F5', function () {
        const w = BrowserWindow.getFocusedWindow()
        if (w) {
            w.reload()
        }
    })
    globalShortcut.register('CommandOrControl+R', function () {
        const w = BrowserWindow.getFocusedWindow()
        if (w) {
            w.reload()
        }
    })

    mainWindow.on('closed', function () {
        mainWindow = null
        globalShortcut.unregisterAll()
    })
}

function openUpdatePage(url: string) {

    let win: BrowserWindow | null = new BrowserWindow({width: 640, height: 480})

    win.on("close", function () {
        if (win) {
            win = null
        }
    })
    win.loadURL(url).then((_r: any) => {
    })
    win.show()
}

function openWelcomePage() {
    if (!mainWindow) {
        return
    }
    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../render/index.html'))
    } else {
        mainWindow.maximize()
        mainWindow.webContents.openDevTools()
        mainWindow.loadURL(`http://localhost:${process.env.PORT}`)
    }
}


app.on('ready', function () {
    const userDataPath = app.getPath ('userData')
    console.log(userDataPath)

    mainWin()

    /* check update */
    checkUpdate((name: string, body: string, url: string) => {
        if (mainWindow) {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                message: 'New Version Available',
                detail: name + '\n' + body,
                buttons: ['ok', 'cancel']
            }).then((index: any) => {
                if (index.response === 0) {
                    openUpdatePage(url)
                }
            })
        }
    })

    register.getUserData(app)

    openWelcomePage()
})