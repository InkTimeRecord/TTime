import { app, ipcMain } from 'electron'
import Store from 'electron-store'
import path from 'path'
import TranslateShowPositionEnum from '../../common/enums/TranslateShowPositionEnum'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import { PlaySpeechServiceEnum } from '../../common/enums/PlaySpeechServiceEnum'
import { ShortcutKeyEnum } from '../../common/enums/ShortcutKeyEnum'
import { isNull } from '../../common/utils/validate'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { WinEvent } from './Win'
import log from '../utils/log'

/**
 * app.getPath('userData')
 *
 * 一般对应地址如下 :
 * Mac : Users/用户账号名称/Library/Application Support/time-translate/
 * Win : C:\Users\用户账号名称\AppData\Roaming\time-translate/
 */
class StoreService {
  /**
   * 用户数据默认路径
   */
  static userDataPath = app.getPath('userData')
  // 配置路径
  static userDataConfigPath = path.join(StoreService.userDataPath, 'userDataConfig')
  // 日志存储路径
  static logsPath = path.join(StoreService.userDataPath, 'logs')
  // 系统存储
  static systemStore: Store
  // 配置存储
  static configStore: Store
  // 翻译历史记录存储
  static historyRecordStore: Store

  static init = (): void => {
    StoreService.systemStore = new Store({
      name: 'system',
      // 文件位置
      cwd: path.join(app.getPath('userData'))
    })
    if (!StoreService.systemStore.has('configPath')) {
      // 配置路径
      StoreService.systemStore.set('configPath', StoreService.userDataConfigPath)
      // 历史记录路径
      StoreService.systemStore.set('historyRecordPath', StoreService.userDataConfigPath)
    }

    // 配置相关
    StoreService.configStore = new Store({
      name: 'config',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemGet('configPath')
    })
    console.log('StoreService.configStore.path = ', StoreService.configStore.path)

    // 翻译记录
    StoreService.historyRecordStore = new Store({
      name: 'historyRecord',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemGet('historyRecordPath')
    })
    console.log('StoreService.historyRecordStore.path = ', StoreService.historyRecordStore.path)
  }

  static initConfig = (): void => {
    // 首次打开时设置默认快捷键
    if (!StoreService.configHas('inputShortcutKey')) {
      StoreService.configSet('inputShortcutKey', 'Alt + Q')
    }
    if (!StoreService.configHas('screenshotShortcutKey')) {
      StoreService.configSet('screenshotShortcutKey', 'Alt + W')
    }
    if (!StoreService.configHas('choiceShortcutKey')) {
      StoreService.configSet('choiceShortcutKey', 'Alt + E')
    }
    if (!StoreService.configHas('screenshotOcrShortcutKey')) {
      StoreService.configSet('screenshotOcrShortcutKey', 'Alt + Shift + W')
    }
    if (!StoreService.configHas('screenshotSilenceOcrShortcutKey')) {
      StoreService.configSet('screenshotSilenceOcrShortcutKey', 'Alt + Shift + E')
    }
    if (!StoreService.configHas('translateShowPositionType')) {
      StoreService.configSet('translateShowPositionType', TranslateShowPositionEnum.LAST_TIME)
    }
    if (!StoreService.configHas('fromTopOfWindowPercentage')) {
      StoreService.configSet('fromTopOfWindowPercentage', 30)
    }
    if (!StoreService.configHas('agentConfig')) {
      StoreService.configSet('agentConfig', {
        type: 0,
        checkStatus: false,
        host: '',
        port: '',
        userName: '',
        passWord: ''
      })
    }

    // 初始化自动更新事件
    if (!StoreService.configHas('autoUpdater')) {
      StoreService.configSet('autoUpdater', YesNoEnum.Y)
    }
    // 语音播放源
    if (!StoreService.configHas('playSpeechService')) {
      StoreService.configSet('playSpeechService', PlaySpeechServiceEnum.TTIME)
    }
    // 初始化置顶时允许隐藏窗口状态
    if (!StoreService.configHas('alwaysOnTopAllowEscStatus')) {
      StoreService.configSet('alwaysOnTopAllowEscStatus', YesNoEnum.N)
    }
    // 初始化换行符替换为空格状态
    if (!StoreService.configHas('wrapReplaceSpaceStatus')) {
      StoreService.configSet('wrapReplaceSpaceStatus', YesNoEnum.N)
    }
    // 初始化换行符替换为空格状态
    if (!StoreService.configHas('hoverBallStatus')) {
      StoreService.configSet('wrapReplaceSpaceStatus', YesNoEnum.N)
    }
    // 初始化鼠标悬浮球取词状态
    if (!StoreService.configHas('hoverBallStatus')) {
      StoreService.configSet('hoverBallStatus', YesNoEnum.N)
      // 悬浮球增强模式
      StoreService.configSet('hoverBallEnhanceStatus', YesNoEnum.N)
    }
    // 初始化OCR结果写入剪切板状态
    if (!StoreService.configHas('ocrWriteClipboardStatus')) {
      StoreService.configSet('ocrWriteClipboardStatus', YesNoEnum.N)
    }
    // 初始化OCR结果换行符替换为空格状态
    if (!StoreService.configHas('ocrWrapReplaceSpaceStatus')) {
      StoreService.configSet('ocrWrapReplaceSpaceStatus', YesNoEnum.N)
    }

    app.whenReady().then(() => {
      const translateShortcutKeyList = [
        { type: ShortcutKeyEnum.INPUT, shortcutKey: StoreService.configGet('inputShortcutKey') },
        {
          type: ShortcutKeyEnum.SCREENSHOT,
          shortcutKey: StoreService.configGet('screenshotShortcutKey')
        },
        { type: ShortcutKeyEnum.CHOICE, shortcutKey: StoreService.configGet('choiceShortcutKey') },
        {
          type: ShortcutKeyEnum.SCREENSHOT_OCR,
          shortcutKey: StoreService.configGet('screenshotOcrShortcutKey')
        },
        {
          type: ShortcutKeyEnum.SCREENSHOT_SILENCE_OCR,
          shortcutKey: StoreService.configGet('screenshotSilenceOcrShortcutKey')
        }
      ]
      log.info('[初始加载翻译快捷键事件] - 开始，翻译快捷键列表 : ', translateShortcutKeyList)
      // 初始加载翻译快捷键事件
      translateShortcutKeyList.forEach((translateShortcutKey) => {
        const type = translateShortcutKey.type
        const shortcutKey = translateShortcutKey.shortcutKey
        if (isNull(type) || isNull(shortcutKey)) {
          return
        }
        GlobalShortcutEvent.translateRegister(
          translateShortcutKey.type,
          translateShortcutKey.shortcutKey
        )
      })
      log.info('[初始加载翻译快捷键事件] - 结束')

      log.info('开机自启初始化事件')
      WinEvent.updateAutoLaunch(null, (isEnabled) => {
        StoreService.configSet('autoLaunch', isEnabled ? YesNoEnum.Y : YesNoEnum.N)
        return isEnabled
      })
    })
  }

  static systemHas = (key: string): boolean => {
    return StoreService.systemStore.has(key)
  }

  static systemGet = (key: string): any => {
    return StoreService.systemStore.get(key)
  }

  static systemSet = (key: string, val: any): void => {
    StoreService.systemStore.set(key, val)
  }

  static systemDeleteByKey = (key: string): void => {
    StoreService.systemStore.delete(key)
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
