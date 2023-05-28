import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import { paramsFilter } from '../../../../utils/logExtend'
import BingDictRequest from '../../interfaces/BingDictRequest'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../class/R'
import TranslateVo from '../../../../class/TranslateVo'
import BingRequest from '../../interfaces/BingRequest'

class BingDictChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  apiTranslate(info): void {
    log.info('[BingDict翻译事件] - 请求报文 : ', paramsFilter(info))
    BingRequest.getToken().then(token => {
      log.info('[Bing获取Token事件] - 响应报文 : ', token)
      info.token = token
      BingRequest.apiTranslate(info).then((bingRes) => {
        log.info('[Bing翻译事件] - 响应报文 : ', JSON.stringify(bingRes))
        BingDictRequest.apiTranslate(info).then((res) => {
          // log.info('[BingDict翻译事件] - 响应报文 : ', res)
          if (res.indexOf('没有找到与') != -1) {
            return
          }
          let match
          let explains: Array<string> = []
          // 匹配 其他释义字段信息 其他释义分化为了两段 下面一起匹配合并
          let explainOtherRegex = /<span class="pos">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
          let explainNetworkRegex = /<span class="pos web">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
          while ((match = explainOtherRegex.exec(res)) !== null) {
            explains.push(match[1] + ' ' + match[2])
          }
          while ((match = explainNetworkRegex.exec(res)) !== null) {
            explains.push(match[1] + '. ' + match[2])
          }
          // 匹配音标及语音
          const phoneticAndSpeechRegex = /<div class="hd_prUS b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" href="javascript:void\(0\);" h="ID=Dictionary,(.*?)"><\/a><\/div><div class="hd_pr b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)"/g
          let usPhonetic = ''
          let ukPhonetic = ''
          let usSpeech = ''
          let ukSpeech = ''
          while ((match = phoneticAndSpeechRegex.exec(res)) !== null) {
            usPhonetic = match[2]
            ukPhonetic = match[7]
            usSpeech = match[3]
            ukSpeech = match[8]
          }
          // 匹配语法类别
          let wfs: Array<{ wf: { name: string, value: string } }> = []
          let wfsRegex = /<span class="b_primtxt">(.*?)<\/span><a class="p1-5" title="" href="(.*?)" h="ID=Dictionary,(.*?)">(.*?)<\/a>/g
          while ((match = wfsRegex.exec(res)) !== null) {
            wfs.push({ wf: { name: match[1], value: match[4] } })
          }
          const vo = new TranslateVo([bingRes[0]['translations'][0]['text']])
          vo.dictBuild(
            usPhonetic,
            ukPhonetic,
            usSpeech,
            ukSpeech,
            explains,
            wfs
          )
          GlobalWin.mainWin.webContents.send('bingdict-api-translate-callback-event', R.okD(vo))
        }).catch((err) => {
          log.info('[Bing翻译事件] - 错误 : ', err.response.data)
          GlobalWin.mainWin.webContents.send('bing-api-translate-callback-event', R.okT(err.response.data.error.message))
        })
      }).catch((error) => {
        log.info('[BingDict翻译事件] - 错误 : ', error)
        GlobalWin.mainWin.webContents.send('bingdict-api-translate-callback-event', R.okT(error))
      })
    })
  }

  apiTranslateCheck(_info): void {
  }

}

export default BingDictChannel
