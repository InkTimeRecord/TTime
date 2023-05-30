import { resolve } from 'path'
// @ts-ignore 抑制错误校验问题
import { bytecodePlugin, defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import commonjsExternals from 'vite-plugin-commonjs-externals'
// @ts-ignore 抑制错误校验问题
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const BASE_API = 'https://timerecord.cn/apis/'

export default defineConfig({
  main: {
    plugins: [bytecodePlugin()],
    build: {
      rollupOptions: {
        external: [
          '@jitsi/robotjs',
          'node-screenshots',
          'axios',
          'tencentcloud-sdk-nodejs-tmt',
          'uiohook-napi',
          '@volcengine/openapi'
        ]
      }
    }
  },
  preload: {
    plugins: [bytecodePlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          screenshot: resolve(__dirname, 'src/preload/screenshot.ts'),
          textOcr: resolve(__dirname, 'src/preload/textOcr.ts'),
          set: resolve(__dirname, 'src/preload/set.ts'),
          update: resolve(__dirname, 'src/preload/update.ts')
        }
      }
    }
  },
  renderer: {
    server: {
      host: '0.0.0.0',
      port: 9098
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src'),
        '@assets': resolve('src/renderer/src/assets')
      }
    },
    define: {
      'process.env': {
        BASE_API: BASE_API
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/renderer/src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      // @ts-ignore 忽略校验 这块目前只能这么调用
      commonjsExternals.default({
        externals: ['path', /^electron(\/.+)?$/]
      })
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          screenshot: resolve(__dirname, 'src/renderer/screenshot.html'),
          textOcr: resolve(__dirname, 'src/renderer/textOcr.html'),
          set: resolve(__dirname, 'src/renderer/set.html'),
          update: resolve(__dirname, 'src/renderer/update.html')
        }
      }
    }
  }
})
