import { ipcMain } from 'electron'
import log from '../utils/log'
import TTimeRequest from './channel/interfaces/TTimeRequest'

/**
 * 应用启动
 */
ipcMain.handle('ttime-api-app-start', (_event, _args) => {
  log.info('[应用启动接口调用] - 开始 ')
  TTimeRequest.appStart().then((data) => {
    log.info('[应用启动接口调用] - 响应报文 : ', data)
  }).catch((error) => {
    log.error('[应用启动接口调用] - 请求异常 : ', error.message)
  })
})

/**
 * 应用翻译使用
 */
ipcMain.handle('ttime-api-translate-use', (_event, _args) => {
  TTimeRequest.translateUse().then(() => {})
    .catch((error) => {
      log.error('[翻译使用调用] - 请求异常 : ', error.message)
    })
})


