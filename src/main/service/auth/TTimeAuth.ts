import TTimeRequest from '../channel/interfaces/TTimeRequest'
import log from '../../utils/log'

/**
 * 授权
 */
class TTimeAuth {
  static token

  static login(token): void {
    log.info('开始验证token信息 token = ', token)
    TTimeRequest.getUserInfo(token)
      .then((res) => {
        log.info('用户信息 = ', res)
      })
      .catch((error) => {
        log.info('获取用户信息异常 = ', error)
      })
  }
}

export default TTimeAuth
