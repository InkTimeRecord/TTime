import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    closeOcrWinEvent
    getSystemTypeEvent
    showMsgEvent
    ocrAlwaysOnTopEvent
    updateImg
    updateText
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }
}
