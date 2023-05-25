import { ipcMain } from 'electron'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import DeepLChannel from './DeepLChannel'
import GoogleChannel from './GoogleChannel'
import OpenAIChannel from './OpenAIChannel'

/**
 * 代理翻译 - 调用翻译结果回调
 */
ipcMain.handle('agent-api-translate-callback', (_event, type, status, data, info) => {
  if (TranslateServiceEnum.DEEP_L === type) {
    info == null ? DeepLChannel.apiTranslateCallback(status, data) : DeepLChannel.apiTranslateCheckCallback(status, data, info)
  } else if (TranslateServiceEnum.GOOGLE === type) {
    info == null ? GoogleChannel.apiTranslateCallback(status, data) : GoogleChannel.apiTranslateCheckCallback(status, data, info)
  } else if (TranslateServiceEnum.OPEN_AI === type) {
    info == null ? OpenAIChannel.apiTranslateCallback(status, data) : OpenAIChannel.apiTranslateCheckCallback(status, data, info)
  }
})
