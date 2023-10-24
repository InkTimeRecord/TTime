import ITranslateInterface from './ITranslateInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../../common/class/R'
import TranslateVo from '../../../../../common/class/TranslateVo'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import EcDictRequest from '../../interfaces/EcDictRequest'
import { isNull } from '../../../../../common/utils/validate'

class EcDictChannel implements ITranslateInterface {
  /**
   * 翻译
   *
   * @param info 翻译信息
   */
  async apiTranslate(info): Promise<void> {
    info.isTranslateCheckType = false
    EcDictRequest.apiTranslate(info)
      .then(async (res: any) => {
        log.info('[EcDict翻译事件] - 响应报文 : ', res)
        if (res.length <= 0) {
          GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okT('未找到词'))
          return
        }
        const data = res[0]

        // 匹配音标及语音
        // 匹配语法类别
        const vo = new TranslateVo([info.translateContent])
        vo.dictLessBuild(
          info,
          data['phonetic'],
          data['translation'].split('\n'),
          this.conversionWfs(data['exchange'])
        )
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okD(vo))
      })
      .catch((err) => {
        log.info('[EcDict翻译事件] - 异常 : ', err)
        GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, err))
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  apiTranslateCheck(_res): void {}

  conversionWfs(data): any {
    if (isNull(data)) {
      return null
    }
    const reference = {
      p: '过去式',
      d: '过去分词',
      i: '现在分词',
      3: '第三人称单数',
      r: '形容词比较级',
      t: '形容词最高级',
      s: '名词复数形式',
      0: 'Lemma',
      1: 'Lemma 的变换形式'
    }
    const dataArray = data.split('/')
    const wfs: any = []
    for (const item of dataArray) {
      const [code, value] = item.split(':')
      wfs.push({
        wf: {
          name: reference[code],
          value: value
        }
      })
    }
    return wfs
  }
}

export default EcDictChannel
