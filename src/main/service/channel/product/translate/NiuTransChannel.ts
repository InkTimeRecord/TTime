import log from '../../../../utils/log'
import R from '../../../../../common/class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import NiuTransRequest from '../../interfaces/NiuTransRequest'
import TranslateServiceEnum from '../../../../../common/enums/TranslateServiceEnum'
import { isNotNull } from '../../../../../common/utils/validate'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'

class NiuTransChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    const key = TranslateChannelFactory.callbackName(info.type)
    NiuTransRequest.apiTranslate(info)
      .then((res) => {
        log.info('[小牛翻译事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        if (isNotNull(errorCode)) {
          GlobalWin.mainWinSend(key, R.okT(this.getMsgByErrorCode(res)))
          return
        }
        GlobalWin.mainWinSend(key, R.okT(res['tgt_text']?.split('\\n')))
      })
      .catch((error) => {
        GlobalWin.mainWinSend(key, R.okT(error))
      })
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    NiuTransRequest.apiTranslate(info).then(
      (res) => {
        log.info('[小牛翻译校验密钥事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        if (isNotNull(errorCode)) {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.NIU_TRANS,
            R.errorMD(this.getMsgByErrorCode(res), responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.NIU_TRANS,
          R.okD(responseData)
        )
      },
      (err) => {
        log.error('[小牛翻译校验密钥事件] - 异常响应报文 : ', err)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.NIU_TRANS,
          R.errorD(responseData)
        )
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param res 错误信息
   */
  getMsgByErrorCode(res): string {
    const errorCode = res['error_code']
    let msg = res['error_msg']
    if (errorCode === '10001') {
      msg = '请求频繁，超出QPS限制'
    } else if (errorCode === '10003') {
      msg = '请求字符串长度超过限制'
    } else if (errorCode === '10005') {
      msg = '源语编码有问题，非UTF-8'
    } else if (errorCode === '13001') {
      msg = '字符流量不足或者没有访问权限'
    } else if (errorCode === '13002') {
      msg = '秘钥错误或不能为空'
    } else if (errorCode === '13003') {
      msg = '内容过滤异常'
    } else if (errorCode === '13007') {
      msg = '语言不支持'
    } else if (errorCode === '13008') {
      msg = '请求处理超时'
    } else if (errorCode === '14001') {
      msg = '分句异常'
    } else if (errorCode === '14002') {
      msg = '分词异常'
    } else if (errorCode === '14003') {
      msg = '后处理异常'
    } else if (errorCode === '14004') {
      msg = '对齐失败，不能够返回正确的对应关系 '
    } else if (errorCode === '000000') {
      msg = '请求参数有误，请检查参数 '
    } else if (errorCode === '000001') {
      msg = 'Content-Type不支持【multipart/form-data】'
    }
    return msg
  }
}

export default NiuTransChannel
