import { app } from 'electron'
import log from 'electron-log'

// /Users/用户账号名称/Library/Application Support/time-translate/logs/
// C:\Users\用户账号名称\AppData\Roaming\time-translate/logs/
const userDataPath = app.getPath('userData') + '/logs/'

log.transports.file.level = 'debug'
// 文件最大不超过 1M
log.transports.file.maxSize = 1048576
// 日期样式
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'

const date = new Date()
// 补0扩展 当获取到的数字小于10时，数字前面补0
const zeroExpand = (num): string => {
  return parseInt(num) < 10 ? '0' + num : num
}
const dateName =
  date.getFullYear() + '-' + zeroExpand(date.getMonth() + 1) + '-' + zeroExpand(date.getDate())
// 输出路径 : /Users/用户账号名称/Library/Application Support/time-translate/logs/年-月-日.log
log.transports.file.resolvePath = () => userDataPath + dateName + '.log'

export default log
