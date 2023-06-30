import { Service } from '@volcengine/openapi'
import { OpenApiResponse } from '@volcengine/openapi/lib/base/types'
import { VolcanoOcrModelEnum } from '../../../enums/VolcanoOcrModelEnum'
import { isNull } from '../../../../common/utils/validate'

/**
 * 翻译
 *
 * 官方文档和node SDK没有支持翻译接口
 * 示例来源官方SDK的issues : https://github.com/volcengine/volc-sdk-nodejs/issues/3
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<OpenApiResponse<any>> => {
  const data = {
    SourceLanguage: info.languageType,
    TargetLanguage: info.languageResultType,
    TextList: [info.translateContent]
  }
  const service = new Service({
    host: 'open.volcengineapi.com',
    serviceName: 'translate',
    region: 'cn-north-1',
    accessKeyId: info.appId,
    secretKey: info.appKey
  })
  const fetchApi = service.createAPI('TranslateText', {
    Version: '2020-06-01',
    method: 'POST',
    contentType: 'json'
  })
  return await fetchApi(data)
}

/**
 * OCR
 *
 * 官方文档和node SDK没有支持翻译接口
 * 这里参照上面的翻译接口和对照OCR文档填写
 *
 * @param info 翻译信息
 */
const apiOcr = async (info): Promise<OpenApiResponse<any>> => {
  const data = {
    image_base64: info.img.replace('data:image/png;base64,', '')
  }
  const service = new Service({
    host: 'visual.volcengineapi.com',
    serviceName: 'cv',
    region: 'cn-north-1',
    accessKeyId: info.appId,
    secretKey: info.appKey
  })
  // 由于之前的没有设置模型字段 所以会有存在旧数据为空的情况 这里默认设置多语种OCR
  if (isNull(info.model)) {
    info.model = VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR
  }
  let version = ''
  if (info.model === VolcanoOcrModelEnum.OCR_NORMAL) {
    version = '2020-08-26'
  } else if (info.model === VolcanoOcrModelEnum.MULTI_LANGUAGE_OCR) {
    version = '2022-08-31'
  }
  const fetchApi = service.createAPI(info.model, {
    Version: version,
    method: 'POST',
    contentType: 'urlencode'
  })
  return await fetchApi(data)
}

export default {
  apiTranslate,
  apiOcr
}
