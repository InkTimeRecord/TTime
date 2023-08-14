import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    updateTranslateShortcutKeyEvent
    getSystemTypeEvent
    jumpToPage
    closeSetWinEvent
    autoLaunchEvent
    autoUpdaterEvent
    autoUpdaterSilenceStartCheckEvent
    updateTranslateServiceEvent
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
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
