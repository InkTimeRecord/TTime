<div align='center'>

  <img width="150px" src="https://ttime.timerecord.cn/img/logo.png"/>

  # TTime

  🚀 一款简洁高效的输入、截图、划词翻译软件

  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99-ttime.timerecord.cn-brightgreen?logo=Safari"/></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-Windows-blue?logo=windows&logoColor=white" /></a>
  <a href="https://ttime.timerecord.cn"><img src="https://img.shields.io/badge/-macOS-black?&logo=apple&logoColor=white" /></a>

  (中文 | [English](README.en.md))

</div>

## 简介

主要功能：`输入翻译`、`截图翻译`、`划词翻译`、`悬浮球翻译`、`截图OCR`、`静默截图OCR`、`剪贴板监听翻译`

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
| 截图静默OCR | 按下此快捷键将会根据你截图区域进行文字识别，识别的内容自动写入剪贴板不会打开OCR窗口 | ![截图静默OCR](https://raw.githubusercontent.com/InkTimeRecord/TTime/dev/README.assets/screenshot-silence-ocr.gif) |

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
  - [x] 简明英汉字典-离线 (内置)
  - [x] 腾讯翻译君
  - [x] 百度翻译
  - [x] 阿里翻译
  - [x] Google翻译
  - [x] OpenAI翻译(ChatGPT)
  - [x] AzureOpenAI翻译
  - [x] 有道翻译
  - [x] DeepL翻译
  - [x] 火山翻译
  - [x] 小牛翻译
  - [x] 彩云翻译
  - [x] Papago翻译

- [x] 文字识别
  - [x] TTime
  - [x] TTime在线
  - [x] 百度OCR
  - [x] 百度图片翻译OCR
  - [x] 火山OCR
  - [x] Ocr Space
  - [x] 讯飞OCR
  - [x] 腾讯云OCR
  - [x] 腾讯云图片翻译OCR

## 开发指南

开发环境
```
NodeJs Version >= 16

Npm Version >= 8
```

依赖下载
```
npm run npm-i-extend-modules-update
```

项目启动
```
npm run dev
```

项目打包
```
npm run build:win
npm run build:win:portable
npm run build:mac
```

## 简单快速新增翻译/OCR源

新增翻译/OCR源新增很简单，你只需要有一些JS/TS基础和接口联调能力就可以集成 ，以下以小牛翻译为例

### 1.新增类型

编辑文件添加一个翻译源枚举

```
src/common/enums/TranslateServiceEnum.ts
```

`此处需要注意：当翻译源枚举定义后，后续的文件名称都需要按照枚举名称方式命名，具体参照如下步骤的命名规则`

```
static NIU_TRANS = 'NiuTrans'
```

### 2.新增Logo

把Logo文件复制到此文件路径下

```
src/renderer/src/assets/translate/NiuTransLogo.png
```

### 3.新增翻译/OCR源信息

新增翻译/OCR源信息文件

```
src/common/channel/translate/info/NiuTransInfo.ts
```

### 4.新增翻译/OCR源实现

新增翻译/OCR源接口实现

```
src/main/service/channel/interfaces/NiuTransRequest.ts
```

新增翻译/OCR源接口调用回调页面结果

```
src/main/service/channel/product/translate/NiuTransChannel.ts
```

## 感谢
* 感谢 [electron-vite](https://github.com/alex8088/electron-vite) 提供的electron框架 节省了我很多的时间成本
* 感谢 [Bob](https://github.com/ripperhe/Bob) 主要灵感来源
* 感谢 [bob-plugin-openai-translator](https://github.com/yetone/bob-plugin-openai-translator) OpenAI最初实现的参考
* 感谢 [eSearch](https://github.com/xushengfeng/eSearch) 离线OCR及最初版本截图实现的参考
