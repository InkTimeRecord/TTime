import { isNull } from '../utils/validate'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app, screen } from 'electron'
import { WinEvent } from './Win'
import { YesNoEnum } from '../enums/YesNoEnum'
import { clipboard } from 'electron'
import { ScreenshotsMain } from './Screenshot'
import OcrTypeEnum from '../enums/OcrTypeEnum'
import WebShowMsgEnum from '../enums/WebShowMsgEnum'

/**
 * 全局窗口
 */
class GlobalWin {
  /**
   * 主窗口
   */
  static mainWin

  /**
   * 主窗口是否关闭
   */
  static isMainWinClose = false

  /**
   * 主窗口是否置顶
   */
  static isMainAlwaysOnTop = false

  /**
   * 设置窗口
   */
  static setWin

  /**
   * 悬浮球窗口
   */
  static hoverBallWin

  /**
   * 是否显示悬浮球
   */
  static isHoverBall = false

  /**
   * ocr窗口
   */
  static ocrWin

  /**
   * OCR窗口是否关闭
   */
  static isOcrWinClose = false

  /**
   * OCR是否置顶
   */
  static isOcrAlwaysOnTop = false

  /**
   * ocr静默窗口
   */
  static ocrSilenceWin

  /**
   * 是否显示OCR静默窗口
   */
  static isOcrSilence = false

  /**
   * ocr静默截图 - 临时图片
   *
   * 临时记录，base64格式，主要用于如果静默OCR时识别出错了 回显使用
   */
  static ocrSilenceTempImg

  /**
   * 显示窗口
   */
  static winShow(win): void {
    if (isNull(win)) {
      return
    }
    win.show()
  }

  /**
   * 隐藏窗口
   */
  static winHide(win): void {
    if (isNull(win)) {
      return
    }
    // 当隐藏窗口时注销Esc快捷键
    GlobalShortcutEvent.unregisterEsc()
    win.hide()
  }

  /**
   * 设置主窗口
   *
   * @param mainWin 主窗口
   */
  static setMainWin(mainWin): void {
    // 此处校验是因为主窗口不会销毁 所以防止重复设置
    if (isNull(GlobalWin.mainWin)) {
      GlobalWin.mainWin = mainWin
    }
  }

  /**
   * 隐藏主窗口
   */
  static mainWinHide(): void {
    GlobalWin.winHide(GlobalWin.mainWin)
  }

  /**
   * 显示主窗口
   */
  static mainWinShow(): void {
    GlobalWin.winShow(GlobalWin.mainWin)
    this.mainOrOcrWinShowCallback()
  }

  /**
   * 主窗口事件发送
   *
   * @param key 发送key
   * @param val 发送值
   */
  static mainWinSend(key, ...val): void {
    GlobalWin.mainWin.webContents.send(key, ...val)
  }

  /**
   * 主窗口显示后需要触发的回调
   */
  static mainOrOcrWinShowCallback(): void {
    // 不管有没有注册Esc快捷键 先注销
    GlobalShortcutEvent.unregisterEsc()
    // TODO 这里暂时这么写 之后数据存储需要重构 不能继续放在 localStorage 中
    // alwaysOnTopAllowEscStatus 开启后，当翻译窗口置顶时，按ESC键依旧可隐藏窗口
    GlobalWin.mainWin.webContents
      .executeJavaScript('localStorage.alwaysOnTopAllowEscStatus')
      .then((alwaysOnTopAllowEscStatus) => {
        // 当窗口置顶时不注册Esc快捷键
        if (
          (!GlobalWin.isMainAlwaysOnTop && !GlobalWin.isOcrAlwaysOnTop) ||
          YesNoEnum.Y === alwaysOnTopAllowEscStatus
        ) {
          // 当显示窗口时注册快捷键
          // 按下 Esc 隐藏窗口
          WinEvent.translateWinRegisterEsc()
        }
      })
  }

  /**
   * OCR翻译事件发送
   *
   * @param text OCR文本
   */
  static mainWinSendOcrTranslated(text): void {
    GlobalWin.mainWin.webContents
      .executeJavaScript('localStorage.ocrWriteClipboardStatus')
      .then((wrapReplaceSpaceStatus) => {
        text = GlobalWin.mainWinUpdateTranslatedContent(text)
        if (YesNoEnum.Y === wrapReplaceSpaceStatus) {
          clipboard.writeText(text)
        }
      })
  }

  /**
   * 更新翻译内容事件
   *
   * @param text OCR文本
   */
  static mainWinUpdateTranslatedContent(text): string {
    // 先对文字做一次空处理 防止代码执行时出错
    // 不为空的情况下默认去掉文本内容前后的换行符
    text = text === undefined || text === null ? '' : text.replace(/^\n+|\n+$/g, '')
    GlobalWin.mainWinSend('update-translated-content', text)
    return text
  }

  /**
   * 更新翻译内容事件
   *
   * @param status 状态
   * @param text 结果
   */
  static ocrUpdateContent(status, text): void {
    if (YesNoEnum.Y === status) {
      // 先对文字做一次空处理 防止代码执行时出错
      // 不为空的情况下默认去掉文本内容前后的换行符
      text = text === undefined || text === null ? '' : text.replace(/^\n+|\n+$/g, '')
      if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR) {
        GlobalWin.ocrWin.webContents.send('update-text', text)
      } else if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR_TRANSLATE) {
        GlobalWin.mainWinSendOcrTranslated(text)
      } else if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR_SILENCE) {
        // 临时存储的图片清空
        GlobalWin.ocrSilenceTempImg = ''
        GlobalWin.ocrSilenceWinHide()
        clipboard.writeText(text)
      }
    } else {
      if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR) {
        GlobalWin.ocrWin.webContents.send('show-msg-event', WebShowMsgEnum.ERROR, text)
        GlobalWin.ocrWin.webContents.send('update-text', '')
      } else if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR_TRANSLATE) {
        GlobalWin.mainWinSend('show-msg-event', WebShowMsgEnum.ERROR, text)
        GlobalWin.mainWinSend('update-translated-content', '')
      } else if (ScreenshotsMain.ocrType === OcrTypeEnum.OCR_SILENCE) {
        // 如果静默OCR失败 使用OCR页面进行提示报错
        GlobalWin.ocrSilenceWinHide()
        GlobalWin.ocrWin.show()
        setTimeout(() => WinEvent.ocrAlwaysOnTop(GlobalWin.isOcrAlwaysOnTop), 300)
        // 把临时存储的 截图图片 设置到OCR页面
        GlobalWin.ocrWin.webContents.send('update-img', GlobalWin.ocrSilenceTempImg)
        GlobalWin.ocrWin.webContents.send('show-msg-event', WebShowMsgEnum.ERROR, text)
        GlobalWin.ocrWin.webContents.send('update-text', '')
        // 临时存储的图片清空
        GlobalWin.ocrSilenceTempImg = ''
      }
    }
  }

  /**
   * 设置设置窗口
   *
   * @param setWin 设置窗口
   */
  static setSetWin(setWin): void {
    // 在调用处保证只会创建一次 销毁时也自动置空 所以此处目前可以不加校验
    GlobalWin.setWin = setWin
  }

  /**
   * 设置悬浮球窗口
   *
   * @param hoverBallWin 悬浮球窗口
   */
  static setHoverBallWin(hoverBallWin): void {
    // 此处校验是因为窗口不会销毁 所以防止重复设置
    if (isNull(GlobalWin.hoverBallWin)) {
      GlobalWin.hoverBallWin = hoverBallWin
    }
  }

  /**
   * 隐藏悬浮球窗口
   */
  static hoverBallWinHide(): void {
    if (isNull(GlobalWin.hoverBallWin)) {
      return
    }
    // console.log('隐藏悬浮球窗口')
    GlobalWin.isHoverBall = false
    GlobalWin.hoverBallWin.hide()
    GlobalWin.hoverBallWin.webContents.send('hover-ball-hide-events')
  }

  /**
   * 显示悬浮球窗口
   */
  static hoverBallWinShow(): void {
    if (isNull(GlobalWin.hoverBallWin)) {
      return
    }
    // console.log('显示悬浮球窗口')
    GlobalWin.isHoverBall = true
    GlobalWin.hoverBallWin.setAlwaysOnTop(true, 'pop-up-menu', 1)
    GlobalWin.hoverBallWin.setVisibleOnAllWorkspaces(true)
    GlobalWin.hoverBallWin.showInactive()
    GlobalWin.hoverBallWin.webContents
      .executeJavaScript('JSON.stringify({width:screen.width,height: screen.height})')
      .then((value) => {
        const res = JSON.parse(value)
        const width = res.width
        const height = res.height
        // 获取到鼠标的横坐标和纵坐标
        const { x, y } = screen.getCursorScreenPoint()
        // 设置坐标的同时设置宽高 否则在多显示器且显示器之间缩放比例不一致的情况下来回切换会导致悬浮球显示错位
        GlobalWin.hoverBallWin.setBounds({ x: x, y: y + 11, width: width, height: height })
        GlobalWin.hoverBallWin.webContents.send('hover-ball-show-events')
      })
  }

  /**
   * 设置Ocr窗口
   *
   * @param ocrWin 悬浮球窗口
   */
  static setOcrWin(ocrWin): void {
    // 此处校验是因为窗口不会销毁 所以防止重复设置
    if (isNull(GlobalWin.ocrWin)) {
      GlobalWin.ocrWin = ocrWin
    }
  }

  /**
   * 隐藏OCR窗口
   */
  static ocrWinHide(): void {
    GlobalWin.winHide(GlobalWin.ocrWin)
  }

  /**
   * 显示OCR窗口
   */
  static ocrWinShow(): void {
    GlobalWin.winShow(GlobalWin.ocrWin)
    this.mainOrOcrWinShowCallback()
  }

  /**
   * 设置OCR静默窗口
   *
   * @param ocrSilenceWin OCR静默窗口
   */
  static setOcrSilenceWin(ocrSilenceWin): void {
    // 此处校验是因为窗口不会销毁 所以防止重复设置
    if (isNull(GlobalWin.ocrSilenceWin)) {
      GlobalWin.ocrSilenceWin = ocrSilenceWin
    }
  }

  /**
   * 隐藏OCR静默窗口
   */
  static ocrSilenceWinHide(): void {
    if (isNull(GlobalWin.ocrSilenceWin)) {
      return
    }
    // console.log('隐藏OCR静默窗口')
    GlobalWin.isOcrSilence = false
    GlobalWin.ocrSilenceWin.hide()
    GlobalWin.ocrSilenceWin.webContents.send('ocr-silence-hide-events')
  }

  /**
   * 显示OCR静默窗口
   */
  static ocrSilenceWinShow(): void {
    if (isNull(GlobalWin.ocrSilenceWin)) {
      return
    }
    // console.log('显示OCR静默窗口')
    GlobalWin.isOcrSilence = true
    GlobalWin.ocrSilenceWin.setAlwaysOnTop(true, 'pop-up-menu', 1)
    GlobalWin.ocrSilenceWin.setVisibleOnAllWorkspaces(true)
    GlobalWin.ocrSilenceWin.showInactive()
    GlobalWin.ocrSilenceWin.webContents
      .executeJavaScript('JSON.stringify({width:screen.width,height: screen.height})')
      .then((value) => {
        const res = JSON.parse(value)
        const width = res.width
        const height = res.height
        // 获取到鼠标的横坐标和纵坐标
        const { x, y } = screen.getCursorScreenPoint()
        // 设置坐标的同时设置宽高 否则在多显示器且显示器之间缩放比例不一致的情况下来回切换会导致悬浮球显示错位
        GlobalWin.ocrSilenceWin.setBounds({ x: x, y: y + 11, width: width, height: height })
        GlobalWin.ocrSilenceWin.webContents.send('ocr-silence-show-events')
      })
  }

  /**
   * 退出应用
   */
  static closeApp(): void {
    // 设置主窗口可关闭
    GlobalWin.isMainWinClose = true
    app.quit()
  }
}

export default GlobalWin
