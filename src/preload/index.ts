import {contextBridge} from 'electron'
import {domReady} from './utils/dom'
import {useLoading} from './loading'
import {bridge} from '@/common/ipc/render'

const {removeLoading, appendLoading} = useLoading()

domReady().then(appendLoading)

contextBridge.exposeInMainWorld('bridge', {
    ...bridge,
    removeLoading,
})