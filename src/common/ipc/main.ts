import {BrowserWindow, App, ipcMain} from 'electron'
import {GET_USER_DATA, LOGIN, LOGOUT, TOGGLE_DEVTOOLS} from '../constant/event'

export interface IpcHandleListener {
    (event: Electron.IpcMainInvokeEvent, ...args: any[]): (Promise<void>) | (any)
}

export const register = {
    getUserData(app: App) {
        ipcMain.handle(GET_USER_DATA, () => {
            return app.getPath('userData')
        })
        return register
    },
    toggleDevtools(win: BrowserWindow) {
        ipcMain.handle(TOGGLE_DEVTOOLS, () => {
            win.webContents.toggleDevTools()
        })
        return register
    },
    login(listener: IpcHandleListener) {
        ipcMain.handle(LOGIN, listener)
        return register
    },
    logout(listener: IpcHandleListener) {
        ipcMain.handle(LOGOUT, listener)
        return register
    },
}