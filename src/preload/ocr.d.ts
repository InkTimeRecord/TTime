import { ElectronAPI } from '@electron-toolkit/preload'

declare global {

  interface api {
  }

  interface Window {
    electron: ElectronAPI
    api: api
  }

}
