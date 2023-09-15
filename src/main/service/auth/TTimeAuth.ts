import TTimeRequest from '../channel/interfaces/TTimeRequest'
import log from '../../utils/log'
import createSetWindow from '../Set'
import GlobalWin from '../GlobalWin'
import StoreService from '../StoreService'
import { isNull } from '../../../common/utils/validate'
import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'

/**
 * 授权
 */
class TTimeAuth {
  static token

  static login(token): void {
    if (isNull(GlobalWin.setWin)) {
      createSetWindow()
    }
    // 设置显示我的页面
    StoreService.configSet('setPageMenuIndex', 'myInfo')
    StoreService.configSet('loginStatus', LoginStatusEnum.ING)
    GlobalWin.winShow(GlobalWin.setWin)

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
