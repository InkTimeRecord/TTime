import TranslateVo from './TranslateVo'

/**
 * 响应信息
 */
class R {
  /**
   * 成功
   */
  static SUCCESS = 1

  /**
   * 失败
   */
  static ERROR = -1

  /**
   * 响应代码
   */
  code: number

  /**
   * 响应消息
   */
  msg: string

  /**
   * 数据
   */
  data: object

  constructor(code: number, msg: string, data: object) {
    this.code = code
    this.msg = msg
    this.data = data
  }

  static okC(code): R {
    return new R(code, '', {})
  }

  static okCT(code, data: string[] | string): R {
    if (typeof data === 'string') {
      data = [data]
    }
    return new R(code, '', data)
  }

  static okT(data: string[] | string): R {
    const type = Object.prototype.toString.call(data)
    if (type !== '[object Array]') {
      if (type === '[object Object]') {
        data = JSON.stringify(data)
      }
      // @ts-ignore 类型强转
      data = [data]
    }
    return new R(R.SUCCESS, '', new TranslateVo(data))
  }

  static okCIT(code, info, data: string[] | string): R {
    const type = Object.prototype.toString.call(data)
    if (type !== '[object Array]') {
      if (type === '[object Object]') {
        data = JSON.stringify(data)
      }
      // @ts-ignore 类型强转
      data = [data]
    } else if (typeof data === 'string') {
      data = [data]
    }
    const translateVo = new TranslateVo(data)
    translateVo.requestId = info.requestId
    translateVo.translateServiceId = info.id
    return new R(code, '', translateVo)
  }

  static okIT(info, data: string[] | string): R {
    return R.okCIT(R.SUCCESS, info, data)
  }

  static okD(data: object): R {
    return new R(R.SUCCESS, '', data)
  }

  static ok(): R {
    return new R(R.SUCCESS, '', {})
  }

  static error(msg): R {
    return new R(R.ERROR, msg, {})
  }

  static errorN(): R {
    return new R(R.ERROR, '', {})
  }

  static errorM(mes): R {
    return new R(R.ERROR, mes, {})
  }

  static errorD(data): R {
    return new R(R.ERROR, '', data)
  }

  static errorMD(mes, data): R {
    return new R(R.ERROR, mes, data)
  }
}

export default R
