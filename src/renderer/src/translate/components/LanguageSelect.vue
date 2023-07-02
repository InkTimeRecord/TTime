<template>
  <div class="language-select-block">
    <div class="language-select">
      <a class="language-block language-block-left none-select" @click="clickSelectInputFun">
        <div>
          {{ inputLanguageSelect.languageName }}
        </div>
        <el-icon class="language-select-icon">
          <ArrowDown v-if="showLanguageInput" />
          <ArrowLeft v-else />
        </el-icon>
      </a>

      <div class="function-tools-block language-exchange-block language-block">
        <a class="function-tools language-icon" @click="clickLanguageExchange">
          <svg-icon icon-class="substitution" class="function-tools-icon" />
        </a>
      </div>

      <a class="language-block language-block-right none-select" @click="clickSelectResultFun">
        <div>
          {{ resultLanguageSelect.languageName }}
        </div>
        <el-icon class="language-select-icon">
          <ArrowDown v-if="showLanguageResult" />
          <ArrowLeft v-else />
        </el-icon>
      </a>
    </div>

    <el-collapse-transition>
      <div v-show="showLanguageInput">
        <div class="language-search">
          <el-input v-model="languageSearchInput" placeholder="输入语言名称" />
        </div>
        <div class="language-list-block none-select function-tools-block">
          <template v-for="(language, index) in languageInputList" :key="index">
            <a
              class="language-block none-select function-tools"
              :class="{
                'language-active': inputLanguageSelect.languageName === language.languageName
              }"
              @click="inputLanguageSelectClick(language)"
            >
              <div class="language-name none-select">{{ language.languageName }}</div>
              <div class="language-logo-block none-select">
                <template v-for="(service, indexTwo) in language.serviceList" :key="indexTwo">
                  <img class="language-logo none-select" :src="service.logo" />
                </template>
              </div>
            </a>
          </template>
        </div>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showLanguageResult">
        <div class="language-search">
          <el-input v-model="languageSearchResult" placeholder="输入语言名称" />
        </div>
        <div class="language-list-block none-select function-tools-block">
          <template v-for="(language, index) in languageResultList" :key="index">
            <a
              class="language-block none-select function-tools"
              :class="{
                'language-active': resultLanguageSelect.languageName === language.languageName
              }"
              @click="resultLanguageSelectClick(language)"
            >
              <div class="language-name none-select">{{ language.languageName }}</div>
              <div class="language-logo-block none-select">
                <template v-for="(service, indexTwo) in language.serviceList" :key="indexTwo">
                  <img class="language-logo none-select" :src="service.logo" />
                </template>
              </div>
            </a>
          </template>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { initLanguageList } from './channel/language/ChannelLanguage'
import { ref, watch } from 'vue'
import { cacheGet, cacheSet } from '../../utils/cacheUtil'
import LanguageEnum from '../../enums/LanguageEnum'
import { isNull } from '../../../../common/utils/validate'

const languageAuto = {
  languageType: LanguageEnum.AUTO,
  languageName: '自动识别'
}
// 初始化语言选择值
if (undefined === cacheGet('inputLanguage')) {
  cacheSet('inputLanguage', languageAuto)
}
if (undefined === cacheGet('resultLanguage')) {
  cacheSet('resultLanguage', languageAuto)
}

const languageList = ref([])
const languageInputList = ref([])
const languageResultList = ref([])
const showLanguageInput = ref(false)
const showLanguageResult = ref(false)
const languageSearchInput = ref('')
const languageSearchResult = ref('')

// 输入框当前选择的语言 默认为自动识别
const inputLanguageSelect = ref(cacheGet('inputLanguage'))
// 结果框当前选择的语言 默认为自动识别
const resultLanguageSelect = ref(cacheGet('resultLanguage'))

/**
 * 翻译语言转换点击事件
 */
const insideInitLanguageList = (): void => {
  languageList.value = [languageAuto, ...initLanguageList()]
  languageInputList.value = languageList.value
  languageResultList.value = languageList.value
}

// 初始化翻译语言加载
insideInitLanguageList()

/**
 * 显示选择输入翻译语言
 */
const clickSelectInputFun = (): void => {
  if (showLanguageResult.value) {
    showLanguageResult.value = !showLanguageResult.value
  }
  showLanguageInput.value = !showLanguageInput.value
}

/**
 * 显示选择结果翻译语言
 */
const clickSelectResultFun = (): void => {
  if (showLanguageInput.value) {
    showLanguageInput.value = !showLanguageInput.value
  }
  showLanguageResult.value = !showLanguageResult.value
}

/**
 * 输入 - 翻译语言选择点击事件
 */
const inputLanguageSelectClick = (language: object): void => {
  cacheSet('inputLanguage', language)
  inputLanguageSelect.value = language
}

/**
 * 结果 - 翻译语言选择点击事件
 */
const resultLanguageSelectClick = (language: object): void => {
  cacheSet('resultLanguage', language)
  resultLanguageSelect.value = language
}

/**
 * 翻译语言转换点击事件
 */
const clickLanguageExchange = (): void => {
  const inputLanguageSelect = cacheGet('inputLanguage')
  const resultLanguageSelect = cacheGet('resultLanguage')
  inputLanguageSelectClick(resultLanguageSelect)
  resultLanguageSelectClick(inputLanguageSelect)
}

/**
 * 更新翻译服务事件
 */
window.api.updateTranslateServiceEvent(() => {
  // 加载翻译服务
  insideInitLanguageList()
  // 重置初始化语言选择
  inputLanguageSelectClick(languageAuto)
  resultLanguageSelectClick(languageAuto)
})

/**
 * 语言搜索输入监听
 */
watch(languageSearchInput, (newVal) => {
  languageInputList.value = languageSearch(newVal)
})

/**
 * 结果语言搜索输入监听
 */
watch(languageSearchResult, (newVal) => {
  languageResultList.value = languageSearch(newVal)
})

/**
 * 语言搜索
 *
 * @param searchLanguageName 语言名称
 * @return 搜索到的语言
 */
const languageSearch = (searchLanguageName): any[] => {
  if (isNull(searchLanguageName)) {
    return languageList.value
  }
  return languageList.value.filter(
    (obj) => obj.languageName && obj.languageName.includes(searchLanguageName)
  )
}
</script>

<style lang="scss" scoped>
@import '../../css/translate.scss';

.language-select-block {
  //height: 32px;
  margin: 0 12px 12px 12px;
  border-radius: 7px;
  background: var(--ttime-translate-input-color-background);
  text-align: center;

  .language-select {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .language-block {
    display: inline-block;
    font-size: 13px;
    color: var(--ttime-text-color);
  }

  .language-select-icon {
    margin-left: 10px;
  }

  .language-block-left {
    display: flex;
    align-items: center;
    width: 170px;
    justify-content: center;
  }

  .language-block-right {
    display: flex;
    align-items: center;
    width: 170px;
    justify-content: center;
  }

  .language-exchange-block {
    padding: 5px 15px;
  }
}

:deep(.language-search) {
  margin: 5px;
  padding-top: 5px;
  border-top: 1px solid var(--ttime-translate-language-list-block-border-top);

  .el-input__inner {
    background-color: var(--ttime-translate-input-color-background);
    box-shadow: 0 0 0 0;
    border: 0;
    resize: none;
    padding: 5px;
    width: 98%;
  }

  .el-input__wrapper {
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 1px 11px;
    background-color: var(--ttime-translate-input-color-background, var(--el-fill-color-blank));
    background-image: none;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    transition: var(--el-transition-box-shadow);
    box-shadow: 0 0 0 1px var(--ttime-translate-input-color-background, var(--el-border-color))
      inset;
  }
}

.language-list-block {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
  max-height: 150px;

  padding: 0;
  line-height: 0;
  justify-content: left;

  .language-block {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 30px;
    background: var(--ttime-translate-language-background);
    margin: 5px;
    border-radius: 5px;

    .language-name {
      padding: 5px;
      min-width: 80px;
    }

    .language-logo-block {
      display: flex;
      align-items: center;

      .language-logo {
        width: 15px;
        margin-left: 5px;
      }
    }
  }

  .language-active {
    background: var(--ttime-translate-language-active-background);
  }
}

.language-list-block::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.language-list-block::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}

.language-list-block::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
