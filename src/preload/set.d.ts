import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    updateTranslateShortcutKeyEvent
    getSystemTypeEvent
    closeSetWinEvent
    autoLaunchEvent
    autoUpdaterEvent
    autoUpdaterSilenceStartCheckEvent
    updateTranslateServiceNotify
    apiUniteTranslateCheck
    apiCheckTranslateCallbackEvent
    apiUniteAgentCheck
    apiUniteAgentCheckCallbackEvent
    apiUniteOcrCheck
    apiCheckOcrCallbackEvent
    getVersionEvent
    agentUpdateEvent
    alwaysOnTopAllowEscStatusNotify
    openDirectoryDialog
    openDirectoryDialogCallback
    updateConfigInfoPath
    setWinFocusEvent
    winFontSizeNotify
    winShowEvent
    refreshUserInfoEvent
    refreshServiceInfoEvent
    refreshServiceInfoNotify
    loginSuccessEvent
    authRefreshSuccessEvent
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
