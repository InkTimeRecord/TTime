import { app, ipcMain } from 'electron'
import Store from 'electron-store'
import path from 'path'
import TranslateShowPositionEnum from '../../common/enums/TranslateShowPositionEnum'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import { PlaySpeechServiceEnum } from '../../common/enums/PlaySpeechServiceEnum'
import { ShortcutKeyEnum } from '../../common/enums/ShortcutKeyEnum'
import { isNotNull, isNull } from '../../common/utils/validate'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { WinEvent } from './Win'
import log from '../utils/log'
import GlobalWin from './GlobalWin'
import { LoginStatusEnum } from '../../common/enums/LoginStatusEnum'
import TTimeRequest from './channel/interfaces/TTimeRequest'
import MemberUtil from '../utils/memberUtil'
import commonUtil from '../utils/commonUtil'
import * as fse from 'fs-extra'

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
  /**
   * 用户数据存放文件夹名称
   */
  static configPathKey = 'configPath'
  /**
   * 用户翻译记录存放文件夹名称
   */
  static historyRecordPathKey = 'historyRecordPath'
  /**
   * 用户插件存放文件夹名称
   */
  static userPluginsPathKey = 'userPluginsPath'
  /**
   * 用户插件存放文件夹名称
   */
  static userPluginsName = 'userPlugins'
  /**
   * 用户数据存放文件夹名称
   */
  static userDataConfigFolderName = 'userDataConfig'

  /**
   * 云配置不上传白名单 - 不应同步的配置
   */
  static cloudConfigKeyWhiteList: Array<string> = [
    'inputShortcutKey',
    'screenshotShortcutKey',
    'choiceShortcutKey',
    'showOcrShortcutKey',
    'screenshotOcrShortcutKey',
    'screenshotSilenceOcrShortcutKey',
    'agentConfig',
    'translateChoiceDelay',
    'inputLanguage',
    'resultLanguage',
    'loginStatus',
    'translateServiceMap',
    'ocrServiceMap',
    'translateServiceKey',
    'token',
    'userInfo',
    'mainWinWidth',
    'setPageMenuIndex'
  ]

  /**
   * 配置路径
   */
  static userDataConfigPath = path.join(
    StoreService.userDataPath,
    StoreService.userDataConfigFolderName
  )

  /**
   * 用户插件路径
   */
  static userPluginsPath = path.join(
    StoreService.userDataConfigPath,
    StoreService.userPluginsName
  )
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
    if (!StoreService.systemStore.has(StoreService.configPathKey)) {
      // 配置路径
      StoreService.systemStore.set(StoreService.configPathKey, StoreService.userDataConfigPath)
      // 历史记录路径
      StoreService.systemStore.set(StoreService.historyRecordPathKey, StoreService.userDataConfigPath)
    }
    if (!StoreService.systemStore.has(StoreService.userPluginsPathKey)) {
      // 插件路径
      StoreService.systemStore.set(StoreService.userPluginsPathKey, StoreService.userPluginsPath)
      // 确保目录存在。如果目录结构不存在，则创建它
      fse.ensureDirSync(StoreService.userPluginsPath)
    }

    // 配置相关
    StoreService.configStore = new Store({
      name: 'config',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemGet(StoreService.configPathKey)
    })

    // 翻译记录
    StoreService.historyRecordStore = new Store({
      name: 'historyRecord',
      // 文件位置
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cwd: StoreService.systemGet(StoreService.historyRecordPathKey)
    })
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
    if (!StoreService.configHas('showOcrShortcutKey')) {
      // 显示OCR窗口快捷键默认为空 非核心功能 用户使用需自行在设置中配置
      StoreService.configSet('showOcrShortcutKey', '')
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
    // 初始化鼠标悬浮球取词状态
    if (!StoreService.configHas('hoverBallStatus')) {
      StoreService.configSet('hoverBallStatus', YesNoEnum.N)
      // 悬浮球增强模式
      StoreService.configSet('hoverBallEnhanceStatus', YesNoEnum.N)
    }
    // 初始化OCR结果写入剪贴板状态
    if (!StoreService.configHas('ocrWriteClipboardStatus')) {
      StoreService.configSet('ocrWriteClipboardStatus', YesNoEnum.N)
    }
    // 初始化OCR结果换行符替换为空格状态
    if (!StoreService.configHas('ocrWrapReplaceSpaceStatus')) {
      StoreService.configSet('ocrWrapReplaceSpaceStatus', YesNoEnum.N)
    }
    // 初始化OCR结果换行符替换状态
    if (!StoreService.configHas('ocrWrapReplaceStatus')) {
      StoreService.configSet('ocrWrapReplaceStatus', YesNoEnum.N)
    }
    // 初始化默认划词延迟
    if (!StoreService.configHas('translateChoiceDelay')) {
      StoreService.configSet('translateChoiceDelay', 600)
    }
    // 初始化翻译记录状态
    if (!StoreService.configHas('translateHistoryStatus')) {
      StoreService.configSet('translateHistoryStatus', YesNoEnum.Y)
    }
    // 初始化剪贴板监听模式状态
    if (!StoreService.configHas('clipboardListenerShowStatus')) {
      StoreService.configSet('clipboardListenerShowStatus', YesNoEnum.N)
      StoreService.configSet('clipboardListenerStatus', YesNoEnum.N)
    }
    // 初始化默认文字大小
    if (!StoreService.configHas('winFontSize')) {
      StoreService.configSet('winFontSize', 14)
    }
    // 初始化显示翻译不清空状态
    if (!StoreService.configHas('showTranslateNotEmptyStatus')) {
      StoreService.configSet('showTranslateNotEmptyStatus', YesNoEnum.N)
    }
    // 初始化窗口大小
    if (!StoreService.configHas('mainWinWidth')) {
      StoreService.configSet('mainWinWidth', 450)
    }
    // 初始化输入自动翻译模式
    if (!StoreService.configHas('inputTranslationAutoStatus')) {
      StoreService.configSet('inputTranslationAutoStatus', YesNoEnum.N)
    }
    // 初始化登录状态
    if (!StoreService.configHas('loginStatus')) {
      StoreService.configSet('loginStatus', LoginStatusEnum.N)
    }
    // 初始化服务端口
    if (!StoreService.configHas('servicePort')) {
      StoreService.configSet('servicePort', 11223)
    }
    // 隐藏翻译输入框
    if (!StoreService.configHas('hideTranslateInput')) {
      StoreService.configSet('hideTranslateInput', YesNoEnum.N)
    }
    // 隐藏语言选择栏
    if (!StoreService.configHas('hideTranslateLanguage')) {
      StoreService.configSet('hideTranslateLanguage', YesNoEnum.N)
    }
    // 翻译结果显示复制驼峰格式按钮
    if (!StoreService.configHas('copyCamelCaseResultStatus')) {
      StoreService.configSet('copyCamelCaseResultStatus', LoginStatusEnum.N)
    }
    // 翻译结果显示复制下划线格式按钮
    if (!StoreService.configHas('copySnakeCaseResultStatus')) {
      StoreService.configSet('copySnakeCaseResultStatus', LoginStatusEnum.N)
    }
    app.whenReady().then(async () => {
      const translateShortcutKeyList = [
        { type: ShortcutKeyEnum.INPUT, shortcutKey: StoreService.configGet('inputShortcutKey') },
        {
          type: ShortcutKeyEnum.SCREENSHOT,
          shortcutKey: StoreService.configGet('screenshotShortcutKey')
        },
        { type: ShortcutKeyEnum.CHOICE, shortcutKey: StoreService.configGet('choiceShortcutKey') },
        {
          type: ShortcutKeyEnum.SHOW_OCR,
          shortcutKey: StoreService.configGet('showOcrShortcutKey')
        },
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

      setTimeout(async () => {
        let autoLaunchFront = StoreService.configGet('autoLaunchFront')
        if (isNull(autoLaunchFront)) {
          // 如果首次从 localStorage 存储环境切换到 store 方式存储时
          // 静默更新状态下会获取不到自动开机状态
          // 所以当 autoLaunchFront 为空的情况下则再从 localStorage 读取初始状态
          await GlobalWin.mainWin.webContents
            .executeJavaScript('localStorage.autoLaunchFront')
            .then((valExtend) => {
              autoLaunchFront = valExtend
            })
        }
        if (isNull(autoLaunchFront)) {
          log.info('开机自启初始化事件')
          // 延迟检测 防止注册表还没有完全添加完毕状态下就获取了
          WinEvent.updateAutoLaunch(null, (isEnabled) => {
            StoreService.configSet('autoLaunch', isEnabled ? YesNoEnum.Y : YesNoEnum.N)
            return isEnabled
          })
        }
      }, 5000)
    })
  }

  /**
   * 加载云端配置
   */
  static initCloudConfig = (): void => {
    if (MemberUtil.isNotMemberVip()) {
      return
    }
    log.info('[ 加载云端配置 ] - 开始')
    // 本地配置对象
    const thisConfigObject = StoreService.configStore.store
    // 获取本地配置对象对应键列表
    const thisConfigKeyList = Object.keys(thisConfigObject).filter(
      (key) => !StoreService.cloudConfigKeyWhiteList.includes(key)
    )
    // 拉取所有最新配置
    TTimeRequest.getUserConfig().then((res: any): void => {
      if (res['status'] !== 200) {
        log.info('[ 加载云端配置 ] - 登录已失效')
        TTimeRequest.logout().then()
        return
      }
      // 云端配置 转换为对象格式
      const cloudConfigObject = res.data.reduce((acc: any, cur: any) => {
        acc[cur.configKey] = cur.configValue
        return acc
      }, {})
      // 云端配置 key 列表
      const cloudConfigKeyList = Object.keys(cloudConfigObject)
      // 筛选本地存在 云端不存在的配置
      const newConfigKeyList = thisConfigKeyList.filter((key) => !cloudConfigKeyList.includes(key))
      // 构建本地存在云端不存在的数据
      const newConfigList = newConfigKeyList.map((key) => ({
        configKey: key,
        configValue: thisConfigObject?.[key] ?? null
      }))
      if (isNotNull(newConfigList) && newConfigList.length > 0) {
        log.info('[ 加载云端配置 ] - 更新配置信息开始')
        // 保存新配置数据
        TTimeRequest.batchSaveUserConfig({
          configList: newConfigList
        }).then()
        log.info('[ 加载云端配置 ] - 更新配置信息结束')
      }
      // 云端配置覆盖本地配置
      cloudConfigKeyList.forEach((key) => {
        const value = cloudConfigObject[key]
        if (isNotNull(value)) {
          StoreService.configSetNotCloud(key, commonUtil.convertToNumber(value))
        }
      })
    })
    log.info('[ 加载云端配置 ] - 结束')
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

  static configSetNotCloud = (key: string, val: any): void => {
    StoreService.configStore.set(key, val)
  }

  static configSet = (key: string, val: any): void => {
    StoreService.configSetNotCloud(key, val)
    if (MemberUtil.isMemberVip() && !StoreService.cloudConfigKeyWhiteList.includes(key)) {
      TTimeRequest.saveUserConfig({
        configKey: key,
        configValue: val
      }).then()
    }
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

StoreService.init()
StoreService.initConfig()
export default StoreService
