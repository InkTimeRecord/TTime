import { app, dialog, ipcMain, shell } from 'electron'
import createSetWindow from './Set'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import { isNull } from '../../common/utils/validate'
import log from '../utils/log'
import GlobalWin from './GlobalWin'
import { injectWinAgent } from '../utils/RequestUtil'
import TTimeAuth from './auth/TTimeAuth'
import { StoreConfigFunTypeEnum } from '../../common/enums/StoreConfigFunTypeEnum'
import StoreService from './StoreService'
import { StoreTypeEnum } from '../../common/enums/StoreTypeEnum'

/**
 * 打开设置页面
 */
ipcMain.handle('open-set-page-event', (_event) => {
  createSetWindow()
})

/**
 * 获取系统类型事件
 */
ipcMain.on('get-system-type-event', (event, _args) => {
  event.returnValue = SystemTypeEnum.getSystemType()
})

/**
 * 跳转页面
 */
ipcMain.on('jump-to-page-event', (_event, url) => {
  if (isNull(url)) {
    return
  }
  shell.openExternal(url)
})

/**
 * 日志 - info级别
 */
ipcMain.handle('log-info-event', (_event, ...text) => {
  log.info(...text)
})

/**
 * 日志 - error级别
 */
ipcMain.handle('log-error-event', (_event, ...text) => {
  log.error(...text)
})

/**
 * 退出应用
 */
ipcMain.handle('close-app-event', (_event) => {
  GlobalWin.closeApp()
})

// 当前软件版本
const version = app.getVersion()

/**
 * 获取版本事件
 */
ipcMain.on('get-version-event', (event) => {
  event.returnValue = version
})

/**
 * 代理更新事件
 */
ipcMain.handle('agent-update-event', (_event, agentConfig) => {
  injectWinAgent(agentConfig, GlobalWin.mainWin.webContents.session)
})

/**
 * 打开目录对话框
 */
ipcMain.on('open-directory-dialog', (event, storeConfigFunType, storeType) => {
  if(StoreConfigFunTypeEnum.OPEN === storeConfigFunType && StoreTypeEnum.PLUGINS === storeType) {
    shell.openPath(StoreService.systemGet(StoreService.userPluginsPathKey)).then()
    return
  }
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
      title: '请选择文件夹',
      buttonLabel: '选择文件夹'
    })
    .then((result) => {
      if (result.canceled) {
        return
      }
      event.sender.send(
        'open-directory-dialog-callback',
        storeConfigFunType,
        storeType,
        result.filePaths[0]
      )
    })
})

/**
 * 退出登录
 */
ipcMain.handle('logout-event', () => {
  TTimeAuth.logout()
})

/**
 * 刷新服务信息通知
 */
ipcMain.handle('refresh-service-info-notify', (_event) => {
  GlobalWin.setWin.webContents.send('refresh-service-info-event')
})
