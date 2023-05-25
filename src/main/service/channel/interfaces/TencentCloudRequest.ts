import * as tencentCloud from 'tencentcloud-sdk-nodejs-tmt'
import * as TencentCloudCommon from 'tencentcloud-sdk-nodejs-common'
import { injectAgentBySetAgentFieldName } from '../../../utils/RequestUtil'

const TmtClient = tencentCloud.tmt.v20180321.Client
/**
 * 翻译
 *
 * @param info 翻译信息
 */
const apiTranslate = async (info) => {
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

export default {
  apiTranslate
}
