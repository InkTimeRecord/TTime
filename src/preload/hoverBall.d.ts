import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    hoverBallEvents
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
