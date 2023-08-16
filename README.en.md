<div align='center'>

  <img width="150px" src="https://ttime.timerecord.cn/img/logo.png"/>

  # TTime

  🚀 A concise, efficient, good-looking input, screenshot, and word translation software

  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/Official website-ttime.timerecord.cn-brightgreen?logo=Safari"/></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-Windows-blue?logo=windows&logoColor=white" /></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-macOS-black?&logo=apple&logoColor=white" /></a>
  <a href="JavaScript:;"><img src="https://img.shields.io/github/license/InkTimeRecord/TTime"/></a>

  (English | [中文](README.md))

</div>

## brief introduction

The main functions are `input translation`, `screenshot translation`, `selected translation`、`Hover Ball Translation`、`Screenshot OCR`、`Screenshot Silence OCR`

## Interface
<div align='center'>
  <table>
    <tr>
        <td>
        <p>Bright Mode</p>
        <img width="350px" src="https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/translate.png"/>
        </td>
        <td>
        <p>Dark Mode</p>
        <img width="350px" src="https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/translate-dark.png"/>
        </td>
    </tr>
  </table>
</div>

| 方式 | 描述 | 预览 |
| :---: | :---: | :---: |
| Screenshot translation | Press the screenshot translation shortcut key (default ` Alt + W `) to intercept the area to be translated | ![Screenshot translation](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot.gif) |
| Selected translation | After selecting the text to be translated, press the word translation shortcut key (the default is ` Alt + E `) | ![Selected translation](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/choice.gif) |
| Input Translation | Press the input translation shortcut key (default 'Alt+Q'), enter the text to be translated, and use the 'Enter' key to translate | ![Input Translation](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/input.gif) |
| Hover Ball Translation | After selecting the text to be translated, click the floating ball icon (it is closed by default, and needs to be opened in the settings by itself) | ![Hover Ball Translation](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/hover-ball.gif) |
| Screenshot OCR | Pressing this shortcut key will recognize the text according to your screenshot area | ![Screenshot OCR](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot-ocr.gif) |
| Screenshot Silence OCR | Pressing this shortcut key will recognize the text according to your screenshot area, and the recognized content will be automatically written into the clipboard without opening the OCR window | ![Screenshot Silence OCR](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot-silence-ocr.gif) |

## Currently, integrated with translation/text recognition services
[Translation source/text recognition application reference](https://ttime.timerecord.cn/pages/93e0f8/#%E7%BF%BB%E8%AF%91%E6%BA%90%E4%BB%8B%E7%BB%8D)

- [x] Translation source
  - [x] TTime (built-in)
  - [x] Google Translation (built-in)
  - [x] DeepL Translation (built-in) = DeepLX Translation
  - [x] Bing Translation (built-in)
  - [x] Bing dict Translation (built-in)
  - [x] Tencent TranSmart Translation (built-in)
  - [x] NiuTrans (built-in)
  - [x] Tencent Translator
  - [x] Baidu Translation
  - [x] Alibaba Translation
  - [x] Google Translation
  - [x] OpenAI(ChatGPT) Translation
  - [x] YouDao Translation
  - [x] DeepL Translation
  - [x] Volcano Translation
  - [x] NiuTrans
  - [x] CaiYun Translation
  - [x] Papago Translation

- [x] OCR
  - [x] TTime
  - [x] TTime Online OCR
  - [x] Baidu OCR
  - [x] Volcano OCR
  - [x] Ocr Space
  - [x] Iflytek OCR
  - [x] Tencent OCR

## Development Guide

development environment
```
NodeJs Version >= 16

Npm Version >= 8
```

Dependent download
```
npm run npm-i-extend-modules-update
```

Project Run
```
npm run dev
```

Projects Build
```
npm run build:win
npm run build:win:portable
npm run build:mac
```

## 简单快速新增翻译/OCR源

Adding translation/OCR sources is very simple. You only need some JS/TS basics and interface debugging capabilities to integrate. Take Maverick Translation as an example

### 1.Add Type

Edit file to add a translation source enumeration

```
src/common/enums/TranslateServiceEnum.ts
```

`Note here: After the source enumeration definition is translated, subsequent file names need to be named according to the enumeration name method. For details, refer to the naming rules in the following steps`

```
static NIU_TRANS = 'NiuTrans'
```

### 2.Add Logo

Copy the logo file to this file path

```
src/renderer/src/assets/translate/NiuTransLogo.png
```

### 3.Add Translation/OCR Source Information

Add translation/OCR source information file

```
src/common/channel/translate/NiuTransInfo.ts
```

### 4.Add translation/OCR source implementation

Add translation/OCR source interface implementation

```
src/main/service/channel/interfaces/NiuTransRequest.ts
```

Add translation/OCR source interface call callback page results

```
src/main/service/channel/product/translate/NiuTransChannel.ts
```

## Thanks
* Thanks [electron-vite](https://github.com/alex8088/electron-vite) The provided electron framework saved me a lot of time and cost
* Thanks [Bob](https://github.com/ripperhe/Bob) Main sources of inspiration
* Thanks [bob-plugin-openai-translator](https://github.com/yetone/bob-plugin-openai-translator) Reference for the original implementation of OpenAI
* Thanks [eSearch](https://github.com/xushengfeng/eSearch) Reference for offline OCR and initial version screenshot implementation
