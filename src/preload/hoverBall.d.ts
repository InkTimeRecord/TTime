import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface api {
    hoverBallEvents
    hoverBallShowEvents
    hoverBallHideEvents
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }
}
