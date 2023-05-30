import log from '../../../../utils/log'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import AliyunRequest from '../../interfaces/AliyunRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { paramsFilter } from '../../../../utils/logExtend'

class AliyunChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[阿里云翻译事件] - 请求报文 : ', paramsFilter(info))
    AliyunRequest.apiTranslate(info).then(
      (response) => {
        const body = response.body
        log.info('[阿里云翻译事件] - 响应报文 : ', body)
        const code = body.code
        let data = ''
        if (code === 200) {
          // @ts-ignore
          data = body.data.translated.split('\\n')
        } else {
          data = this.getMsgByErrorCode(code, body.message)
        }
        GlobalWin.mainWin.webContents.send('aliyun-api-translate-callback-event', R.okT(data))
      },
      (err) => {
        log.error('[阿里云翻译事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('which exceeds the frequency limit') !== -1) {
          msg = '查询过于频繁 , 请重试'
        } else if (errMessage.indexOf('Specified access key is disabled') !== -1) {
          msg = '当前使用的密钥被禁用 , 请检查后再试'
        } else {
          msg = '未知错误 , 如重复出现 , 请联系开发者'
        }
        GlobalWin.mainWin.webContents.send('aliyun-api-translate-callback-event', R.okT(msg))
      }
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[阿里云翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    AliyunRequest.apiTranslate(info).then(
      (response) => {
        const body = response.body
        log.info('[阿里云翻译校验密钥事件] - 响应报文 : ', response)
        const code = body.code
        if (code === 200) {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.ALIYUN,
            R.okD(responseData)
          )
        } else {
          GlobalWin.setWin.webContents.send(
            'api-check-translate-callback-event',
            TranslateServiceEnum.ALIYUN,
            R.errorMD(this.getMsgByErrorCode(code, body.message), responseData)
          )
        }
      },
      (err) => {
        log.error('[阿里云翻译校验密钥事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('Specified access key is not found') !== -1) {
          msg = '请输入正确的 KeyId 后再试'
        } else if (errMessage.indexOf('Specified signature is not matched') !== -1) {
          msg = '输入的密钥信息不匹配，请检查后再试'
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.ALIYUN,
          R.errorMD(msg, responseData)
        )
      }
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorCode    错误码
   * @param errorMessage 错误消息
   */
  getMsgByErrorCode(errorCode, errorMessage): string {
    let msg = ''
    if (errorCode === 10002) {
      msg = '系统错误 , 请重试'
    } else if (errorCode === 10005) {
      msg = '不支持翻译此语言'
    } else if (errorCode === 10009) {
      msg = '子账号没有权限 , 请检查密钥是否正确或者服务是否开通'
    } else if (errorCode === 10010) {
      msg = '账号没有开通服务 , 请检查密钥是否正确或者服务是否开通'
    } else if (errorCode === 10011) {
      msg = '子账号服务失败 , 请重试'
    } else if (errorCode === 10012) {
      msg = '翻译服务调用失败 , 请重试'
    } else if (errorCode === 10013) {
      msg = '账号服务没有开通或者欠费'
    } else if (errorCode === 10028) {
      msg = '查询频率受限 , 请降低查询频率'
    } else if (errorCode === 10029) {
      msg = '您今日的调用已超过额度，请明日再调用'
    } else if (errorCode === 'InvalidAccountStatus') {
      msg = '当前配置的密钥未开通机器翻译服务'
    } else if (errorCode === 'InvalidAccountStatus.ServiceUnavailable') {
      msg = '当前配置的密钥没有开通服务'
    } else if (errorCode === 'System.LanguageDetectError') {
      msg = '语种识别错误'
    } else {
      msg = errorMessage
    }
    return msg
  }
}

export default AliyunChannel
