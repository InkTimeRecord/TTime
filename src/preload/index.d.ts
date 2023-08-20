import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    windowHeightChangeEvent
    updateTranslateContentEvent
    clearAllTranslateContentEvent
    pageHeightChangeEvent
    openSetPageEvent
    alwaysOnTopEvent
    windowHeightChangeMaxEvent
    logInfoEvent
    logErrorEvent
    screenshotEndNotifyEvent
    winShowEvent
    winShowByInputEvent
    apiUniteTranslate
    showMsgEvent
    updateTranslateServiceEvent
    apiTranslateResultMsgCallbackEvent
    updateCacheEvent
    ttimeApiAppStart
    ttimeApiTranslateUse
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
