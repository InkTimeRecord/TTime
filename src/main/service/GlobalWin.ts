import { isNull } from '../utils/validate'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app } from 'electron'
import { TrayEvent } from './TrayEvent'
import { WinEvent } from './Win'
import { YesNoEnum } from '../enums/YesNoEnum'

/**
 * 全局窗口
 */
class GlobalWin {
  /**
   * 主窗口
   */
  static mainWin
  /**
   * 设置窗口
   */
  static setWin

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
    if (isNull(GlobalWin.mainWin)) {
      return
    }
    // 当隐藏窗口时注销Esc快捷键
    GlobalShortcutEvent.unregisterEsc()
    GlobalWin.mainWin.hide()
  }

  /**
   * 显示主窗口
   */
  static mainWinShow(): void {
    if (isNull(GlobalWin.mainWin)) {
      return
    }
    GlobalWin.mainWin.show()
    this.mainWinShowCallback()
  }

  /**
   * 窗口事件发送
   *
   * @param key 发送key
   * @param val 发送值
   */
  static mainWinSend(key, ...val): void {
    GlobalWin.mainWin.webContents.send(key, ...val)
  }

  /**
   * 窗口显示后需要触发的回调
   */
  static mainWinShowCallback(): void {
    // 不管有没有注册Esc快捷键 先注销
    GlobalShortcutEvent.unregisterEsc()
    // TODO 这里暂时这么写 之后数据存储需要重构 不能继续放在 localStorage 中
    // alwaysOnTopAllowEscStatus 开启后，当翻译窗口置顶时，按ESC键依旧可隐藏窗口
    GlobalWin.mainWin.webContents
      .executeJavaScript('localStorage.alwaysOnTopAllowEscStatus')
      .then((alwaysOnTopAllowEscStatus) => {
        // 当窗口置顶时不注册Esc快捷键
        if (!WinEvent.isAlwaysOnTop || YesNoEnum.Y === alwaysOnTopAllowEscStatus) {
          // 当显示窗口时注册快捷键
          // 按下 Esc 隐藏窗口
          WinEvent.translateWinRegisterEsc()
        }
      })
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
   * 退出应用
   */
  static closeApp(): void {
    // 设置主窗口可关闭
    TrayEvent.isMainWinClose = true
    app.quit()
  }
}

export default GlobalWin
