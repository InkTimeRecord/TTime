import { clipboard } from 'electron'
import { uIOhook, UiohookKeyboardEvent } from 'uiohook-napi'
import GlobalWin from './GlobalWin'
import { YesNoEnum } from '../../common/enums/YesNoEnum'
import StoreService from './StoreService'

uIOhook.start()

/**
 * 剪贴板监听事件
 */
uIOhook.on('keydown', (e: UiohookKeyboardEvent) => {
  // log.info('text e = ', e)
  if (
    e.ctrlKey &&
    e.keycode === 46 &&
    StoreService.configGet('clipboardListenerStatus') === YesNoEnum.Y
  ) {
    setTimeout(() => {
      const text = clipboard.readText()
      // 推送给Vue页面进行更新翻译输入内容
      GlobalWin.mainWinUpdateTranslatedContent(text)
      GlobalWin.mainWinShow()
    }, 300)
  }
})
