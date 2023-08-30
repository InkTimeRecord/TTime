import { ipcMain } from 'electron'
import GlobalWin from '../GlobalWin'
import R from '../../../common/class/R'
import TranslateChannelFactory from './factory/TranslateChannelFactory'
import OcrChannelFactory from './factory/OcrChannelFactory'

/**
 * 翻译
 *
 * @param channel 翻译类型
 * @param info    翻译信息
 */
ipcMain.handle('api-unite-translate', (_event, channel, info) => {
  TranslateChannelFactory.translate(channel, info)
})

/**
 * 选择翻译校验
 *
 * @param channel 翻译类型
 * @param info    翻译信息
 */
ipcMain.handle('api-unite-translate-check', (_event, channel, info) => {
  TranslateChannelFactory.translateCheck(channel, info)
})

/**
 * 代理翻译 - 调用翻译结果回调
 */
ipcMain.handle('agent-api-translate-callback', (_event, res) => {
  const info = res.data.request
  const channel = TranslateChannelFactory.channels[info.type + 'Channel']
  info.isTranslateCheckType
    ? channel.apiTranslateCheckCallback(res)
    : channel.apiTranslateCallback(res)
})

/**
 * 翻译结果消息回调
 * 如果校验无法翻译时，但也不能触发翻译事件时候，此处模拟翻译结果消息回调
 * 目前主要用于手动设置了翻译语言后的校验逻辑
 *
 * @param channel 翻译类型
 * @param msg     回调消息内容
 */
ipcMain.handle('api-translate-result-msg-callback-event', (_event, channel, msg) => {
  GlobalWin.mainWinSend(channel.toLowerCase() + '-api-translate-callback-event', R.okT(msg))
})

/**
 * ocr
 *
 * @param channel Ocr类型
 * @param info    Ocr信息
 */
ipcMain.handle('api-unite-ocr', (_event, channel, info) => {
  OcrChannelFactory.ocr(channel, info)
})

/**
 * 选择Ocr校验
 *
 * @param channel Ocr类型
 * @param info    Ocr信息
 */
ipcMain.handle('api-unite-ocr-check', (_event, channel, info) => {
  OcrChannelFactory.ocrCheck(channel, info)
})

/**
 * 代理OCR - 调用OCR结果回调
 */
ipcMain.handle('agent-api-ocr-callback', (_event, res) => {
  const info = res.data.request
  const channel = OcrChannelFactory.channels[info.type + 'OcrChannel']
  info.isOcrCheckType ? channel.apiOcrCheckCallback(res) : channel.apiOcrCallback(res)
})

/**
 * Ocr结果消息回调
 * 如果校验无法翻译时，但也不能触发翻译事件时候，此处模拟翻译结果消息回调
 * 目前主要用于手动设置了翻译语言后的校验逻辑
 *
 * @param channel Ocr类型
 * @param msg     回调消息内容
 */
ipcMain.handle('api-ocr-result-msg-callback-event', (_event, channel, msg) => {
  GlobalWin.mainWinSend(channel.toLowerCase() + '-api-ocr-callback-event', R.okT(msg))
})
