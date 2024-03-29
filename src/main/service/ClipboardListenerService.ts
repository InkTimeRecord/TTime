import { clipboard } from 'electron'
import { uIOhook, UiohookKeyboardEvent } from 'uiohook-napi'
import GlobalWin from './GlobalWin'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import StoreService from './StoreService'
import { GlobalShortcutEvent } from './GlobalShortcutEvent'
import { SystemTypeEnum } from '../enums/SystemTypeEnum'

uIOhook.start()

/**
 * 剪贴板监听事件
 */
uIOhook.on('keydown', (e: UiohookKeyboardEvent) => {
  // console.log('text e = ', e)
  const status = SystemTypeEnum.isMac() ? e.metaKey : e.ctrlKey
  if (
    status &&
    e.keycode === 46 &&
    StoreService.configGet('clipboardListenerStatus') === YesNoEnum.Y &&
    !GlobalShortcutEvent.isChoice
  ) {
    setTimeout(() => {
      let text = clipboard.readText()
      text = GlobalShortcutEvent.splitSingleCamelCase(text)
      text = GlobalShortcutEvent.splitSingleUnderScore(text)
      // 推送给Vue页面进行更新翻译输入内容
      GlobalWin.mainWinUpdateTranslatedContent(text)
      GlobalWin.mainWinShow()
    }, 300)
  }
})
