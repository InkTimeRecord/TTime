import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../../common/class/R'
import TranslateVo from '../../../../../common/class/TranslateVo'
import BingDictRequest from '../../interfaces/BingDictRequest'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'
import { isNull } from '../../../../../common/utils/validate'

class BingDictChannel extends TranslateAgent implements ITranslateAgentInterface {
  /**
   * 翻译
   *
   * 这里请求流程为 :
   * 1.浏览器环境调起翻译这里接收
   * 2.node环境中请求bing字典接口获取字典数据
   *    PS: 尝试通过浏览器环境进行请求时Bing字典接口时不知道为什么一直无法获取正确数据
   *        初步怀疑是Bing字典有跨域检测机制
   * 3.这里离把字典数据处理完毕后设置到请求报文信息中一同返回给浏览器环境
   * 4.浏览器环境中进行请求bing翻译请求 最后组合翻译和字典数据 再次回调给node环境
   *    PS: 这里也尝试过bing翻译请求放在node环境进行处理，但是发现node环境处理时在获取token那一步时 会时不时出现请求接口超时问题
   *        我通过多次ping域名测试发现请求token接口时偶尔会出现不一样的服务器IP
   *        而部分服务器IP是可以请求部分是无法请求，所以导致了这个问题
   *        但是通过浏览器请求时就没有这样的问题，怀疑是浏览器内部对超时机制有做检测处理
   * 5.node环境中校验后把结果返回给翻译页面
   *
   * @param info 翻译信息
   */
  async apiTranslate(info): Promise<void> {
    info.isTranslateCheckType = false
    BingDictRequest.apiTranslate(info)
      .then(async (res) => {
        // 字典响应报文太多 这里就不做日志输出了
        // log.info('[BingDict翻译事件] - 响应报文 : ', res)
        let match
        const explains: Array<string> = []
        // 匹配 其他释义字段信息 其他释义分化为了两段 下面一起匹配合并
        const explainOtherRegex =
          /<span class="pos">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
        const explainNetworkRegex =
          /<span class="pos web">(.*?)<\/span><span class="def b_regtxt"><span>(.*?)<\/span><\/span>/g
        while ((match = explainOtherRegex.exec(res)) !== null) {
          explains.push(
            (await BingDictChannel.handleDictField(match[1])) +
              ' ' +
              (await BingDictChannel.handleDictField(match[2]))
          )
        }
        while ((match = explainNetworkRegex.exec(res)) !== null) {
          explains.push(
            (await BingDictChannel.handleDictField(match[1])) +
              '. ' +
              (await BingDictChannel.handleDictField(match[2]))
          )
        }
        // 匹配音标及语音
        let phoneticAndSpeechRegex =
          /<div class="hd_prUS b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" href="javascript:void\(0\);" h="ID=Dictionary,(.*?)"><\/a><\/div><div class="hd_pr b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a class="bigaud" onmouseover="this.className='bigaud_f';javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)" onmouseout="this.className='bigaud'" title="点击朗读" onClick="javascript:BilingualDict.Click\(this,'(.*?)','akicon.png',false,'dictionaryvoiceid'\)"/g
        let usPhonetic = ''
        let ukPhonetic = ''
        let usSpeech = ''
        let ukSpeech = ''
        while ((match = phoneticAndSpeechRegex.exec(res)) !== null) {
          usPhonetic = await BingDictChannel.handleDictField(match[2])
          ukPhonetic = await BingDictChannel.handleDictField(match[7])
          usSpeech = await BingDictChannel.handleDictField(match[3])
          ukSpeech = await BingDictChannel.handleDictField(match[8])
        }

        // 匹配失败重新匹配
        if (isNull(usPhonetic) && isNull(ukPhonetic) && isNull(usSpeech) && isNull(ukSpeech)) {
          phoneticAndSpeechRegex =
            /<div class="hd_prUS b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a id="bigaud_us" data-mp3link="(.*?)" class="bigaud" title="点击朗读" href="javascript:void\(0\);" h="ID=Dictionary,(.*?)"><\/a><\/div><div class="hd_pr b_primtxt">(.*?)&#160;\[(.*?)\] <\/div><div class="hd_tf"><a id="bigaud_uk" class="bigaud" data-mp3link="(.*?)"/g
          usPhonetic = ''
          ukPhonetic = ''
          usSpeech = ''
          ukSpeech = ''
          while ((match = phoneticAndSpeechRegex.exec(res)) !== null) {
            usPhonetic = await BingDictChannel.handleDictField(match[2])
            ukPhonetic = await BingDictChannel.handleDictField(match[6])
            usSpeech = await BingDictChannel.handleDictField(match[3])
            ukSpeech = await BingDictChannel.handleDictField(match[7])
          }
        }

        // 匹配语法类别
        const wfs: Array<{ wf: { name: string; value: string } }> = []
        const wfsRegex =
          /<span class="b_primtxt">(.*?)<\/span><a class="p1-5" title="" href="(.*?)" h="ID=Dictionary,(.*?)">(.*?)<\/a>/g
        while ((match = wfsRegex.exec(res)) !== null) {
          wfs.push({
            wf: {
              name: await BingDictChannel.handleDictField(match[1]),
              value: await BingDictChannel.handleDictField(match[4])
            }
          })
        }
        // 构建响应给页面环境接口的数据
        info.dictResponse = {
          usPhonetic,
          ukPhonetic,
          usSpeech,
          ukSpeech,
          explains,
          wfs
        }
        // 这里内部处理Bing字典数据 PS: 尝试通过浏览器环境进行请求时Bing字典接口时不知道为什么一直无法获取正确数据
        // 初步怀疑是Bing字典有跨域检测机制
        GlobalWin.mainWinSend('agent-api-translate', info)
      })
      .catch((err) => {
        log.info('[BingDict翻译事件] - 异常 : ', err)
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, err))
      })
  }

  /**
   * 处理字典字段数据
   *
   * 因为字典中匹配出来的结果可能部分是附带了html元素或符号的转义
   * 所以这里需要再进行处理一遍值
   *
   * @param val 字段值
   * @return 处理后的val值
   */
  static async handleDictField(val): Promise<string> {
    val = val?.replace(/<\/?[^>]+(>|$)/g, '')
    await GlobalWin.mainWin.webContents
      .executeJavaScript(
        `var txt = document.createElement("textarea"); txt.innerHTML = "${val}";txt.value`
      )
      .then((valExtend) => {
        val = valExtend
      })
    return val
  }

  /**
   * 翻译
   *
   * @param res 信息
   */
  apiTranslateCallback(res: R): void {
    const dataObj = res.data
    const data = dataObj['response']
    const info = dataObj['request']
    log.info('[BingDict翻译事件] - 响应报文 : ', JSON.stringify(data))
    if (res.code === R.ERROR) {
      GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, data))
      return
    }
    const vo = new TranslateVo([data['text']])
    vo.dictBuild(
      info,
      data.usPhonetic,
      data.ukPhonetic,
      data.usSpeech,
      data.ukSpeech,
      data.explains,
      data.wfs
    )
    GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okD(vo))
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheckCallback(_res): void {}
}

export default BingDictChannel
