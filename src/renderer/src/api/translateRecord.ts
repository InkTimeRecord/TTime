import request from '../utils/request'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import { AxiosResponse } from 'axios'
import TranslateRecordVo from '../../../common/class/TranslateRecordVo'
import TranslateServiceRecordVo from '../../../common/class/TranslateServiceRecordVo'
import TranslateVo from '../../../common/class/TranslateVo'

/**
 * 保存
 */
export function translateRecordSave(data: any): Promise<AxiosResponse> {
  return request({
    url: 'translate/translateRecord/',
    method: HttpMethodType.POST,
    data: data
  })
}

/**
 * 分页查询
 */
export function findTranslateRecordPageList(data: any): Promise<AxiosResponse> {
  return request({
    url: 'translate/translateRecord/',
    method: HttpMethodType.GET,
    params: data
  })
}

/**
 * 查询翻译记录详细
 */
export function findTranslateRecordDetail(id: string): Promise<AxiosResponse> {
  return request({
    url: 'translate/translateRecordDetail/' + id,
    method: HttpMethodType.GET
  })
}

/**
 * 删除翻译记录
 */
export function deleteTranslateRecord(id: string): Promise<AxiosResponse> {
  return request({
    url: 'translate/translateRecord/' + id,
    method: HttpMethodType.DELETE
  })
}

export class TranslateRecordSavePo {
  requestId: string
  translateContent: string
  languageType: string
  languageResultType: string
  recordDetailList: Array<TranslateRecordDetail>

  static build(translateRecord: TranslateRecordVo): TranslateRecordSavePo {
    const translateRecordSavePo = new TranslateRecordSavePo()
    translateRecordSavePo.requestId = translateRecord.requestId
    translateRecordSavePo.translateContent = translateRecord.translateContent
    translateRecordSavePo.languageType = translateRecord.languageType
    translateRecordSavePo.languageResultType = translateRecord.languageResultType
    translateRecordSavePo.recordDetailList = TranslateRecordDetail.buildList(translateRecord.translateServiceRecordList)
    return translateRecordSavePo
  }
}

export class TranslateRecordDetail {
  translateServiceType: string
  translateServiceId: string
  translateResultContent: string
  usPhonetic: string
  ukPhonetic: string
  usSpeech: string
  ukSpeech: string
  explains: string
  wfs: string

  static build(translateServiceRecord: TranslateServiceRecordVo): TranslateRecordDetail {
    let translateRecordDetail = new TranslateRecordDetail()
    let translateVo: TranslateVo = translateServiceRecord.translateVo
    translateRecordDetail.translateServiceType = translateServiceRecord.translateServiceType
    translateRecordDetail.translateServiceId = translateServiceRecord.translateServiceId
    if (typeof translateVo.translateList !== 'string') {
      translateRecordDetail.translateResultContent = translateVo.translateList.join('\n')
    }
    translateRecordDetail.usPhonetic = translateVo.usPhonetic
    translateRecordDetail.ukPhonetic = translateVo.ukPhonetic
    translateRecordDetail.usSpeech = translateVo.usSpeech
    translateRecordDetail.ukSpeech = translateVo.ukSpeech
    translateRecordDetail.explains = JSON.stringify(translateVo.explains)
    translateRecordDetail.wfs = JSON.stringify(translateVo.wfs)
    return translateRecordDetail
  }

  static buildList(translateServiceRecordList: Array<TranslateServiceRecordVo>): Array<TranslateRecordDetail> {
    return translateServiceRecordList.map((value: TranslateServiceRecordVo) => {
      return TranslateRecordDetail.build(value)
    })
  }
}
