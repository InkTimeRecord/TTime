import { ElMessage } from 'element-plus'

class ElMessageExtend {
  /**
   * 成功
   */
  static SUCCESS = '0'
  /**
   * 警告
   */
  static WARNING = '1'
  /**
   * 错误
   */
  static ERROR = '2'

  static expand(): void {
    const elMessageList = document.querySelectorAll('.el-message')
    if (elMessageList) {
      for (let i = 0; i < elMessageList.length; i++) {
        // @ts-ignore
        elMessageList[i].style.cssText = 'border-radius: 8px;'
      }
    }
  }

  static success(message): void {
    setTimeout(() => {
      ElMessage({
        type: 'success',
        message: message
      })
      ElMessageExtend.expand()
    }, 100)
  }

  static warning(message) {
    setTimeout(() => {
      ElMessage({
        type: 'warning',
        message: message
      })
      ElMessageExtend.expand()
    }, 100)
  }

  static error(message): void {
    ElMessageExtend.errorInOptions(message, {})
    ElMessageExtend.expand()
  }

  static errorInOptions(message, options): void {
    setTimeout(() => {
      ElMessage({
        type: 'error',
        message: message,
        ...options
      })
      ElMessageExtend.expand()
    }, 100)
  }
}

export default ElMessageExtend
