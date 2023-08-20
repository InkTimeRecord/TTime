import { cacheGetByType, cacheSetByType } from './cacheUtil'
import { StoreTypeEnum } from '../../../common/enums/StoreTypeEnum'
import TranslateRecordVo from '../../../common/class/TranslateRecordVo'
import { isNull } from '../../../common/utils/validate'

/**
 * 更新翻译记录
 *
 * @param translateVo 翻译结果
 */
export const updateTranslateRecord = (translateVo): void => {
  // 翻译记录
  const translateRecordList = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
  for (let i = 0; i < translateRecordList.length; i++) {
    const translateRecord = translateRecordList[i]
    if (translateRecord['requestId'] === translateVo['requestId']) {
      const translateServiceRecordList = translateRecord['translateServiceRecordList']
      for (let j = 0; j < translateServiceRecordList.length; j++) {
        const translateServiceRecord = translateServiceRecordList[j]
        if (translateServiceRecord.translateServiceId === translateVo['translateServiceId']) {
          const newTranslateInfo = JSON.parse(JSON.stringify(translateVo))
          // 最上层对象已经记录过了服务ID和请求ID，所以这里移除重复记录字段
          delete newTranslateInfo.translateServiceId
          delete newTranslateInfo.requestId
          translateServiceRecord['translateVo'] = newTranslateInfo
        }
      }
    }
  }
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList', translateRecordList)
}

/**
 * 获取翻译记录
 *
 * @return 翻译记录
 */
export const getTranslateRecordList = (): Array<TranslateRecordVo> => {
  const res = cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
  return isNull(res) ? [] : res
}

/**
 * 获取翻译记录数量
 */
export const getTranslateRecordSize = (): number => {
  return cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordSize')
}

/**
 * 更新翻译记录
 *
 * @return 翻译记录列表
 */
export const updateTranslateRecordList = (translateRecordList): void => {
  const translateRecordSize = translateRecordList.length
  // 如果数组的长度超过了30，移除第一个元素
  if (translateRecordSize >= 30) {
    translateRecordList.shift()
  }
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordSize', translateRecordSize)
  cacheSetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList', translateRecordList)
}
