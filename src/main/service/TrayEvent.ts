import { app, Menu, nativeImage, shell, Tray } from 'electron'
import { isNotNull } from '../../common/utils/validate'
import * as path from 'path'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'
import createSetWindow from './Set'
import AutoUpdater from './AutoUpdater'
import log from '../utils/log'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import GlobalWin from './GlobalWin'

class TrayEvent {
  /**
   * 托盘
   */
  static mainTray

  constructor() {
    if (isNotNull(TrayEvent.mainTray)) {
      return
    }
    // 托盘菜单列表
    const trayMenuTemplate = [
      {
        enabled: false,
        label: 'TTime 版本 ' + app.getVersion()
      },
      { type: 'separator' },
      {
        label: '显示翻译窗口',
        click: (): void => {
          GlobalShortcutEvent.translateInput()
        }
      },
      {
        label: '使用教程',
        click: (): void => {
          shell.openExternal('https://ttime.timerecord.cn')
        }
      },
      {
        label: '检查更新',
        click: (): void => {
          // 自动更新逻辑
          AutoUpdater.startCheck(false)
        }
      },
      {
        label: '查看日志',
        click: (): void => {
          const systemType = SystemTypeEnum.getSystemType()
          log.info('查看日志')
          if (systemType === SystemTypeEnum.MAC) {
            shell.openPath(app.getPath('userData') + '/logs')
          } else if (systemType === SystemTypeEnum.WIN) {
            shell.openPath(app.getPath('userData') + '\\logs')
          } else {
            log.info('systemType : ', systemType, ' 系统类型不支持')
          }
        }
      },
      {
        label: '设置',
        click: (): void => {
          createSetWindow()
        }
      },
      { type: 'separator' },
      {
        label: '重启TTime',
        click: (): void => {
          app.relaunch()
          app.exit()
        }
      },
      {
        label: '退出',
        click: (): void => {
          GlobalWin.closeApp()
        }
      }
    ]
    let iconPath
    if (SystemTypeEnum.isMac()) {
      iconPath = path.join(__dirname, '../../public/icon-mac-tray.png')
    } else if (SystemTypeEnum.isWin()) {
      iconPath = path.join(__dirname, '../../public/icon-1024x1024.png')
    } else {
      iconPath = path.join(__dirname, '../../public/logo-16x16.png')
    }
    if (SystemTypeEnum.isMac()) {
      const icon = nativeImage.createFromPath(iconPath)
      const trayIcon = icon.resize({ width: 16 })
      trayIcon.setTemplateImage(true)
      // 创建系统托盘
      TrayEvent.mainTray = new Tray(trayIcon)
    } else {
      // 创建系统托盘
      TrayEvent.mainTray = new Tray(iconPath)
    }
    // 设置托盘图标悬停时提示内容
    TrayEvent.mainTray.setToolTip('TTime')
    // 构建托盘菜单列表
    // @ts-ignore 无缘无故检测说缺少可选的参数 这里直接忽略
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    // 设置托盘菜单列表
    TrayEvent.mainTray.setContextMenu(contextMenu)
    // TrayEvent.mainTray.setImage(trayIconImage)
    // 单击显示主窗口，再单击隐藏主窗口
    TrayEvent.mainTray.on('click', () => {
      if (SystemTypeEnum.isWin()) {
        GlobalShortcutEvent.translateInput()
      }
    })
  }
}

export { TrayEvent }
