import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import YouDaoRequest from '../../interfaces/YouDaoRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import TranslateVo from '../../../../class/TranslateVo'

class TranSmartChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[有道翻译事件] - 请求报文 : ', paramsFilter(info))
    YouDaoRequest.apiTranslate(info)
      .then((res) => {
        // log.info('[有道翻译事件] - 响应报文 : ', JSON.stringify(res))
        log.info('[有道翻译事件] - 响应报文 : ', res)
        const errorCode = res['errorCode']
        if (errorCode === '0') {
          const vo = new TranslateVo(res['translation'])
          const basic = res['basic']
          if (null != basic) {
            vo.dictBuild(
              basic['us-phonetic'],
              basic['uk-phonetic'],
              basic['us-speech'],
              basic['uk-speech'],
              basic['explains'],
              basic['wfs']
            )
          }
          GlobalWin.mainWinSend('youdao-api-translate-callback-event', R.okD(vo))
        } else {
          GlobalWin.mainWinSend(
            'youdao-api-translate-callback-event',
            R.okT(this.getMsgByErrorCode(errorCode))
          )
        }
      })
      .catch((error) => {
        GlobalWin.mainWinSend('youdao-api-translate-callback-event', R.okT(error))
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[有道翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    YouDaoRequest.apiTranslate(info).then(
      (res) => {
        log.info('[有道翻译校验密钥事件] - 响应报文 : ', res)
        const errorCode = res['errorCode']
        if (errorCode === '0') {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.YOU_DAO,
            R.okD(responseData)
          )
          return
        }
        const msg = this.getMsgByErrorCode(errorCode)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.YOU_DAO,
          R.errorMD(msg, responseData)
        )
      },
      (err) => {
        log.error('[有道翻译校验密钥事件] - 异常响应报文 : ', err)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.YOU_DAO,
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
    if (errorCode === '101') {
      msg = '缺少必填的参数,首先确保必填参数齐全，然后确认参数书写是否正确'
    } else if (errorCode === '102') {
      msg = '不支持的语言类型'
    } else if (errorCode === '103') {
      msg = '翻译文本过长'
    } else if (errorCode === '108') {
      msg = '应用ID无效，注册账号，登录后台创建应用并完成绑定，可获得应用ID和应用密钥等信息'
    } else if (errorCode === '110') {
      msg = '无相关服务的有效应用,应用没有绑定服务应用，可以新建服务应用'
    } else if (errorCode === '111') {
      msg = '开发者账号无效'
    } else if (errorCode === '112') {
      msg = '请求服务无效'
    } else if (errorCode === '203') {
      msg = '访问IP地址不在可访问IP列表'
    } else if (errorCode === '401') {
      msg = '账户已经欠费，请进行账户充值'
    } else if (errorCode === '411') {
      msg = '访问频率受限,请稍后访问'
    } else if (errorCode === '412') {
      msg = '长请求过于频繁，请稍后访问'
    } else if (errorCode === '90107') {
      msg = '认证未通过或未生效 , 请前往我的认证查看认证进度 '
    }
    return msg
  }
}

export default TranSmartChannel
