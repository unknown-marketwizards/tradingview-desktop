import {net} from "electron";
import pkg from "../../package.json";

let update_check_url = 'https://api.github.com/repos/unknown-marketwizards/tradingview-desktop/releases/latest'

export function checkUpdate(update: (name: string, body: string, url: string) => void) {

    const request = net.request(update_check_url)

    request.on('error', (_error: any) => {
    })

    request.on('response', (response: any) => {
        if (response.statusCode === 200) {
            response.on('data', (chunk: any) => {
                const obj = JSON.parse(chunk.toString());
                if (!obj.hasOwnProperty("name") || !obj.hasOwnProperty("html_url") || !obj.hasOwnProperty("body")) {
                    return
                }

                if (versionCompare(pkg.version, obj.name)) {
                    update(obj.name, obj.body, obj.html_url)
                }
            })
        }

    })
    request.end()
}

function versionCompare(curr: string, promote: string) {
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