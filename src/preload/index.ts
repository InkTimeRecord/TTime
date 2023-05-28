import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

let windowHeightList = []
let windowHeightEventStatue = false
let windowHeightIntervalEvent

// 停止设置窗口高度事件
const stopWindowHeightEvent = (): void => {
  // console.log("停止设置窗口高度事件");
  clearInterval(windowHeightIntervalEvent)
  windowHeightEventStatue = false
}

const windowHeightEvent = (): void => {
  if (windowHeightEventStatue) {
    return
  }
  windowHeightEventStatue = true
  // console.log(" 触发定时执行器 ");
  let zeroRunCount = 0
  windowHeightIntervalEvent = setInterval(() => {
    // console.log(" windowHeightEvent = ", windowHeightList.length, ' zeroRunCount = ', zeroRunCount);
    if (windowHeightList.length <= 0) {
      zeroRunCount++
      // 执行超过10次都是空的就停止定时执行器
      if (zeroRunCount >= 10) {
        // console.log(" 超过10次为空 停止定时执行器 ");
        stopWindowHeightEvent()
      }
      return
    }
    // 触发执行了的情况下重置停止定时执行器事件
    zeroRunCount = 0
    // 获取到需要设置的窗口大小中最大的值
    const preScrollHeight = windowHeightList[windowHeightList.length - 1] + 5
    // 清空列表
    windowHeightList = []
    // console.log("设置窗口大小 = ", preScrollHeight);
    ipcRenderer.invoke('window-height-change-event', preScrollHeight)
  }, 2000)
}

// 监听页面高度变化
const pageHeightChangeEvent = (): void => {
  const targetNode = document.scrollingElement
  if (null == targetNode) {
    return
  }
  // 观察器的配置（需要观察什么变动）
  const config = { attributes: true, childList: true, subtree: true }
  // @ts-ignore document 中存在的参数信息
  let preScrollHeight = targetNode.offsetHeight
  // 当观察到变动时执行的回调函数
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const callback = (_mutationsList, _observer) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const scrollHeight = targetNode.offsetHeight
    if (scrollHeight === preScrollHeight) {
      return
    }
    windowHeightChangeMaxEvent()
    preScrollHeight = scrollHeight
    // console.log("监听页面高度变化 preScrollHeight = ", preScrollHeight);
    windowHeightList = []
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    windowHeightList.push(preScrollHeight)
    setTimeout(() => {
      stopWindowHeightEvent()
      windowHeightEvent()
    }, 100)
  }
  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback)
  // 以上述配置开始观察目标节点
  observer.observe(targetNode, config)
}

/**
 * 窗口高度更新为最大
 */
const windowHeightChangeMaxEvent = (): void => {
  ipcRenderer.invoke('window-height-change-event', 722)
}

/**
 * 监听页面高度更新窗口大小
 */
const windowHeightChangeEvent = (): void => {
  // 延迟执行 防止获取页面高度还未更新就执行了更新窗口大小
  setTimeout(() => {
    ipcRenderer.invoke(
      'window-height-change-event',
      document.getElementsByTagName('html')[0].offsetHeight + 5
    )
  }, 251)
}

/**
 * 监听更新翻译输入内容事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const updateTranslateContentEvent = (callback): void => {
  ipcRenderer.on('update-translated-content', (_event, content) => {
    // 先对文字做一次空处理 防止代码执行时出错
    // 不为空的情况下默认去掉文本内容前后的换行符
    const newContent = content === undefined || content === null ? '' : content.replace(/^\n+|\n+$/g, '')
    callback(newContent)
  })
}

/**
 * 截图翻译结束通知事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const screenshotEndNotifyEvent = (callback): void => {
  ipcRenderer.on('screenshot-end-notify-event', (_event) => {
    callback()
  })
}

/**
 * 清空翻译输入、结果内容事件
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const clearAllTranslateContentEvent = (callback): void => {
  ipcRenderer.on('clear-all-translated-content', (_event, _content) => {
    callback()
  })
}

const winShowEvent = (callback): void => {
  ipcRenderer.on('win-show-event', () => {
    callback()
  })
}

const winShowByInputEvent = (callback): void => {
  ipcRenderer.on('win-show-input-event', () => {
    callback()
  })
}

/**
 * 打开设置页面事件
 */
const openSetPageEvent = (): void => {
  ipcRenderer.invoke('open-set-page-event')
}

/**
 * 文本写入剪切板事件
 */
const textWriteShearPlateEvent = (text): void => {
  ipcRenderer.invoke('text-write-shear-plate-event', text)
}

/**
 * 始终在最前面
 */
const alwaysOnTopEvent = (status): void => {
  ipcRenderer.invoke('always-on-top-event', status)
}

/**
 * 初始加载翻译快捷键事件
 * @param list
 */
const initLoadTranslateShortcutKeyEvent = (list): void => {
  ipcRenderer.invoke('init-load-translate-shortcut-key-event', list)
}

/**
 * 开机自启事件
 */
const autoLaunchInitEvent = (): void => {
  // 初始化默认传递true
  ipcRenderer.invoke('auto-launch-init-event')
}

/**
 * 更新消息事件
 *
 * @param callback 回调方法
 */
const updateMessageEvent = (callback): void => {
  ipcRenderer.on('update-message-event', (_event, { type, text }) => {
    callback(type, text)
  })
}

/**
 * 更新缓存事件
 *
 * @param callback 回调方法
 */
const updateCacheEvent = (callback): void => {
  ipcRenderer.on('update-cache-event', (_event, key, value) => {
    callback(key, value)
  })
}

/**
 * 静默更新事件
 */
const autoUpdaterSilenceStartCheckEvent = (): void => {
  ipcRenderer.invoke('auto-updater-silence-start-check')
}

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
 * 翻译
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const ttimeApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('ttime-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 腾讯云翻译 - 接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const tencentcloudApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('tencentcloud-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 百度翻译 - 接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const baiduApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('baidu-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 阿里云翻译 - 接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const aliyunApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('aliyun-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 谷歌翻译 - 接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const googleApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('google-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 谷歌翻译 - 接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const googlebuiltinApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('googlebuiltin-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * OpenAI - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const openaiApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('openai-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 网易有道 - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const youdaoApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('youdao-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * DeepL - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const deeplApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('deepl-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 火山 - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const volcanoApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('volcano-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * bing - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const bingApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('bing-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * bing - 翻译接口回调
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const bingdictApiTranslateCallbackEvent = (callback): void => {
  ipcRenderer.on('bingdict-api-translate-callback-event', (_event, obj) => {
    callback(obj)
  })
}

/**
 * 翻译结果消息回调
 * 如果校验无法翻译时，但也不能触发翻译事件时候，此处模拟翻译结果消息回调
 * 目前主要用于手动设置了翻译语言后的校验逻辑
 *
 * @param type 翻译渠道类型
 * @param msg  回调消息内容
 */
const apiTranslateResultMsgCallbackEvent = (type, msg): void => {
  ipcRenderer.invoke('api-translate-result-msg-callback-event', type, msg)
}

/**
 * 翻译
 *
 * @param type 翻译渠道类型
 * @param info 翻译信息
 */
const apiUniteTranslate = (type, info): void => {
  ipcRenderer.invoke('api-unite-translate', type, info)
}

/**
 * 应用启动
 */
const ttimeApiAppStart = (): void => {
  ipcRenderer.invoke('ttime-api-app-start')
}

/**
 * 应用翻译使用
 */
const ttimeApiTranslateUse = (): void => {
  ipcRenderer.invoke('ttime-api-translate-use')
}


const showMsgEvent = (callback): void => {
  ipcRenderer.on('show-msg-event', (_event, { type, msg }) => {
    callback(type, msg)
  })
}

/**
 * 更新翻译源通知
 *
 * @param callback 回调方法 用于主进程内部触发时推送到Vue页面执行
 */
const updateTranslateServiceEvent = (callback): void => {
  ipcRenderer.on('update-translate-service-event', (_event) => {
    callback()
  })
}

/**
 * 代理模式 - api翻译
 *
 * @param callback 回调
 */
const agentApiTranslate = (callback): void => {
  /**
   * 代理模式 - api翻译
   *
   * @param type 翻译源类型
   * @param info 翻译源类型
   * @param isCheckRequest 是验证请求
   */
  ipcRenderer.on('agent-api-translate', (_event, type, info, isCheckRequest) => {
    callback(type, info, isCheckRequest)
  })
}

/**
 * 代理翻译 - 调用翻译结果回调
 *
 * @param type      翻译源类型
 * @param status    请求状态
 * @param data      响应报文
 * @param info      请求报文
 */
const agentApiTranslateCallback = (type, status, data, info): void => {
  ipcRenderer.invoke('agent-api-translate-callback', type, status, data, info)
}

// Custom APIs for renderer
const api = {
  windowHeightChangeEvent,
  updateTranslateContentEvent,
  clearAllTranslateContentEvent,
  pageHeightChangeEvent,
  openSetPageEvent,
  textWriteShearPlateEvent,
  alwaysOnTopEvent,
  initLoadTranslateShortcutKeyEvent,
  autoLaunchInitEvent,
  updateMessageEvent,
  autoUpdaterSilenceStartCheckEvent,
  windowHeightChangeMaxEvent,
  logInfoEvent,
  logErrorEvent,
  screenshotEndNotifyEvent,
  winShowEvent,
  winShowByInputEvent,
  apiUniteTranslate,
  ttimeApiTranslateCallbackEvent,
  tencentcloudApiTranslateCallbackEvent,
  baiduApiTranslateCallbackEvent,
  aliyunApiTranslateCallbackEvent,
  googleApiTranslateCallbackEvent,
  googlebuiltinApiTranslateCallbackEvent,
  openaiApiTranslateCallbackEvent,
  youdaoApiTranslateCallbackEvent,
  deeplApiTranslateCallbackEvent,
  volcanoApiTranslateCallbackEvent,
  bingApiTranslateCallbackEvent,
  bingdictApiTranslateCallbackEvent,
  ttimeApiAppStart,
  showMsgEvent,
  updateTranslateServiceEvent,
  ttimeApiTranslateUse,
  apiTranslateResultMsgCallbackEvent,
  agentApiTranslate,
  agentApiTranslateCallback,
  updateCacheEvent
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
