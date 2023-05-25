import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    closeUpdateWinEvent
    closeAppEvent
    autoUpdaterEvent
    autoUpdaterStartCheck
    getSystemTypeEvent
    jumpToPage
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
