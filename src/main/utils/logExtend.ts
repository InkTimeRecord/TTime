import { isNotNull } from '../../common/utils/validate'

export const paramsFilter = (obj) => {
  const newObj = JSON.parse(JSON.stringify(obj))
  newObj['appId'] = 'appId***'
  newObj['appKey'] = 'appKey***'
  newObj['img'] = 'img***'
  newObj['token'] = 'token***'
  return newObj
}

export const responseFilter = (obj, appId, appKey) => {
  let str = JSON.stringify(obj)
  if (isNotNull(appId)) {
    str = str.replaceAll(appId, 'appId***')
  }
  if (isNotNull(appKey)) {
    str = str.replaceAll(appKey, 'appKey***')
  }
  return JSON.parse(str)
}

export const responseFilterByCustomField = (obj, ...fields) => {
  const newObj = JSON.parse(JSON.stringify(obj))
  fields.map((field) => {
    if (isNotNull(field) && isNotNull(newObj[field])) {
      newObj[field] = '***'
    }
  })
  return newObj
}
