import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'
import { MemberTypeEnum } from '../../../common/enums/MemberTypeEnum'
import { cacheGet } from './cacheUtil'
import { findNewByInfo, saveServiceInfo } from '../api/user'
import { ServiceTypeEnum } from '../../../common/enums/ServiceTypeEnum'
import { getTranslateServiceMap, setTranslateServiceMap } from './translateServiceUtil'
import { isNotNull } from '../../../common/utils/validate'
import { NewStatusEnum } from '../../../common/enums/NewStatusEnum'
import { getOcrServiceMap, setOcrServiceMap } from './ocrServiceUtil'

/**
 * 是否为会员
 */
export const isMemberVip = (): boolean => {
  return (
    cacheGet('loginStatus') === LoginStatusEnum.Y &&
    cacheGet('userInfo').memberType === MemberTypeEnum.VIP
  )
}

/**
 * 是否为会员 并且 已配置秘钥
 */
export const isMemberVipAndKey = (): boolean => {
  return (
    cacheGet('loginStatus') === LoginStatusEnum.Y &&
    cacheGet('userInfo').memberType === MemberTypeEnum.VIP &&
    isNotNull(cacheGet('translateServiceKey'))
  )
}

/**
 * 保存服务信息事件
 */
export const saveServiceInfoHandle = (
  serviceType: ServiceTypeEnum,
  isNew = NewStatusEnum.Y
): void => {
  if (!isMemberVipAndKey()) {
    return
  }
  let serviceMap: Iterable<unknown> | ArrayLike<unknown>
  if (serviceType === ServiceTypeEnum.TRANSLATE) {
    serviceMap = getTranslateServiceMap()
  } else if (serviceType === ServiceTypeEnum.OCR) {
    serviceMap = getOcrServiceMap()
  }
  saveServiceInfo({
    key: cacheGet('translateServiceKey'),
    serviceType: serviceType,
    info: JSON.stringify(Array.from(serviceMap)),
    isNew: isNew
  }).then(() => {
  })
}

export const loadNewServiceInfo = (): void => {
  if (!isMemberVipAndKey()) {
    return
  }
  const key = cacheGet('translateServiceKey')
  findNewByInfo({
    key: key
  }).then((data: any) => {
    let translateInfo = data?.translateInfo
    if (isNotNull(translateInfo)) {
      setTranslateServiceMap(new Map(JSON.parse(translateInfo.info)))
      // 更新翻译源通知
      window.api.updateTranslateServiceNotify()
    }
    let ocrInfo = data?.ocrInfo
    if (isNotNull(ocrInfo)) {
      setOcrServiceMap(new Map(JSON.parse(ocrInfo.info)))
    }
    const refreshServiceInfoNotifyFun = window.api['refreshServiceInfoNotify']
    if (isNotNull(refreshServiceInfoNotifyFun)) {
      refreshServiceInfoNotifyFun()
    }
  })
}
