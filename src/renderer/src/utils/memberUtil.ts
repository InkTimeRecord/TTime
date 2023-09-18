import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'
import { MemberTypeEnum } from '../../../common/enums/MemberTypeEnum'
import { cacheGet } from './cacheUtil'
import { saveServiceInfo } from '../api/user'
import { ServiceTypeEnum } from '../../../common/enums/ServiceTypeEnum'
import { getTranslateServiceMap } from './translateServiceUtil'

/**
 * 是否为会员
 */
export const isMemberVip = (): boolean => {
  return cacheGet('loginStatus') === LoginStatusEnum.Y && cacheGet('userInfo').memberType === MemberTypeEnum.VIP
}

/**
 * 保存服务信息事件
 */
export const saveServiceInfoHandel = (): void => {
  if (isMemberVip()) {
    saveServiceInfo({
      key: cacheGet('translateServiceKey'),
      serviceType: ServiceTypeEnum.TRANSLATE,
      info: JSON.stringify(Array.from(getTranslateServiceMap()))
    }).then(() => {
    })
  }
}
