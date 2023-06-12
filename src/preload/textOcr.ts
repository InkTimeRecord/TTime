import path from 'path'
import { electronAPI } from '@electron-toolkit/preload'
import { EnvEnum } from '../main/enums/EnvEnum'

const cv = require('opencv.js')
const ort = require('onnxruntime-node')
const fs = require('fs')
const WordsNinjaPack = require('wordsninja')
const WordsNinja = new WordsNinjaPack()

const ipcRenderer = electronAPI.ipcRenderer
ipcRenderer.on('local-ocr', async (_event, imgByBase64) => {
  localOcrFun(imgByBase64, (_err, text) => {
    ipcRenderer.invoke('text-ocr-event', text)
  })
})
async function localOcrFun(imgByBase64, callback): Promise<void> {
  // 默认模型路径
  let ocrPath
  if (EnvEnum.isPro()) {
    ocrPath = path.join(__dirname, '../../../app.asar.unpacked/ocr/')
  } else {
    ocrPath = path.join(__dirname, '../../ocr/')
  }
  const detPath = path.join(ocrPath, 'ocr_det.onnx'),
    recPath = path.join(ocrPath, 'ocr_rec.onnx'),
    dictPath = path.join(ocrPath, 'ocr_keys_v1.txt')
  // 初始化
  await init(detPath, recPath, dictPath)
  const img = document.createElement('img')
  img.src = imgByBase64
  img.onload = async (): Promise<void> => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')
    if (null == context) {
      return
    }
    context.drawImage(img, 0, 0)
    ocr(context.getImageData(0, 0, img.width, img.height))
      .then((text) => {
        callback(null, text)
      })
      .catch((e) => {
        callback(e, null)
      })
  }
}

let det, rec, dict
const limitSideLen = 960,
  imgH = 48
let imgW = 320

/**
 * 初始化
 *
 * @param detPath 检测器模型路径
 * @param recPath 识别器模型路径
 * @param dicPath 字典路径
 */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function init(detPath, recPath, dicPath) {
  // 检测器
  det = await ort.InferenceSession.create(detPath)
  // 识别器
  rec = await ort.InferenceSession.create(recPath)
  // 字典路径
  dict = fs.readFileSync(dicPath).toString().split('\n')
  await WordsNinja.loadDictionary()
}

/**
 * 主要操作
 * @param {ImageData} img 识别的图片
 */
async function ocr(img): Promise<string> {
  const imaHeight = img.height,
    imgWidth = img.width
  // 识别数据
  let transposedData
  // 图片
  let image
  let canvas
    // 检测前
    // @ts-ignore 忽略校验
    // eslint-disable-next-line prefer-const
  ;({ transposedData, image, canvas } = testBefore(imaHeight, imgWidth, img))
  // 检测
  const detResults = await test(transposedData, image, det)
  // 检测后
  // @ts-ignore 忽略校验
  const box = testAfter(detResults.data, detResults.dims[3], detResults.dims[2], canvas)
  let mainLine = []
  // 识别前
  for (const i of identifyBefore(box)) {
    const { b, imgH, imgW } = i
    // 识别
    const recResults = await identify(b, imgH, imgW, rec)
    // 识别后
    const line = identifyAfter(recResults, dict)
    mainLine = line.concat(mainLine)
  }
  let returnText = ''
  for (const info of mainLine) {
    // @ts-ignore 忽略校验
    returnText += info.text + '\n'
  }
  // @ts-ignore 忽略校验
  return returnText
}

function testBefore(imaHeight, imgWidth, img): object {
  let ratio = 1
  if (Math.max(imaHeight, imgWidth) > limitSideLen) {
    if (imaHeight > imgWidth) {
      ratio = limitSideLen / imaHeight
    } else {
      ratio = limitSideLen / imgWidth
    }
  }
  let resizeHeight = imaHeight * ratio
  let resizeWidth = imgWidth * ratio

  resizeHeight = Math.max(Math.round(resizeHeight / 32) * 32, 32)
  resizeWidth = Math.max(Math.round(resizeWidth / 32) * 32, 32)
  img = resize_img(img, resizeWidth, resizeHeight)
  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = resizeWidth
  srcCanvas.height = resizeHeight
  const id = new ImageData(img.width, img.height)
  for (const i in id.data) id.data[i] = img.data[i]
  // @ts-ignore 忽略校验
  srcCanvas.getContext('2d').putImageData(id, 0, 0)
  const transposedData = toPaddleInput(img, [0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
  return { transposedData, image: img, canvas: srcCanvas }
}

async function test(transposedData, image, det): Promise<[]> {
  const detData = Float32Array.from(transposedData.flat(Infinity))
  const det_tensor = new ort.Tensor('float32', detData, [1, 3, image.height, image.width])
  const det_feed = {}
  det_feed[det.inputNames[0]] = det_tensor
  const det_results = await det.run(det_feed)
  return det_results[det.outputNames[0]]
}

async function identify(b, imgH, imgW, rec): Promise<[]> {
  const rec_data = Float32Array.from(b.flat(Infinity))

  const rec_tensor = new ort.Tensor('float32', rec_data, [b.length, 3, imgH, imgW])
  const rec_feed = {}
  rec_feed[rec.inputNames[0]] = rec_tensor

  const rec_results = await rec.run(rec_feed)
  return rec_results[rec.outputNames[0]]
}

/**
 *
 * @param {ImageData} data 原图
 * @param {number} w 输出宽
 * @param {number} h 输出高
 */
function resize_img(data, w, h): ImageData {
  const x = document.createElement('canvas')
  x.width = data.width
  x.height = data.height
  // @ts-ignore 忽略校验
  x.getContext('2d').putImageData(data, 0, 0)
  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const srcContext = src.getContext('2d')
  if (null === srcContext) {
    // @ts-ignore 忽略校验
    return null
  }
  srcContext.scale(w / data.width, h / data.height)
  srcContext.drawImage(x, 0, 0)
  return srcContext.getImageData(0, 0, w, h)
}

function testAfter(data: [number], w, h, src_canvas): [] {
  const canvas = document.createElement('canvas')

  const myImageData = new ImageData(w, h)
  for (const i in data) {
    // @ts-ignore 忽略校验
    const n = i * 4
    myImageData.data[n] = myImageData.data[n + 1] = myImageData.data[n + 2] = data[i] * 255
    myImageData.data[n + 3] = 255
  }
  canvas.width = w
  canvas.height = h
  // @ts-ignore 忽略校验
  canvas.getContext('2d').putImageData(myImageData, 0, 0)
  const edge_rect = []
  let src = cv.imread(canvas)
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0)
  cv.threshold(src, src, 120, 200, cv.THRESH_BINARY)
  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()
  cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i)
    const bbox = cv.boundingRect(cnt)
    // TODO minAreaRect
    const box = [
      [bbox.x, bbox.y],
      [bbox.x + bbox.width, bbox.y],
      [bbox.x + bbox.width, bbox.y + bbox.height],
      [bbox.x, bbox.y + bbox.height]
    ]
    const min_size = 3
    if (Math.min(bbox.width, bbox.height) >= min_size) {
      const c = document.createElement('canvas')
      const dx = bbox.width * 0.1,
        dy = bbox.height * 1.2
      c.width = bbox.width + dx * 2
      c.height = bbox.height + dy * 2
      const ctx = c.getContext('2d')
      // @ts-ignore 忽略校验
      ctx.drawImage(src_canvas, -bbox.x + dx, -bbox.y + dy)
      // @ts-ignore 忽略校验
      edge_rect.push({ box, img: c.getContext('2d').getImageData(0, 0, c.width, c.height) })
    }
  }
  src.delete()
  contours.delete()
  hierarchy.delete()
  src = contours = hierarchy = null
  // @ts-ignore 忽略校验
  return edge_rect
}

function toPaddleInput(image, mean, std): [[], [], []] {
  const imageData = image.data
  const [redArray, greenArray, blueArray] = [[], [], []]
  let x = 0,
    y = 0
  for (let i = 0; i < imageData.length; i += 4) {
    if (!blueArray[y]) {
      // @ts-ignore 忽略校验
      blueArray[y] = []
    }
    if (!greenArray[y]) {
      // @ts-ignore 忽略校验
      greenArray[y] = []
    }
    if (!redArray[y]) {
      // @ts-ignore 忽略校验
      redArray[y] = []
    }
    // @ts-ignore 忽略校验
    redArray[y][x] = (imageData[i] / 255 - mean[0]) / std[0]
    // @ts-ignore 忽略校验
    greenArray[y][x] = (imageData[i + 1] / 255 - mean[1]) / std[1]
    // @ts-ignore 忽略校验
    blueArray[y][x] = (imageData[i + 2] / 255 - mean[2]) / std[2]
    x++
    if (x === image.width) {
      x = 0
      y++
    }
  }
  // @ts-ignore 忽略校验
  return [blueArray, greenArray, redArray]
}

function identifyBefore(box): [] {
  const l = []

  /**
   *
   * @param {ImageData} img
   */
  function resizeNormImg(img): ImageData {
    imgW = Math.floor(imgH * max_wh_ratio)
    const h = img.height,
      w = img.width
    const ratio = w / h
    let resized_w
    if (Math.ceil(imgH * ratio) > imgW) {
      resized_w = imgW
    } else {
      resized_w = Math.floor(Math.ceil(imgH * ratio))
    }
    const d = resize_img(img, resized_w, imgH)
    const cc = document.createElement('canvas')
    cc.width = imgW
    cc.height = imgH
    const context = cc.getContext('2d')
    if (null === context) {
      // @ts-ignore 忽略校验
      return null
    }
    context.putImageData(d, 0, 0)
    return context.getImageData(0, 0, imgW, imgH)
  }

  const boxes = []
  let now_width = 0
  for (const i of box) {
    if (Math.abs(i.img.width - now_width) > 32) {
      now_width = i.img.width
      // @ts-ignore 忽略校验
      boxes.push([i])
    } else {
      // @ts-ignore 忽略校验
      if (!boxes[boxes.length - 1]) boxes.push([])
      // @ts-ignore 忽略校验
      boxes[boxes.length - 1].push(i)
    }
  }
  let max_wh_ratio = 0
  for (const box of boxes) {
    max_wh_ratio = 0
    // @ts-ignore 忽略校验
    for (const r of box) {
      max_wh_ratio = Math.max(r.img.width / r.img.height, max_wh_ratio)
    }
    const b = []
    // @ts-ignore 忽略校验
    for (const r of box) {
      // @ts-ignore 忽略校验
      b.push(toPaddleInput(resizeNormImg(r.img), [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]))
    }
    // @ts-ignore 忽略校验
    l.push({ b, imgH, imgW })
  }
  // @ts-ignore 忽略校验
  return l
}

function identifyAfter(data, character): [] {
  const pred_len = data.dims[2]
  const line = []
  let ml = data.dims[0] - 1
  for (let l = 0; l < data.data.length; l += pred_len * data.dims[1]) {
    const preds_idx = []
    const preds_prob = []

    for (let i = l; i < l + pred_len * data.dims[1]; i += pred_len) {
      const tmpArr = data.data.slice(i, i + pred_len - 1)
      const tmpMax = Math.max(...tmpArr)
      const tmpIdx = tmpArr.indexOf(tmpMax)
      // @ts-ignore 忽略校验
      preds_prob.push(tmpMax)
      // @ts-ignore 忽略校验
      preds_idx.push(tmpIdx)
    }
    // @ts-ignore 忽略校验
    line[ml] = decode(preds_idx, preds_prob, true)
    ml--
  }

  function decode(text_index, text_prob, is_remove_duplicate): object {
    const ignored_tokens = [0]
    const char_list = []
    const conf_list = []
    for (let idx = 0; idx < text_index.length; idx++) {
      if (text_index[idx] in ignored_tokens) {
        continue
      }
      if (is_remove_duplicate) {
        if (idx > 0 && text_index[idx - 1] === text_index[idx]) {
          continue
        }
      }
      // @ts-ignore 忽略校验
      char_list.push(character[text_index[idx] - 1])
      if (text_prob) {
        // @ts-ignore 忽略校验
        conf_list.push(text_prob[idx])
      } else {
        // @ts-ignore 忽略校验
        conf_list.push(1)
      }
    }
    let text = ''
    let mean = 0
    if (char_list.length) {
      text = char_list.join('')
      let sum = 0
      conf_list.forEach((item) => {
        sum += item
      })
      mean = sum / conf_list.length
      text = text.replace(/[a-zA-Z ]*/g, (v) => WordsNinja.splitSentence(v).join(' '))
    }
    return { text, mean }
  }

  // @ts-ignore 忽略校验
  return line
}
