/**
 * 快捷键枚举
 */
class ShortcutKeyEnum {
  /**
   * 输入翻译快捷键
   */
  static INPUT = 'input'

  /**
   * 截图翻译快捷键
   */
  static SCREENSHOT = 'screenshot'

  /**
   * 划词翻译快捷键
   */
  static CHOICE = 'choice'

  /**
   * 获取快捷键类型
   *
   * @returns {string} 系统类型
   */
  static getCodeByEnum(code: string): string {
    if (code === ShortcutKeyEnum.INPUT) {
      return ShortcutKeyEnum.INPUT
    } else if (code === ShortcutKeyEnum.SCREENSHOT) {
      return ShortcutKeyEnum.SCREENSHOT
    } else if (code === ShortcutKeyEnum.CHOICE) {
      return ShortcutKeyEnum.CHOICE
    }
    return ''
  }
}

export { ShortcutKeyEnum }
