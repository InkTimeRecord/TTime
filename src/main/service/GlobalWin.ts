import { isNull } from '../utils/validate'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { app } from 'electron'
import { TrayEvent } from './TrayEvent'
import { WinEvent } from './Win'

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
    // 当窗口置顶时不注册Esc快捷键
    if (!WinEvent.isAlwaysOnTop) {
      // 当显示窗口时注册快捷键
      // 按下 Esc 隐藏窗口
      WinEvent.translateWinRegisterEsc()
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
   * 退出应用
   */
  static closeApp(): void {
    // 设置主窗口可关闭
    TrayEvent.isMainWinClose = true
    app.quit()
  }

}

export default GlobalWin
