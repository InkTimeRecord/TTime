<div align='center'>

  <img width="150px" src="https://ttime.timerecord.cn/img/logo.png"/>

  # TTime

  🚀 一款简洁高效的输入、截图、划词翻译软件

  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99-ttime.timerecord.cn-brightgreen?logo=Safari"/></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-Windows-blue?logo=windows&logoColor=white" /></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-macOS-black?&logo=apple&logoColor=white" /></a>
  <a href="JavaScript:;"><img src="https://img.shields.io/github/license/InkTimeRecord/TTime"/></a>

  (中文 | [English](README.en.md))

</div>

## 简介

主要功能：`输入翻译`、`截图翻译`、`划词翻译`、`悬浮球翻译`、`截图OCR`、`静默截图OCR`

## 界面
<div align='center'>
  <table>
    <tr>
        <td>
        <p>明亮模式</p>
        <img width="350px" src="https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/translate.png"/>
        </td>
        <td>
        <p>暗黑模式</p>
        <img width="350px" src="https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/translate-dark.png"/>
        </td>
    </tr>
  </table>
</div>

| 方式 | 描述 | 预览 |
| :---: | :---: | :---: |
| 截图翻译 | 按下截图翻译快捷键（默认 `Alt + W`），截取需要翻译的区域 | ![截图翻译](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot.gif) |
| 划词翻译 | 选中需要翻译的文本之后，按下划词翻译快捷键即可（默认 `Alt + E`） | ![划词翻译](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/choice.gif) |
| 输入翻译| 按下输入翻译快捷键（默认 `Alt + Q`），输入需要翻译的文本，`Enter` 键翻译 | ![输入翻译](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/input.gif) |
| 悬浮球翻译 | 选中需要翻译的文本之后，点击悬浮球图标即可 (默认关闭，需要自行在设置中开启) | ![悬浮球翻译](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/hover-ball.gif) |
| 截图OCR | 按下此快捷键将会根据你截图区域进行文字识别 | ![截图OCR](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot-ocr.gif) |
| 截图静默OCR | 按下此快捷键将会根据你截图区域进行文字识别，识别的内容自动写入剪切板不会打开OCR窗口 | ![截图静默OCR](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot-silence-ocr.gif) |

## 目前已集成翻译/文字识别服务
[翻译源/文字识别申请参考](https://ttime.timerecord.cn/pages/93e0f8/#%E7%BF%BB%E8%AF%91%E6%BA%90%E4%BB%8B%E7%BB%8D)

- [x] 翻译源
  - [x] TTime (内置)
  - [x] Google翻译 (内置)
  - [x] DeepL (内置) = DeepLX
  - [x] Bing (内置)
  - [x] Bing词典翻译 (内置)
  - [x] 腾讯交互翻译 (内置)
  - [x] 小牛翻译 (内置)
  - [x] 腾讯翻译君
  - [x] 百度翻译
  - [x] 阿里翻译
  - [x] Google翻译
  - [x] OpenAI翻译(ChatGPT)
  - [x] 有道翻译
  - [x] DeepL翻译
  - [x] 火山翻译
  - [x] 小牛翻译
  - [x] 彩云翻译

- [x] 文字识别
  - [x] TTime
  - [x] TTime在线
  - [x] 百度OCR
  - [x] 火山OCR


## 感谢
* 感谢 [electron-vite](https://github.com/alex8088/electron-vite) 提供的electron框架 节省了我很多的时间成本
* 感谢 [Bob](https://github.com/ripperhe/Bob) 主要灵感来源
* 感谢 [bob-plugin-openai-translator](https://github.com/yetone/bob-plugin-openai-translator) OpenAI最初实现的参考
* 感谢 [eSearch](https://github.com/xushengfeng/eSearch) 离线OCR及最初版本截图实现的参考
