import { isNotNull, isNull } from '../../../../common/utils/validate'
import StoreService from '../../StoreService'
import path from 'path'
import * as fse from 'fs-extra'

let sqlite3: any = null
let ecDictDB: any = null

/**
 * 词典库关闭连接
 */
export const ecDictDbClose = (): void => {
  if (isNotNull(ecDictDB)) {
    ecDictDB.close()
    ecDictDB = null
  }
}

/**
 * 词典库初始化
 */
const ecDictDbInit = (): void => {
  // 检测数据库是否初始化
  if (isNotNull(ecDictDB)) {
    return
  }
  // 数据文件路径
  const filePath = path.join(
    StoreService.systemGet(StoreService.userPluginsPathKey),
    'ecdict-ultimate',
    'ultimate.db'
  )
  // 检测数据文件是否存在
  const exists = fse.pathExistsSync(filePath)
  if (!exists) {
    return
  }
  // 初始化
  sqlite3 = require('sqlite3').verbose()
  ecDictDB = new sqlite3.Database(filePath)
}

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info: any): Promise<object> => {
  ecDictDbInit()
  return new Promise((resolve, reject) => {
    if (isNull(ecDictDB)) {
      resolve([])
    } else {
      ecDictDB.all(
        'SELECT * FROM stardict WHERE word = "' + info.translateContent.trim() + '"',
        (err: any, row: object | PromiseLike<object>) => {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
        }
      )
    }
  })
}

export default {
  apiTranslate
}
