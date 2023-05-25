import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    screenScaleFactorNoticeEvent
    screenScaleFactorEvent
    screenshotEndEvent
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
