import log from '../../../../utils/log'
import R from '../../../../class/R'
import GlobalWin from '../../../GlobalWin'
import ITranslateInterface from './ITranslateInterface'
import TencentCloudRequest from '../../interfaces/TencentCloudRequest'
import TranslateServiceEnum from '../../../../enums/TranslateServiceEnum'
import { paramsFilter } from '../../../../utils/logExtend'

class TencentCloudChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[腾讯云翻译事件] - 请求报文 : ', paramsFilter(info))
    TencentCloudRequest.apiTranslate(info).then(
      (data) => {
        log.info('[腾讯云翻译事件] - 响应报文 : ', data)
        GlobalWin.mainWin.webContents.send(
          'tencentcloud-api-translate-callback-event',
          // @ts-ignore
          R.okT(data.TargetText.split('\\n'))
        )
      },
      (err) => {
        log.error('[腾讯云翻译事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('which exceeds the frequency limit') !== -1) {
          msg = '查询过于频繁 , 请重试'
        } else {
          msg = '未知错误 , 如重复出现 , 请联系开发者'
        }
        GlobalWin.mainWin.webContents.send('tencentcloud-api-translate-callback-event', R.okT(msg))
      }
    )
  }

  /**
   * 翻译校验
   *
   * @param info 翻译信息
   */
  apiTranslateCheck(info): void {
    log.info('[腾讯云翻译校验密钥事件] - 请求报文 : ', paramsFilter(info))
    // 响应信息
    const responseData = {
      id: info.id,
      appId: info.appId,
      appKey: info.appKey
    }
    TencentCloudRequest.apiTranslate(info).then(
      (data) => {
        log.info('[腾讯云翻译校验密钥事件] - 响应报文 : ', data)
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.TENCENT_CLOUD,
          R.okD(responseData)
        )
      },
      (err) => {
        log.error('[腾讯云翻译校验密钥事件] - 异常响应报文 : ', err)
        let msg = ''
        const errMessage = err.message
        if (errMessage.indexOf('reason: read ECONNRESET') !== -1) {
          msg = '验证超时，如重复出现，请检查网络后再试'
        } else if (errMessage.indexOf('The SecretId is not found') !== -1) {
          msg = '请输入正确的 SecretId 后再试'
        } else if (errMessage.indexOf('The provided credentials could not be validated') !== -1) {
          msg = '输入的密钥信息不匹配，请检查后再试'
        } else {
          msg = '未知错误 , 如重复出现 , 请联系开发者'
        }
        GlobalWin.setWin.webContents.send(
          'api-check-translate-callback-event',
          TranslateServiceEnum.TENCENT_CLOUD,
          R.errorMD(msg, responseData)
        )
      }
    )
  }
}

export default TencentCloudChannel
