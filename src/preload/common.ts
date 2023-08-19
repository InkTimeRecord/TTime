import { ipcRenderer } from 'electron'

/**
 * 日志 - info级别
 */
const logInfoEvent = (...text): void => {
  ipcRenderer.invoke('log-info-event', ...text)
}

/**
 * 日志 - error级别
 */
const logErrorEvent = (...text): void => {
  ipcRenderer.invoke('log-error-event', ...text)
}

/**
 * 获取系统类型
 */
const getSystemTypeEvent = (): string => {
  return ipcRenderer.sendSync('get-system-type-event')
}

/**
 * 打开设置页面事件
 */
const openSetPageEvent = (): void => {
  ipcRenderer.invoke('open-set-page-event')
}

/**
 * 窗口显示消息提示
 *
 * @param callback 回调方法
 */
const showMsgEvent = (callback): void => {
  ipcRenderer.on('show-msg-event', (_event, type, msg) => {
    callback(type, msg)
  })
}

/**
 * 数据是否存在
 *
 * @param storeTypeEnum 存储类型
 * @param key key
 */
const cacheHas = (storeTypeEnum, key): boolean => {
  return ipcRenderer.sendSync('cache-has', storeTypeEnum, key)
}

/**
 * 数据获取
 *
 * @param storeTypeEnum 存储类型
 * @param key key
 */
const cacheGet = (storeTypeEnum, key): object => {
  return ipcRenderer.sendSync('cache-get', storeTypeEnum, key)
}

/**
 * 数据存储
 *
 * @param storeTypeEnum 存储类型
 * @param key key
 * @param obj 数据
 */
const cacheSet = (storeTypeEnum, key, obj): void => {
  ipcRenderer.invoke('cache-set', storeTypeEnum, key, obj)
}

/**
 * 数据删除
 *
 * @param storeTypeEnum 存储类型
 * @param key key
 */
const cacheDelete = (storeTypeEnum, key): void => {
  ipcRenderer.invoke('cache-delete', storeTypeEnum, key)
}

/**
 * 跳转页面
 */
const jumpToPage = (url) => {
  ipcRenderer.send('jump-to-page-event', url)
}

/**
 * 获取版本号
 *
 * @return 版本号
 */
const getVersionEvent = (): string => {
  return ipcRenderer.sendSync('get-version-event')
}

/**
 * 退出应用事件
 */
const closeAppEvent = (): void => {
  ipcRenderer.invoke('close-app-event')
}

/**
 * 文本写入剪切板事件
 */
const textWriteShearPlateEvent = (text): void => {
  ipcRenderer.invoke('text-write-shear-plate-event', text)
}

export default {
  logInfoEvent,
  logErrorEvent,
  getSystemTypeEvent,
  openSetPageEvent,
  showMsgEvent,
  cacheHas,
  cacheGet,
  cacheSet,
  cacheDelete,
  jumpToPage,
  getVersionEvent,
  closeAppEvent,
  textWriteShearPlateEvent
}
