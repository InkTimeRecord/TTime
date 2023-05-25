/**
 * 系统类型
 */
class SystemTypeEnum {
  /**
   * Windows
   */
  static WIN = 'win32'

  /**
   * MAC OS
   */
  static MAC = 'darwin'

  /**
   * Linux
   */
  static LINUX = 'linux'

  /**
   * 未知系统
   */
  static UNKNOWN = 'unknown'

  /**
   * 获取系统类型
   *
   * @returns {string} 系统类型
   */
  static getSystemType(): string {
    // 获取当前系统类型
    const platform = window.api.getSystemTypeEvent()
    if (platform === SystemTypeEnum.MAC) {
      return SystemTypeEnum.MAC
    } else if (platform === SystemTypeEnum.WIN) {
      return SystemTypeEnum.WIN
    } else if (platform === SystemTypeEnum.LINUX) {
      return SystemTypeEnum.LINUX
    } else {
      return SystemTypeEnum.UNKNOWN
    }
  }

  /**
   * 是否为 MAC 系统
   *
   * @returns {boolean} 是 返回 true 否则 返回 false
   */
  static isMac(): boolean {
    return SystemTypeEnum.getSystemType() === SystemTypeEnum.MAC
  }

  /**
   * 是否为 Linux 系统
   *
   * @returns {boolean} 是 返回 true 否则 返回 false
   */
  static isLinux(): boolean {
    return SystemTypeEnum.getSystemType() === SystemTypeEnum.LINUX
  }
}

export { SystemTypeEnum }
