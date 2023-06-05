import { app, clipboard, ipcMain } from 'electron'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { isNull } from '../utils/validate'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import AutoLaunch from 'auto-launch'
import log from '../utils/log'
import { EnvEnum } from '../enums/EnvEnum'
import GlobalWin from './GlobalWin'
import { YesNoEnum } from '../enums/YesNoEnum'

class WinEvent {
  static isAlwaysOnTop = true
  static isHoverBall = false

  constructor(mainWinInfo) {
    /**
     * 监听页面高度更新窗口大小
     */
    ipcMain.handle('window-height-change-event', (_event, height) => {
      // 更新窗口大小
      this.updateWinSize(GlobalWin.mainWin, mainWinInfo.width, height)
    })
    /**
     * 文字写入剪切板
     */
    ipcMain.handle('text-write-shear-plate-event', (_event, text) => {
      // 写入剪切板
      clipboard.writeText(text)
    })
    /**
     * 始终在最前面
     */
    ipcMain.handle('always-on-top-event', (_event, status) => {
      WinEvent.alwaysOnTop(status)
    })

    /**
     * 初始加载翻译快捷键
     */
    ipcMain.handle('init-load-translate-shortcut-key-event', (_event, list) => {
      list.forEach((translateShortcutKey) => {
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
    })
    /**
     * 开机自启事件
     */
    ipcMain.handle('auto-launch-init-event', (_event) => {
      log.info('开机自启初始化事件')
      this.updateAutoLaunch(null, (isEnabled) => {
        GlobalWin.mainWinSend(
          'update-cache-event',
          'autoLaunch',
          isEnabled ? YesNoEnum.Y : YesNoEnum.N
        )
        return isEnabled
      })
    })
    /**
     * 开机自启事件
     */
    ipcMain.handle('auto-launch-event', (_event, status) => {
      log.info('开机自启事件 : ', status)
      this.updateAutoLaunch(status, () => {
        return status
      })
    })
  }

  /**
   * 窗口置顶
   *
   * @param status 置顶状态
   */
  static alwaysOnTop(status): void {
    GlobalWin.mainWin.setAlwaysOnTop(status)
    WinEvent.isAlwaysOnTop = status
    if (status) {
      // 当置顶时注销Esc快捷键
      GlobalShortcutEvent.unregisterEsc()
    } else {
      // 当窗口是可见时才会触发注册Esc快捷键事件
      // 因为窗口首次加载时候会进入这里触发事件 如果窗口没有显示的情况下就注册了Esc 会导致快捷键被占用
      if (GlobalWin.mainWin.isVisible()) {
        // 当置顶时注册Esc快捷键事件
        WinEvent.translateWinRegisterEsc()
      }
    }
  }

  /**
   * 翻译窗口注册Esc
   * 一般是窗口置顶时触发
   */
  static translateWinRegisterEsc(): void {
    setTimeout(() => {
      // 翻译窗口注册Esc快捷键 一般是窗口置顶时触发
      GlobalShortcutEvent.register('Esc', () => {
        GlobalWin.mainWinHide()
      })
    }, 300)
  }

  /**
   * 修改开机自启状态
   *
   * @param status    设置自启状态
   * @param callback    设置自启状态
   */
  updateAutoLaunch(status, callback): void {
    if (EnvEnum.isDev()) {
      log.info('开发环境不设置开机自启')
      return
    }
    log.info('开机自启事件 : ', status)
    const autoLaunchConfig = {
      name: app.getName()
    }
    // linux下需要指定path。参考https://github.com/Teamwork/node-auto-launch/issues/89
    if (SystemTypeEnum.isLinux()) {
      autoLaunchConfig['path'] = process.env.APPIMAGE
    }
    const autoLaunch = new AutoLaunch(autoLaunchConfig)
    autoLaunch.isEnabled().then(async (isEnabled) => {
      log.info('当前开机自启状态 isEnabled = ', isEnabled)
      status = callback(isEnabled)
      if (status) {
        if (isEnabled) {
          log.info('已开启开机自启状态，不重复配置')
          return
        }
        autoLaunch.enable().catch((error) => {
          log.error('开启开机自启错误：', error)
        })
      } else {
        if (!isEnabled) {
          log.log('已关闭开机自启状态，不重复配置')
          return
        }
        autoLaunch.disable().catch((error) => {
          log.error('关闭开机自启错误：', error)
        })
      }
    })
  }

  /**
   * 更新窗口大小
   *
   * @param win       窗口
   * @param width     宽度
   * @param height    高度
   */
  updateWinSize(win, width, height): void {
    win.setMaximumSize(width, height)
    win.setMinimumSize(width, height)
    win.setSize(width, height)
  }
}

export { WinEvent }
