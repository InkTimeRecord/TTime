import { app } from 'electron'
import Store from 'electron-store'

class StoreService {
  /**
   * 用户数据默认路径
   */
  static userDataPath = app.getPath('userData') + '/userDataConfig/'
  static systemStore: Store
  static configStore: Store
  static serviceStore: Store
  static historyRecordStore: Store

  constructor() {
    StoreService.systemStore = new Store({
      name: 'system',
      // 文件位置
      cwd: app.getPath('userData')
    })
    if (!StoreService.systemStore.has('configInfoPath')) {
      StoreService.systemStore.set('configInfoPath', {
        // 配置路径
        configPath: StoreService.userDataPath,
        // 服务路径
        servicePath: StoreService.userDataPath,
        // 历史记录路径
        historyRecordPath: StoreService.userDataPath
      })
    }

    // 配置相关
    StoreService.configStore = new Store({
      name: 'config',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemStore.get('configInfoPath').configPath
    })
    // 服务相关
    StoreService.serviceStore = new Store({
      name: 'service',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemStore.get('configInfoPath').servicePath
    })
    // 翻译记录
    StoreService.historyRecordStore = new Store({
      name: 'historyRecord',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemStore.get('configInfoPath').historyRecordPath
    })
  }

  static configGet = (key: string): unknown => {
    return StoreService.configStore.get(key)
  }

  static configSet = (key: string, val: unknown): void => {
    StoreService.configStore.set(key, val)
  }

  static configDeleteByKey = (key: string): void => {
    StoreService.configStore.delete(key)
  }
  static serviceGet = (key: string): unknown => {
    return StoreService.serviceStore.get(key)
  }

  static serviceSet = (key: string, val: unknown): void => {
    StoreService.serviceStore.set(key, val)
  }

  static serviceDeleteByKey = (key: string): void => {
    StoreService.serviceStore.delete(key)
  }
  static historyRecordGet = (key: string): unknown => {
    return StoreService.historyRecordStore.get(key)
  }

  static historyRecordSet = (key: string, val: unknown): void => {
    StoreService.historyRecordStore.set(key, val)
  }
}

export const historyRecordDeleteByKey = (key: string): void => {
  StoreService.historyRecordStore.delete(key)
}
export default StoreService
