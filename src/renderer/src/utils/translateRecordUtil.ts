import { cacheGetByType, cacheSetByType } from './cacheUtil'
import { StoreTypeEnum } from '../../../common/enums/StoreTypeEnum'
import TranslateRecordVo from '../../../common/class/TranslateRecordVo'

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
  return cacheGetByType(StoreTypeEnum.HISTORY_RECORD, 'translateRecordList')
}
