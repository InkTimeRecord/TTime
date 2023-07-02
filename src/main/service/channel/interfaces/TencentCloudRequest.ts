import * as tmtTencentCloud from 'tencentcloud-sdk-nodejs-tmt'
import * as ocrTencentcloud from 'tencentcloud-sdk-nodejs-ocr'
import * as TencentCloudCommon from 'tencentcloud-sdk-nodejs-common'
import { injectAgentBySetAgentFieldName } from '../../../utils/RequestUtil'
import { TextTranslateResponse } from 'tencentcloud-sdk-nodejs-tmt/src/services/tmt/v20180321/tmt_models'
import { GeneralBasicOCRResponse } from 'tencentcloud-sdk-nodejs-ocr/src/services/ocr/v20181119/ocr_models'

const TmtClient = tmtTencentCloud.tmt.v20180321.Client
const OcrClient = ocrTencentcloud.ocr.v20181119.Client
/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info): Promise<TextTranslateResponse> => {
  const clientConfig: TencentCloudCommon.ClientConfig = {
    credential: {
      secretId: info.appId,
      secretKey: info.appKey
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: {
        endpoint: 'tmt.tencentcloudapi.com'
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await injectAgentBySetAgentFieldName(clientConfig.profile.httpProfile, 'agent')
  // 注入代理
  const client = new TmtClient(clientConfig)
  const params = {
    SourceText: info.translateContent,
    Source: info.languageType,
    Target: info.languageResultType,
    ProjectId: 0
  }
  return client.TextTranslate(params)
}

/**
 * OCR
 *
 * @param info OCR信息
 */
const apiOcr = async (info): Promise<GeneralBasicOCRResponse> => {
  const clientConfig: TencentCloudCommon.ClientConfig = {
    credential: {
      secretId: info.appId,
      secretKey: info.appKey
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: {
        endpoint: 'ocr.tencentcloudapi.com'
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await injectAgentBySetAgentFieldName(clientConfig.profile.httpProfile, 'agent')
  // 注入代理
  const client = new OcrClient(clientConfig)
  const params = {
    ImageBase64: info.img,
    LanguageType: info.languageType
  }
  return client.GeneralBasicOCR(params)
}

export default {
  apiTranslate,
  apiOcr
}
