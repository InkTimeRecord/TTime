import HttpMethodType from '../../../enums/HttpMethodTypeClassEnum'
import { AxiosPromise } from 'axios'
import request from '../../../utils/request'
import crypto from 'crypto'

/**
 * OCR
 *
 * @param info OCR信息
 */
const apiOcr = (info): AxiosPromise => {
  const host = 'api.xf-yun.com'
  const date = new Date().toUTCString()
  const authorization = generateAuthorization(info.appKey, info.appSecret, host, date)
  const url = `/v1/private/sf8e6aca1?authorization=${authorization}&host=${host}&date=${encodeURIComponent(
    date
  )}`
  return request({
    baseURL: 'https://api.xf-yun.com',
    url: url,
    method: HttpMethodType.POST,
    headers: {
      'content-type': 'application/json'
    },
    data: {
      header: {
        app_id: info.appId,
        status: 3
      },
      parameter: {
        sf8e6aca1: {
          category: 'ch_en_public_cloud',
          result: {
            encoding: 'utf8',
            compress: 'raw',
            format: 'json'
          }
        }
      },
      payload: {
        sf8e6aca1_data_1: {
          image: info.img.replace('data:image/png;base64,', '')
        }
      }
    }
  })
}

/**
 * 生成授权
 */
const generateAuthorization = (apiKey, apiSecret, host, date): string => {
  const signatureOrigin = `host: ${host}\ndate: ${date}\nPOST /v1/private/sf8e6aca1 HTTP/1.1`
  const hmac = crypto.createHmac('sha256', apiSecret)
  hmac.update(signatureOrigin)
  const signature = hmac.digest().toString('base64')
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  return Buffer.from(authorizationOrigin).toString('base64')
}

export default {
  apiOcr
}
