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
    initLoadTranslateShortcutKeyEvent
    autoLaunchInitEvent
    windowHeightChangeMaxEvent
    logInfoEvent
    logErrorEvent
    screenshotEndNotifyEvent
    winShowEvent
    winShowByInputEvent
    apiUniteTranslate
    ttimeApiTranslateCallbackEvent
    tencentcloudApiTranslateCallbackEvent
    baiduApiTranslateCallbackEvent
    aliyunApiTranslateCallbackEvent
    googleApiTranslateCallbackEvent
    googlebuiltinApiTranslateCallbackEvent
    openaiApiTranslateCallbackEvent
    youdaoApiTranslateCallbackEvent
    deeplApiTranslateCallbackEvent
    deeplbuiltinApiTranslateCallbackEvent
    volcanoApiTranslateCallbackEvent
    bingApiTranslateCallbackEvent
    bingdictApiTranslateCallbackEvent
    niutransApiTranslateCallbackEvent
    caiyunApiTranslateCallbackEvent
    transmartApiTranslateCallbackEvent
    papagoApiTranslateCallbackEvent
    ttimeApiAppStart
    ttimeApiTranslateUse
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
