/**
 * 自动更新枚举
 */
class AutoUpdaterEnum {
  /**
   * 错误事件
   */
  static ERROR = 'error'

  /**
   * 检查更新中触发
   */
  static CHECKING_FOR_UPDATE = 'checking-for-update'

  /**
   * 版本检测结束, 当有新版本时触发
   */
  static UPDATE_AVAILABLE = 'update-available'

  /**
   * 版本检测结束, 没有新版本时触发
   */
  static UPDATE_NOT_AVAILABLE = 'update-not-available'

}

export { AutoUpdaterEnum }
