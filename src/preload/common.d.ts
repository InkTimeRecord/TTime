import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    logInfoEvent
    logErrorEvent
    getSystemTypeEvent
    openSetPageEvent
    showMsgEvent
    cacheHas
    cacheGet
    cacheSet
    cacheDelete
  }
}
