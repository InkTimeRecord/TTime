<template>
  <el-form :model="shortcutKeyInfo" label-width="120px">
    <el-form-item class="none-select" label="输入翻译">
      <el-input
        v-model="shortcutKeyInfo.inputShortcutKey"
        class="input-shortcut-key"
        placeholder="请设置快捷键"
        clearable
        :formatter="() => shortcutKeyInfo.inputShortcutKey"
        @keydown="translateShortcutKeySetEvent($event, ShortcutKeyEnum.INPUT)"
        @clear="clearTranslateShortcutKey(ShortcutKeyEnum.INPUT)"
      />
      <span class="form-switch-span none-select"> 按下此快捷键调出翻译窗口 </span>
    </el-form-item>
    <el-form-item class="none-select" label="截图翻译">
      <el-input
        v-model="shortcutKeyInfo.screenshotShortcutKey"
        class="input-shortcut-key"
        placeholder="请设置快捷键"
        clearable
        :formatter="() => shortcutKeyInfo.screenshotShortcutKey"
        @keydown="translateShortcutKeySetEvent($event, ShortcutKeyEnum.SCREENSHOT)"
        @clear="clearTranslateShortcutKey(ShortcutKeyEnum.SCREENSHOT)"
      />
      <span class="form-switch-span none-select">
        按下此快捷键将会根据你截图区域进行文字识别并翻译
      </span>
    </el-form-item>
    <el-form-item class="none-select" label="划词翻译">
      <el-input
        v-model="shortcutKeyInfo.choiceShortcutKey"
        class="input-shortcut-key"
        placeholder="请设置快捷键"
        clearable
        :formatter="() => shortcutKeyInfo.choiceShortcutKey"
        @keydown="translateShortcutKeySetEvent($event, ShortcutKeyEnum.CHOICE)"
        @clear="clearTranslateShortcutKey(ShortcutKeyEnum.CHOICE)"
      />
      <span class="form-switch-span none-select">
        按下此快捷键光标选中的内容会自动复制并识别翻译
      </span>
    </el-form-item>

    <el-divider />

    <el-form-item class="none-select" label="截图OCR">
      <el-input
        v-model="shortcutKeyInfo.screenshotOcrShortcutKey"
        class="input-shortcut-key"
        placeholder="请设置快捷键"
        clearable
        :formatter="() => shortcutKeyInfo.screenshotOcrShortcutKey"
        @keydown="translateShortcutKeySetEvent($event, ShortcutKeyEnum.SCREENSHOT_OCR)"
        @clear="clearTranslateShortcutKey(ShortcutKeyEnum.SCREENSHOT_OCR)"
      />
      <span class="form-switch-span none-select"> 按下此快捷键将会根据你截图区域进行文字识别 </span>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getNameByCode } from '@/utils/keyboard'
import ElMessageExtend from '../../../utils/messageExtend'
import { ShortcutKeyEnum } from '../../../enums/ShortcutKeyEnum'
import { cacheGetStr, cacheSetStr } from '../../../utils/cacheUtil'
import { isNull } from '../../../utils/validate'

const shortcutKeyInfo = ref({
  inputShortcutKey: cacheGetStr('inputShortcutKey'),
  screenshotShortcutKey: cacheGetStr('screenshotShortcutKey'),
  choiceShortcutKey: cacheGetStr('choiceShortcutKey'),
  screenshotOcrShortcutKey: cacheGetStr('screenshotOcrShortcutKey')
})

const clearTranslateShortcutKey = (type): void => {
  const shortcutKeyElement = type + 'ShortcutKey'
  const oldShortcutKey = cacheGetStr(shortcutKeyElement)
  window.api.updateTranslateShortcutKeyEvent(type, oldShortcutKey, null, (res) => {
    cacheSetStr(shortcutKeyElement, '')
    if (res.code === -1) {
      ElMessageExtend.error(res.msg)
      return
    }
    ElMessageExtend.success('清空成功')
  })
}

/**
 * 设置翻译快捷键 - 监听按下
 *
 * @param event 事件
 * @param type  类型
 */
const translateShortcutKeySetEvent = (event, type): void => {
  // 中文模式下输入会触发 这里手动拦截掉
  if (event.keyCode === 229) {
    return
  }
  let shortcutKey = getShortcutKey(event)
  const shortcutKeyElement = type + 'ShortcutKey'
  const oldShortcutKey = shortcutKeyInfo.value[shortcutKeyElement]
  if (oldShortcutKey === shortcutKey || isNull(shortcutKey)) {
    return
  }
  // 优化显示格式
  shortcutKey = shortcutKey.replaceAll('+', ' + ')
  window.api.updateTranslateShortcutKeyEvent(type, oldShortcutKey, shortcutKey, (res) => {
    if (res.code === -1) {
      ElMessageExtend.error(res.msg)
      return
    }
    shortcutKeyInfo.value[shortcutKeyElement] = shortcutKey
    if (cacheGetStr(shortcutKeyElement) !== shortcutKey) {
      cacheSetStr(shortcutKeyElement, shortcutKey)
      ElMessageExtend.success('设置成功')
    }
  })
}

const CODE_CONTROL = [
  'Shift',
  'ShiftLeft',
  'ShiftRight',
  'Control',
  'ControlLeft',
  'ControlRight',
  'Alt',
  'AltLeft',
  'AltRight',
  'Meta',
  'MetaLeft',
  'MetaRight',
  ' ',
  '+',
  '-',
  '*'
]

const CODE_SYS_CONTROL = [
  'Ctrl+Z',
  'Ctrl+C',
  'Ctrl+X',
  'Ctrl+V',
  'Command+Z',
  'Command+C',
  'Command+X',
  'Command+V',
  'Command+Q',
  'Alt+Tab'
]

/**
 * 输入快捷键
 *
 * @param event 事件
 */
const getShortcutKey = (event): string => {
  const { altKey, ctrlKey, shiftKey, metaKey, key, keyCode } = event
  if (CODE_CONTROL.includes(key)) {
    return ''
  }
  let shortcutKey = ''
  const controlKeyList = [
    { key: altKey, text: 'Alt' },
    { key: ctrlKey, text: 'Ctrl' },
    { key: metaKey, text: 'Command' },
    { key: shiftKey, text: 'Shift' }
  ]
  controlKeyList.forEach((curKey) => {
    if (curKey.key) {
      if (shortcutKey) {
        shortcutKey += '+'
      }
      shortcutKey += curKey.text
    }
  })
  if (keyCode) {
    if (shortcutKey) {
      shortcutKey += '+'
    }
    shortcutKey += getNameByCode(keyCode).toUpperCase()
  }
  event.preventDefault()
  // 如果拼接出来的快捷键和系统快捷键冲突，直接设置为空快捷键
  if (CODE_SYS_CONTROL.includes(shortcutKey)) {
    ElMessageExtend.warning('当前按下的快捷键可能与系统的冲突，无法进行设置')
    return ''
  }
  return undefined === shortcutKey ? '' : shortcutKey
}
</script>

<style lang="scss" scoped>
@import '../../../css/set.scss';

.input-shortcut-key {
  width: 70%;
}
</style>
