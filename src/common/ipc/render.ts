/**
 * Renderer and Main bridge
 */
import fs from 'fs'
import {ipcRenderer} from 'electron'
import {LOGIN, LOGOUT} from '../constant/event'

export const bridge = {
    fs,
    ipcRenderer,
    login() {
        ipcRenderer.invoke(LOGIN)
    },
    logout() {
        ipcRenderer.invoke(LOGOUT)
    },
}
