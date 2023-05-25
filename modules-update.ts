const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// 将 修改过源码的 node_modules_update 内的文件覆盖在 node_modules 中
// node_modules
const NODE_MODULES = path.resolve('./node_modules')
// 修改过源码的 node_modules
const UPDATE_NODE_MODULES = path.resolve('./node_modules_update')
copy(UPDATE_NODE_MODULES, NODE_MODULES)

/**
 * @param {string} origin 需要复制的目录、文件
 * @param {string} target 复制到指定的目录、文件
 * @param {string} filterFn 每次复制前，都会经过一次filterFn，若返回true，则复制。
 */
function copy(origin, target, filterFn = (origin, target) => true) {
  if (fs.statSync(origin).isDirectory()) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }
    fs.readdirSync(origin).forEach(originName => {
      const originFilePath = path.resolve(origin, originName)
      const targetFilePath = path.resolve(target, originName)
      copy(originFilePath, targetFilePath, filterFn)
    })
  } else if (filterFn(origin, target)) {
    console.info(chalk.blue('已手动修改过源码：', target))
    //执行替换
    fs.copyFileSync(origin, target)
  }
}

console.info(chalk.bold.yellow('以上的文件已被 node_modules_update 中的文件替换，升级版本后请注意检查'))
