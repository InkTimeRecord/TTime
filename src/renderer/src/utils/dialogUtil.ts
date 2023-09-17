/**
 * dialog 设置窗口样式更新
 */
export const dialogSetWinHandleStyle = (className: string) => {
  setTimeout(() => {
    // 使用这种方式 否则多个弹层时 会收到影响
    const el = document.querySelector('.' + className).parentNode.parentNode
    if (el) {
      // 此处动态调整下遮罩 否则大小会超过窗口
      el['style'].cssText = 'width: 97.7%;margin-left: 10px;border-radius: 8px;'
    }
  }, 100)
}
