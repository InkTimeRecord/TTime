import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
    setIgnoreMouseEvents
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
