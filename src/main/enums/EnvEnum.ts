/**
 * 环境枚举
 */
class EnvEnum {
  /**
   * 开发环境
   */
  static DEV = 'development'

  /**
   * 生产环境
   */
  static PRO = 'production'

  /**
   * 未知环境
   */
  static UNKNOWN = 'unknown'

  /**
   * 获取系统类型
   *
   * @returns {string} 系统类型
   */
  static getEnv(): string {
    // 获取当前系统类型
    const env = process.env.NODE_ENV
    if (env === EnvEnum.DEV) {
      return EnvEnum.DEV
    } else if (env === EnvEnum.PRO) {
      return EnvEnum.PRO
    } else {
      return EnvEnum.UNKNOWN
    }
  }

  /**
   * 是否为生产环境
   *
   * @returns {boolean} 是 返回 true 否则 返回 false
   */
  static isPro(): boolean {
    return EnvEnum.getEnv() === EnvEnum.PRO
  }

  /**
   * 是否为开发环境
   *
   * @returns {boolean} 是 返回 true 否则 返回 false
   */
  static isDev(): boolean {
    return EnvEnum.getEnv() === EnvEnum.DEV
  }
}

export { EnvEnum }
