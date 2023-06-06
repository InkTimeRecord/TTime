import { app, BrowserWindow, clipboard, globalShortcut } from 'electron'
import log from '../utils/log'
import robot from '@jitsi/robotjs'
import { ScreenshotsMain } from './Screenshot'
import R from '../class/R'
import { ShortcutKeyEnum } from '../enums/ShortcutKeyEnum'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import GlobalWin from './GlobalWin'
import { uIOhook, UiohookKey } from 'uiohook-napi'

uIOhook.start()

const isMac = SystemTypeEnum.isMac()

/**
 * 全局快捷键
 */
class GlobalShortcutClass {
  /**
   * 快捷键
   */
  key: string

  /**
   * 快捷键触发回调
   */
  callback: () => void

  constructor(key: string, callback: () => void) {
    this.key = key
    this.callback = callback
  }
}

class GlobalShortcutEvent {
  /**
   * 主窗口
   */
  static mainWin: BrowserWindow

  /**
   * 是否划词中
   */
  static isChoice = false

  /**
   * 全局快捷键列表
   */
  globalShortcutList: GlobalShortcutClass[]

  constructor() {
    // 窗口注销前执行逻辑
    app.on('will-quit', () => {
      // 注销应用注册的所有快捷键
      globalShortcut.unregisterAll()
    })
    this.globalShortcutList = []
  }

  /**
   * 注册全局快捷方式
   */
  registerAll(): void {
    this.globalShortcutList.forEach((info) => {
      GlobalShortcutEvent.registerBuild(info)
    })
  }

  /**
   * 单个快捷键注册
   *`
   * @param info 全局快捷键
   */
  static registerBuild(info: GlobalShortcutClass): R {
    // 检查快捷方式是否已注册。
    if (globalShortcut.isRegistered(info.key)) {
      log.info(info.key + '快捷键已注册')
      return R.error(info.key + '快捷键已注册')
    }
    // 注册一个快捷并监听
    if (!globalShortcut.register(info.key, info.callback)) {
      log.info(info.key + '快捷键注册失败')
      return R.error(info.key + '快捷键注册失败')
    }
    return R.ok()
  }

  /**
   * 单个快捷键注册
   *
   * @param key 快捷键
   * @param callback 快捷键按下后的回调
   */
  static register(key, callback): R {
    return GlobalShortcutEvent.registerBuild(new GlobalShortcutClass(key, callback))
  }

  /**
   * 单个快捷键注销
   *
   * @param key 快捷键
   */
  static unregister(key): void {
    globalShortcut.unregister(key)
  }

  /**
   * 注销Esc
   */
  static unregisterEsc(): void {
    GlobalShortcutEvent.unregister('Esc')
  }

  /**
   * 翻译窗口快捷键注册
   */
  static translateRegister(type: string, shortcutKey: string): R {
    log.info('翻译窗口快捷键注册 , type : ', type, ' , shortcutKey : ', shortcutKey)
    const thisShortcutKeyEnum = ShortcutKeyEnum.getCodeByEnum(type)
    let res
    if (ShortcutKeyEnum.INPUT === thisShortcutKeyEnum) {
      res = GlobalShortcutEvent.translateInputRegister(shortcutKey)
    } else if (ShortcutKeyEnum.SCREENSHOT === thisShortcutKeyEnum) {
      res = GlobalShortcutEvent.translateScreenshotRegister(shortcutKey)
    } else if (ShortcutKeyEnum.CHOICE === thisShortcutKeyEnum) {
      res = GlobalShortcutEvent.translateChoiceRegister(shortcutKey)
    } else {
      res = R.error('快捷键类型不存在')
    }
    return res
  }

  /**
   * 显示翻译窗口快捷键
   */
  static translateInput(): void {
    GlobalWin.mainWinShow()
    GlobalWin.mainWinSend('clear-all-translated-content')
    GlobalWin.mainWinSend('win-show-input-event')
  }

  /**
   * 截图翻译快捷键
   */
  static translateScreenshot(): void {
    log.info('[截图翻译] - 开始截图')
    GlobalWin.mainWinSend('clear-all-translated-content')
    // 隐藏窗口
    GlobalWin.mainWinHide()
    new ScreenshotsMain().createScreenshotsWin()
  }

  /**
   * 划词翻译快捷键
   */
  static translateChoice = async () => {
    if (GlobalShortcutEvent.isChoice) {
      return
    }
    // 先释放按键
    uIOhook.keyToggle(UiohookKey.Ctrl, 'up')
    uIOhook.keyToggle(UiohookKey.CtrlRight, 'up')
    uIOhook.keyToggle(UiohookKey.Alt, 'up')
    uIOhook.keyToggle(UiohookKey.AltRight, 'up')
    uIOhook.keyToggle(UiohookKey.Shift, 'up')
    uIOhook.keyToggle(UiohookKey.ShiftRight, 'up')
    uIOhook.keyToggle(UiohookKey.Space, 'up')
    uIOhook.keyToggle(UiohookKey.Meta, 'up')
    uIOhook.keyToggle(UiohookKey.MetaRight, 'up')
    uIOhook.keyToggle(UiohookKey.Tab, 'up')
    uIOhook.keyToggle(UiohookKey.Escape, 'up')
    GlobalShortcutEvent.isChoice = true
    const printSelectedText = (selectedText) => {
      GlobalShortcutEvent.isChoice = false
      selectedText = GlobalShortcutEvent.splitSingleCamelCase(selectedText)
      selectedText = GlobalShortcutEvent.splitSingleUnderScore(selectedText)
      // 推送给Vue页面进行更新翻译输入内容
      GlobalWin.mainWinSend('update-translated-content', selectedText)
      GlobalWin.mainWinShow()
    }
    GlobalShortcutEvent.getSelectedText().then(printSelectedText)
  }

  /**
   * 单个词时拆分驼峰命名
   *
   * @param str 拆分的字符
   * @return 处理后的字符
   */
  static splitSingleCamelCase = (str): string => {
    if (/^[A-Za-z][A-Za-z]*$/.test(str)) {
      return str.replace(/([a-z])([A-Z])/g, '$1 $2')
    } else {
      return str
    }
  }

  /**
   * 单个词时拆分下划线命名
   *
   * @param str 拆分的字符
   * @return 处理后的字符
   */
  static splitSingleUnderScore = (str): string => {
    if (/^[a-z0-9_]+$/i.test(str)) {
      return str.replace(/_/g, ' ')
    } else {
      return str
    }
  }

  static getSelectedText = async () => {
    GlobalWin.mainWinSend('clear-all-translated-content')
    const currentClipboardContent = clipboard.readText()
    log.info('[划词翻译] - 读取剪切板原文本 : ', currentClipboardContent)
    clipboard.clear()
    await new Promise((resolve) => setTimeout(resolve, 300))
    log.info('[划词翻译] - 执行复制操作')
    robot.keyToggle('c', 'down', isMac ? 'command' : 'control')
    await new Promise((resolve) => setTimeout(resolve, 300))
    robot.keyToggle('c', 'up', isMac ? 'command' : 'control')
    const selectedText = clipboard.readText()
    log.info('[划词翻译] - 读取新复制的内容 : ', selectedText)
    clipboard.writeText(currentClipboardContent)
    GlobalShortcutEvent.isChoice = false
    return selectedText
  }

  /**
   * 显示翻译窗口快捷键 - 注册
   */
  static translateInputRegister(shortcutKey: string): R {
    return GlobalShortcutEvent.register(shortcutKey, () => GlobalShortcutEvent.translateInput())
  }

  /**
   * 截屏翻译快捷键 - 注册
   */
  static translateScreenshotRegister(shortcutKey: string): R {
    return GlobalShortcutEvent.register(shortcutKey, () =>
      GlobalShortcutEvent.translateScreenshot()
    )
  }

  /**
   * 划词翻译快捷键 - 注册
   */
  static translateChoiceRegister(shortcutKey: string): R {
    return GlobalShortcutEvent.register(shortcutKey, async () =>
      GlobalShortcutEvent.translateChoice()
    )
  }
}

export { GlobalShortcutEvent }
