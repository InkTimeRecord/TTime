import TTimeRequest from '../channel/interfaces/TTimeRequest'
import log from '../../utils/log'
import GlobalWin from '../GlobalWin'
import StoreService from '../StoreService'
import { LoginStatusEnum } from '../../../common/enums/LoginStatusEnum'
import { isNull } from '../../../common/utils/validate'

/**
 * 授权
 */
class TTimeAuth {

  /**
   * 登录
   */
  static login(token = null): void {
    if (isNull(token)) {
      token = StoreService.configGet('token')
      if (isNull(token)) {
        return
      }
    }
    // 设置显示我的页面
    StoreService.configSet('setPageMenuIndex', 'myInfo')
    StoreService.configSet('loginStatus', LoginStatusEnum.ING)
    // 强制显示设置窗口
    GlobalWin.forceShowSetWin()
    TTimeRequest.getUserInfo(token).then((res) => {
      if (res['status'] !== 200) {
        log.info('登录失败 - res : ', res)
        this.logout()
        return
      }
      StoreService.configSet('setPageMenuIndex', 'myInfo')
      StoreService.configSet('userInfo', res['data'])
      StoreService.configSet('token', token)
      StoreService.configSet('loginStatus', LoginStatusEnum.Y)
      // 强制显示设置窗口
      GlobalWin.forceShowSetWin()
      // 加载云配置
      StoreService.initCloudConfig()
      // 登录成功事件
      GlobalWin.setWin.webContents.send('login-success-event')
    })
  }

  /**
   * 刷新登录信息
   */
  static refresh(token = null): void {
    if (isNull(token)) {
      token = StoreService.configGet('token')
      if (isNull(token)) {
        return
      }
    }
    StoreService.configSet('loginStatus', LoginStatusEnum.ING)
    TTimeRequest.getUserInfo(token).then((res) => {
      if (res['status'] !== 200) {
        this.logout()
        return
      }
      StoreService.configSet('userInfo', res['data'])
      StoreService.configSet('token', token)
      StoreService.configSet('loginStatus', LoginStatusEnum.Y)
      // 加载云配置
      StoreService.initCloudConfig()
    })
  }

  /**
   * 退出登录
   */
  static logout(): void {
    log.info('[ 退出登录 ] - 开始')
    TTimeRequest.logout()
      .then((_res) => {
        StoreService.configSet('loginStatus', LoginStatusEnum.N)
        StoreService.configDeleteByKey('userInfo')
        StoreService.configDeleteByKey('token')
        log.info('[ 退出登录 ] - 成功 ')
        // 强制显示设置窗口
        GlobalWin.forceShowSetWin()
      })
      .catch((error) => {
        log.error('[ 退出登录 ] - 异常 ', error)
      })
  }
}

export default TTimeAuth
