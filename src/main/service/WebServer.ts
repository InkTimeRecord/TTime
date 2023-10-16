import { parseCustomProtocolUrl } from '../../common/utils/urlUtil'
import { isNull } from '../../common/utils/validate'
import TTimeAuth from './auth/TTimeAuth'
import StoreService from './StoreService'
import log from '../utils/log'
import http from 'http'

const servicePort = StoreService.configGet('servicePort')
// 创建服务并绑定端口号
const server = http.createServer().listen(servicePort, '0.0.0.0')
log.info('[服务] - 初始化 , 端口号 : ', servicePort)

server.on('error', (e: any) => {
  log.error('[服务] - 异常 : ', e)
  if (e?.code === 'EADDRINUSE' || e?.code === 'EACCES') {
    log.error('[服务] - 重置服务端口号 - 开始 ')
    setTimeout(() => {
      server.close()
      // 随机分配端口号
      server.listen(0, '0.0.0.0', () => {
        const port = (server.address() as any).port
        log.info('[服务] - 重置服务端口号 : ', port)
        StoreService.configSet('servicePort', port)
      })
    }, 1000)
  }
})

// 绑定请求事件监听
server.on('request', (req, res) => {
  const parseCustomProtocol = parseCustomProtocolUrl(req.url)
  if (isNull(parseCustomProtocol)) {
    return
  }
  if (parseCustomProtocol.path === 'login') {
    const token = parseCustomProtocol.queryParams.token
    if (token) {
      TTimeAuth.login(token)
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF8' })
  res.end(
    '<div style=" display: flex;align-items: center;justify-content: center;width: 100%;height: 100%;">' +
      '<div style="display: flex;align-items: center;flex-direction: column;">' +
      '<h1>成功</h1>' +
      '<h2>您可以关闭此页面</h2>' +
      '</div>' +
      '</div>'
  )
})
