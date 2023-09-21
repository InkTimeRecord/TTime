import StoreService from '../service/StoreService'
import { LoginStatusEnum } from '../../common/enums/LoginStatusEnum'
import { MemberTypeEnum } from '../../common/enums/MemberTypeEnum'

/**
 * 是否为会员
 */
const isMemberVip = (): boolean => {
  return (
    StoreService.configGet('loginStatus') === LoginStatusEnum.Y &&
    StoreService.configGet('userInfo').memberType === MemberTypeEnum.VIP
  )
}

/**
 * 是否为会员
 */
const isNotMemberVip = (): boolean => {
  return !isMemberVip()
}

export default {
  isMemberVip,
  isNotMemberVip
}
