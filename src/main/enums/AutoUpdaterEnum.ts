/**
 * 自动更新枚举
 */
class AutoUpdaterEnum {
  /**
   * 错误事件
   */
  static ERROR = 'error'

  /**
   * 检查更新事件
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

  /**
   * 更新下载进度事件
   */
  static DOWNLOAD_PROGRESS = 'download-progress'

  /**
   * 下载完成事件
   */
  static UPDATE_DOWNLOADED = 'update-downloaded'
}

export { AutoUpdaterEnum }
