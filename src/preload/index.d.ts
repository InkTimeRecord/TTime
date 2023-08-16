import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    windowHeightChangeEvent
    updateTranslateContentEvent
    clearAllTranslateContentEvent
    pageHeightChangeEvent
    openSetPageEvent
    textWriteShearPlateEvent
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
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
