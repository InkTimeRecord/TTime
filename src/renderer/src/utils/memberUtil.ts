import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'
import { MemberTypeEnum } from '../../../common/enums/MemberTypeEnum'
import { cacheGet } from './cacheUtil'
import { findNewByInfo, saveServiceInfo } from '../api/user'
import { ServiceTypeEnum } from '../../../common/enums/ServiceTypeEnum'
import { getTranslateServiceMap, setTranslateServiceMap } from './translateServiceUtil'
import { isNull } from '../../../common/utils/validate'
import { NewStatusEnum } from '../../../common/enums/NewStatusEnum'

/**
 * 是否为会员
 */
export const isMemberVip = (): boolean => {
  return cacheGet('loginStatus') === LoginStatusEnum.Y && cacheGet('userInfo').memberType === MemberTypeEnum.VIP
}

/**
 * 保存服务信息事件
 */
export const saveServiceInfoHandle = (isNew = NewStatusEnum.Y): void => {
  if (isMemberVip()) {
    saveServiceInfo({
      key: cacheGet('translateServiceKey'),
      serviceType: ServiceTypeEnum.TRANSLATE,
      info: JSON.stringify(Array.from(getTranslateServiceMap())),
      isNew: isNew
    }).then(() => {
    })
  }
}

export const loadNewServiceInfo = (): void => {
  const key = cacheGet('translateServiceKey')
  if (!isMemberVip() || isNull(key)) {
    return
  }
  findNewByInfo({
    serviceType: ServiceTypeEnum.TRANSLATE,
    key: key
  }).then((data: any) => {
    if(isNull(data.info)) {
      return
    }
    setTranslateServiceMap(new Map(JSON.parse(data.info)))
  })
  return
}
