import { isNull } from '../../../../common/utils/validate'
import StoreService from '../../StoreService'
import path from 'path'
import * as fse from 'fs-extra'

let sqlite3: any = null
let db: any = null
const ecDictDbInit = async (): Promise<void> => {
  const filePath = path.join(
    StoreService.systemGet(StoreService.userPluginsPathKey),
    'ecdict-ultimate',
    'ultimate.db'
  )
  console.log('filePath = ', filePath)
  if (isNull(db)) {
    // 校验文件是否存在
    await fse.pathExists(filePath, async (err, exists) => {
      console.log(err) // => null
      console.log(exists) // => false
      if (!exists) {
        return
      }
      sqlite3 = require('sqlite3').verbose()
      db = new sqlite3.Database(filePath)
      await setTimeout(() => {}, 10000)
      console.log('开始 1 ')
    })
  }
}

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<object> => {
  console.log('开始 0 ')
  await ecDictDbInit()
  console.log('开始 2 ')
  return new Promise((resolve, reject) => {
    if (isNull(db)) {
      resolve([])
    } else {
      db.all(
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
