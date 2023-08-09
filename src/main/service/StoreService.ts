import { app, ipcMain } from 'electron'
import Store from 'electron-store'
import path from 'path'
import TranslateShowPositionEnum from '../../common/enums/TranslateShowPositionEnum'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import { PlaySpeechServiceEnum } from '../../common/enums/PlaySpeechServiceEnum'

class StoreService {
  /**
   * 用户数据默认路径
   */
  static userDataPath = path.join(app.getPath('userData'), 'userDataConfig')
  static systemStore: Store
  static configStore: Store
  static serviceStore: Store
  static historyRecordStore: Store

  static init = (): void => {
    StoreService.systemStore = new Store({
      name: 'system',
      // 文件位置
      cwd: path.join(app.getPath('userData'))
    })
    if (!StoreService.systemStore.has('configInfoPath')) {
      StoreService.systemStore.set('configInfoPath', {
        // 配置路径
        configPath: StoreService.userDataPath,
        // 历史记录路径
        historyRecordPath: StoreService.userDataPath
      })
    }

    const configInfoPath = StoreService.systemStore.get('configInfoPath')

    // 配置相关
    StoreService.configStore = new Store({
      name: 'config',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: configInfoPath.configPath
    })

    // 翻译记录
    StoreService.historyRecordStore = new Store({
      name: 'historyRecord',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: configInfoPath.historyRecordPath
    })
  }

  static initConfig = (): void => {
    // // 首次打开时设置默认快捷键
    // if (!StoreService.configHas('inputShortcutKey')) {
    //   StoreService.configSet('inputShortcutKey', 'Alt + Q')
    // }
    // if (!StoreService.configHas('screenshotShortcutKey')) {
    //   StoreService.configSet('screenshotShortcutKey', 'Alt + W')
    // }
    // if (!StoreService.configHas('choiceShortcutKey')) {
    //   StoreService.configSet('choiceShortcutKey', 'Alt + E')
    // }
    // if (!StoreService.configHas('screenshotOcrShortcutKey')) {
    //   StoreService.configSet('screenshotOcrShortcutKey', 'Alt + Shift + W')
    // }
    // if (!StoreService.configHas('screenshotSilenceOcrShortcutKey')) {
    //   StoreService.configSet('screenshotSilenceOcrShortcutKey', 'Alt + Shift + E')
    // }
    // if (!StoreService.configHas('translateShowPositionType')) {
    //   StoreService.configSet('translateShowPositionType', TranslateShowPositionEnum.LAST_TIME)
    // }
    // if (!StoreService.configHas('fromTopOfWindowPercentage')) {
    //   StoreService.configSet('fromTopOfWindowPercentage', 30)
    // }
    // if (!StoreService.configHas('agentConfig')) {
    //   StoreService.configSet('agentConfig', {
    //     type: 0,
    //     checkStatus: false,
    //     host: '',
    //     port: '',
    //     userName: '',
    //     passWord: ''
    //   })
    // }
    //
    // // 初始化自动更新事件
    // if (!StoreService.configHas('autoUpdater')) {
    //   StoreService.configSet('autoUpdater', YesNoEnum.Y)
    // }
    // // 语音播放源
    // if (!StoreService.configHas('playSpeechService')) {
    //   StoreService.configSet('playSpeechService', PlaySpeechServiceEnum.TTIME)
    // }
    // // 初始化置顶时允许隐藏窗口状态
    // if (!StoreService.configHas('alwaysOnTopAllowEscStatus')) {
    //   StoreService.configSet('alwaysOnTopAllowEscStatus', YesNoEnum.N)
    // }
    // // 初始化换行符替换为空格状态
    // if (!StoreService.configHas('wrapReplaceSpaceStatus')) {
    //   StoreService.configSet('wrapReplaceSpaceStatus', YesNoEnum.N)
    // }
    // // 初始化换行符替换为空格状态
    // if (!StoreService.configHas('hoverBallStatus')) {
    //   StoreService.configSet('wrapReplaceSpaceStatus', YesNoEnum.N)
    // }
    // // 初始化鼠标悬浮球取词状态
    // if (!StoreService.configHas('hoverBallStatus')) {
    //   StoreService.configSet('hoverBallStatus', YesNoEnum.N)
    //   // 悬浮球增强模式
    //   StoreService.configSet('hoverBallEnhanceStatus', YesNoEnum.N)
    // }
    // // 初始化OCR结果写入剪切板状态
    // if (!StoreService.configHas('ocrWriteClipboardStatus')) {
    //   StoreService.configSet('ocrWriteClipboardStatus', YesNoEnum.N)
    // }
    // // 初始化OCR结果换行符替换为空格状态
    // if (!StoreService.configHas('ocrWrapReplaceSpaceStatus')) {
    //   StoreService.configSet('ocrWrapReplaceSpaceStatus', YesNoEnum.N)
    // }
  }

  static configHas = (key: string): boolean => {
    return StoreService.configStore.has(key)
  }

  static configGet = (key: string): any => {
    return StoreService.configStore.get(key)
  }

  static configSet = (key: string, val: any): void => {
    StoreService.configStore.set(key, val)
  }

  static configDeleteByKey = (key: string): void => {
    StoreService.configStore.delete(key)
  }

  static historyRecordHas = (key: string): boolean => {
    return StoreService.historyRecordStore.has(key)
  }

  static historyRecordGet = (key: string): any => {
    return StoreService.historyRecordStore.get(key)
  }

  static historyRecordSet = (key: string, val: any): void => {
    StoreService.historyRecordStore.set(key, val)
  }

  static historyRecordDeleteByKey = (key: string): void => {
    StoreService.historyRecordStore.delete(key)
  }
}

/**
 * 数据是否存在
 */
ipcMain.on('cache-has', (event, storeTypeEnum, key) => {
  event.returnValue = StoreService[storeTypeEnum + 'Has'](key)
})

/**
 * 数据获取
 */
ipcMain.on('cache-get', (event, storeTypeEnum, key) => {
  event.returnValue = StoreService[storeTypeEnum + 'Get'](key)
})

/**
 * 数据存储
 */
ipcMain.handle('cache-set', (_event, storeTypeEnum, key, obj) => {
  StoreService[storeTypeEnum + 'Set'](key, obj)
})

/**
 * 数据删除
 */
ipcMain.handle('cache-delete', (_event, storeTypeEnum, key) => {
  StoreService[storeTypeEnum + 'DeleteByKey'](key)
})
export default StoreService
