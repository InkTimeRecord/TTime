import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    closeOcrWinEvent
    getSystemTypeEvent
    openSetPageEvent
    showMsgEvent
    ocrAlwaysOnTopEvent
    updateImg
    updateText
    winSizeUpdate
    base64ImgWriteShearPlateEvent
    updateTranslatedContentEvent
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }
}
