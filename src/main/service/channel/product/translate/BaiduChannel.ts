import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import BaiduRequest from '../../interfaces/BaiduRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { isNotNull, isNull } from '../../../../utils/validate'

class BaiduChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[百度翻译事件] - 请求报文 : ', paramsFilter(info))
    BaiduRequest.apiTranslate(info)
      .then((res) => {
        log.info('[百度翻译事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        let data
        if (isNotNull(errorCode)) {
          data = this.getMsgByErrorCode(errorCode)
        } else {
          data = []
          const transResultList = res['trans_result']
          transResultList.forEach((transResult) => {
            data.push(transResult['dst'])
          })
        }
        GlobalWin.mainWin.webContents.send('baidu-api-translate-callback-event', R.okT(data))
      })
      .catch((error) => {
        GlobalWin.mainWin.webContents.send('baidu-api-translate-callback-event', R.okT(error))
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[百度翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    BaiduRequest.apiTranslate(info).then(
      (res) => {
        log.info('[百度翻译校验密钥事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        if (isNull(errorCode)) {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.BAIDU,
            R.okD(responseData)
          )
          return
        }
        const msg = this.getMsgByErrorCode(errorCode)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.BAIDU,
          R.errorMD(msg, responseData)
        )
      },
      (err) => {
        log.error('[百度翻译校验密钥事件] - 异常响应报文 : ', err)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.BAIDU,
          R.errorD(responseData)
        )
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorCode 错误码
   */
  getMsgByErrorCode(errorCode): string {
    let msg = ''
    if (errorCode === '52001') {
      msg = '请求超时 , 请重试'
    } else if (errorCode === '52002') {
      msg = '系统错误 , 请重试'
    } else if (errorCode === '52003') {
      msg = '未授权用户 , 请检查 AppId 是否正确或者服务是否开通'
    } else if (errorCode === '54000') {
      msg = '必填参数为空 , 请检查是否少传参数'
    } else if (errorCode === '54001') {
      msg = '签名错误或为未授权用户 , 请检查 AppId 或 SecretKey 是否正确'
    } else if (errorCode === '54003') {
      msg = '查询频率受限 , 请降低查询频率 , 或进行身份认证后切换为高级版/尊享版'
    } else if (errorCode === '54004') {
      msg = '账户余额不足 , 请前往管理控制台为账户充值'
    } else if (errorCode === '54005') {
      msg = '长query请求频繁 , 请降低长query的发送频率，3s后再试 '
    } else if (errorCode === '58000') {
      msg = '客户端IP非法 , 检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改'
    } else if (errorCode === '58001') {
      msg = '译文语言方向不支持 , 检查译文语言是否在语言列表里'
    } else if (errorCode === '58002') {
      msg = '服务当前已关闭 , 请前往管理控制台开启服务'
    } else if (errorCode === '90107') {
      msg = '认证未通过或未生效 , 请前往我的认证查看认证进度'
    }
    return msg
  }
}

export default BaiduChannel
