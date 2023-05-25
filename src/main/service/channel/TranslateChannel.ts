import { ipcMain } from 'electron'
import TranslateChannelFactory from './factory/TranslateChannelFactory'
import GlobalWin from '../GlobalWin'
import R from '../../class/R'
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
 * 翻译结果消息回调
 * 如果校验无法翻译时，但也不能触发翻译事件时候，此处模拟翻译结果消息回调
 * 目前主要用于手动设置了翻译语言后的校验逻辑
 *
 * @param channel 翻译类型
 * @param msg     回调消息内容
 */
ipcMain.handle('api-translate-result-msg-callback-event',(_event, channel, msg) => {
  GlobalWin.mainWin.webContents.send(channel.toLowerCase() + '-api-translate-callback-event', R.okT(msg))
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
 * Ocr结果消息回调
 * 如果校验无法翻译时，但也不能触发翻译事件时候，此处模拟翻译结果消息回调
 * 目前主要用于手动设置了翻译语言后的校验逻辑
 *
 * @param channel Ocr类型
 * @param msg     回调消息内容
 */
ipcMain.handle('api-ocr-result-msg-callback-event',(_event, channel, msg) => {
  GlobalWin.mainWin.webContents.send(channel.toLowerCase() + '-api-ocr-callback-event', R.okT(msg))
})
