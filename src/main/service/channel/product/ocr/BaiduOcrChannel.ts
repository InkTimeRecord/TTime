import log from '../../../../utils/log'
import { paramsFilter, responseFilterByCustomField } from '../../../../utils/logExtend'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import IOcrInterface from './IOcrInterface'
import BaiduRequest from '../../interfaces/BaiduRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { isNotNull, isNull } from '../../../../utils/validate'
import WebShowMsgEnum from '../../../../enums/WebShowMsgEnum'
import { commonError } from '../../../../utils/RequestUtil'

class BaiduOcrChannel implements IOcrInterface {
  /**
   * 授权token
   */
  static token = ''

  /**
   * 授权token错误消息
   */
  static tokenErrMsg = ''

  /**
   * 注入token
   *
   * @param info         请求信息
   * @param isForceGet   是否强制获取token (不强制的情况下，会只读取应用生命周期内的 BaiduOcrChannel.token )
   */
  async injectionToken(info, isForceGet) {
    BaiduOcrChannel.tokenErrMsg = ''
    if (isForceGet || isNull(BaiduOcrChannel.token)) {
      // 获取前先置空token
      BaiduOcrChannel.token = ''
      log.info('[百度Ocr获取Token事件] - 请求报文 : ', paramsFilter(info))
      await BaiduRequest.apiOcrGetToken(info)
        .then((res) => {
          log.info(
            '[百度Ocr获取Token事件] - 响应报文 : ',
            responseFilterByCustomField(
              res,
              'refresh_token',
              'session_key',
              'access_token',
              'session_secret'
            )
          )
          BaiduOcrChannel.token = res['access_token']
        })
        .catch((error) => {
          const res = commonError('百度Ocr获取Token', error)
          log.info('[百度Ocr获取Token事件] - 响应异常 : ', res)
          const errorMsg = res['error_description']
          if ('unknown client id'.indexOf(errorMsg) != -1) {
            BaiduOcrChannel.tokenErrMsg = 'API Key不存在，请检查后再试'
          } else if ('Client authentication failed'.indexOf(errorMsg) != -1) {
            BaiduOcrChannel.tokenErrMsg = '身份验证失败，请检查密钥填写是否正确'
          }
        })
    }
  }

  /**
   * OCR
   *
   * @param info OCR信息
   */
  async apiOcr(info): Promise<void> {
    await this.injectionToken(info, false)
    if (isNull(BaiduOcrChannel.token)) {
      log.info('[百度Ocr事件] - 获取Token失败 :', BaiduOcrChannel.tokenErrMsg)
      GlobalWin.mainWinSend('show-msg-event', WebShowMsgEnum.ERROR, BaiduOcrChannel.tokenErrMsg)
      GlobalWin.mainWinSend('update-translated-content', '')
      return
    }
    info.token = BaiduOcrChannel.token
    log.info('[百度Ocr事件] - 请求报文 : ', paramsFilter(info))
    BaiduRequest.apiOcr(info)
      .then((res) => {
        log.info('[百度Ocr事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        if (isNotNull(errorCode)) {
          let errorMsg = this.getMsgByErrorCode(errorCode)
          errorMsg = isNull(errorMsg) ? res['error_msg'] : errorMsg
          GlobalWin.mainWinSend('show-msg-event', WebShowMsgEnum.ERROR, errorMsg)
          GlobalWin.mainWinSend('update-translated-content', '')
          return
        }
        let data = ''
        const textList = res['words_result']
        textList.forEach((text) => {
          data += text['words'] + '\n'
        })
        GlobalWin.mainWinSend('update-translated-content', data)
      })
      .catch((_err) => {})
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  async apiOcrCheck(info): Promise<void> {
    await this.injectionToken(info, true)
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    if (isNull(BaiduOcrChannel.token)) {
      log.info('[百度Ocr校验密钥事件] - 获取Token失败 :', BaiduOcrChannel.tokenErrMsg)
      GlobalWin.setWin.webContents.send(
        'api-check-ocr-callback-event',
        TranslateServiceEnum.BAIDU,
        R.errorMD(BaiduOcrChannel.tokenErrMsg, responseData)
      )
      return
    }
    info.token = BaiduOcrChannel.token
    log.info('[百度Ocr校验密钥事件] - 请求报文 : ', paramsFilter(info))
    BaiduRequest.apiOcr(info).then(
      (res) => {
        log.info('[百度Ocr校验密钥事件] - 响应报文 : ', res)
        const errorCode = res['error_code']
        if (isNotNull(errorCode)) {
          let errorMsg = this.getMsgByErrorCode(errorCode)
          errorMsg = isNull(errorMsg) ? res['error_msg'] : errorMsg
          GlobalWin.setWin.webContents.send(
            'api-check-ocr-callback-event',
            TranslateServiceEnum.BAIDU,
            R.errorMD(errorMsg, responseData)
          )
          return
        }
        GlobalWin.setWin.webContents.send(
          'api-check-ocr-callback-event',
          TranslateServiceEnum.BAIDU,
          R.okD(responseData)
        )
      },
      (_err) => {}
    )
  }

  /**
   * 按错误代码获取消息
   *
   * @param errorCode 错误码
   */
  getMsgByErrorCode(errorCode): string {
    errorCode += ''
    let msg = ''
    if (errorCode === '6') {
      msg = '无权限访问调用，请检查创建应用时是否勾选相关接口'
    } else if (errorCode === '13') {
      msg = '授权失败，请重启应用后再试，如重复出现，请联系作者排查'
    } else if (errorCode === '15') {
      msg = '应用不存在或者创建失败'
    } else if (errorCode === '17') {
      msg = '每天请求量超限额'
    } else if (errorCode === '18') {
      msg = '调用频率受限 , 请降低调用频率'
    } else if (errorCode === '19') {
      msg = '当月调用总量超限额'
    } else if (errorCode === '100' || errorCode === '110' || errorCode === '111') {
      msg = '授权过期，请重启应用后再试，如重复出现，请联系作者排查'
    } else if (errorCode === '216110') {
      msg = 'appid不存在，请重新核对信息是否为后台应用列表中的appid'
    } else if (errorCode === '216200') {
      msg = '图片为空，请检查后重新尝试'
    } else if (errorCode === '216201') {
      msg = '识别的图片格式错误，支持的图片格式为：PNG、JPG、JPEG、BMP'
    } else if (errorCode === '336001') {
      msg = '入参格式有误，请重试，如重复出现，请联系作者排查'
    }
    return msg
  }
}

export default BaiduOcrChannel
