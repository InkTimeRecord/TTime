import { app, clipboard, ipcMain, nativeImage } from 'electron'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { isNull } from '../../common/utils/validate'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import AutoLaunch from 'auto-launch'
import log from '../utils/log'
import { EnvEnum } from '../enums/EnvEnum'
import GlobalWin from './GlobalWin'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import StoreService from './StoreService'

class WinEvent {
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
     * 图片写入剪切板
     */
    ipcMain.handle('base64-img-write-shear-plate-event', (_event, base64Img) => {
      // 写入剪切板
      clipboard.writeImage(nativeImage.createFromDataURL(base64Img))
    })
    /**
     * 始终在最前面
     */
    ipcMain.handle('always-on-top-event', (_event, status) => {
      WinEvent.alwaysOnTop(status)
    })
    /**
     * 始终在最前面
     */
    ipcMain.handle('ocr-always-on-top-event', (_event, status) => {
      WinEvent.ocrAlwaysOnTop(status)
    })
    /**
     * 调起翻译
     */
    ipcMain.handle('update-translated-content-event', (_event, text) => {
      // 推送给Vue页面进行更新翻译输入内容
      GlobalWin.mainWinUpdateTranslatedContent(text)
      GlobalWin.mainWinShow()
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
      WinEvent.updateAutoLaunch(null, (isEnabled) => {
        StoreService.configSet('autoLaunch', isEnabled ? YesNoEnum.Y : YesNoEnum.N)
        return isEnabled
      })
    })
    /**
     * 开机自启事件
     */
    ipcMain.handle('auto-launch-event', (_event, status) => {
      log.info('开机自启事件 : ', status)
      WinEvent.updateAutoLaunch(status, () => {
        return status
      })
    })
  }

  /**
   * 主窗口置顶
   *
   * @param status 置顶状态
   */
  static alwaysOnTop(status): void {
    GlobalWin.mainWin.setAlwaysOnTop(status)
    GlobalWin.isMainAlwaysOnTop = status
    // 触发窗口置顶时候也触发窗口显示回调
    // 用于处理 alwaysOnTopAllowEscStatus 逻辑
    GlobalWin.mainOrOcrWinShowCallback()
  }

  /**
   * OCR窗口置顶
   *
   * @param status 置顶状态
   */
  static ocrAlwaysOnTop(status): void {
    GlobalWin.ocrWin.setAlwaysOnTop(status)
    GlobalWin.isOcrAlwaysOnTop = status
    // 触发窗口置顶时候也触发窗口显示回调
    // 用于处理 alwaysOnTopAllowEscStatus 逻辑
    GlobalWin.mainOrOcrWinShowCallback()
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
        GlobalWin.ocrWinHide()
      })
    }, 300)
  }

  /**
   * 修改开机自启状态
   *
   * @param status    设置自启状态
   * @param callback    设置自启状态
   */
  static updateAutoLaunch(status, callback): void {
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
