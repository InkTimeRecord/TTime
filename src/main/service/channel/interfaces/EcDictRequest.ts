import { isNull } from '../../../../common/utils/validate'

let sqlite3: any = null
let db: any = null
const ecDictDbInit = (): void => {
  if (isNull(db)) {
    sqlite3 = require('sqlite3').verbose()
    db = new sqlite3.Database(
      'plugins\\ultimate.db'
    )
  }
}
ecDictDbInit()

/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = (info): Promise<object> => {
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
