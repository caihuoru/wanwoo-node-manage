const NacosNamingClient = require('nacos').NacosNamingClient;
const NacosConfigClient = require('nacos').NacosConfigClient;
const logUtil = require('../plugin/log4j')
const fs = require('fs')
const path = require('path')
module.exports = {
  initNacosConfig: async () => {
    const configClient = new NacosConfigClient({
      serverAddr: global.NACOS_IP
    });
    const newLines = []
    try {
      const content = await configClient.getConfig(global.NACOS_CONFIG, global.NACOS_GROUP_NAME);
      const processConfig = JSON.parse(content)
      //再次使用远程覆盖本地赋值
      for (const k in processConfig) {
        global[k] = processConfig[k]
        if (typeof processConfig[k] === 'string') {
          newLines.push(`    ${k}:"${processConfig[k]}",`)
        } else {
          newLines.push(`    ${k}:${JSON.stringify(processConfig[k])},`)
        }
      }
      const fileName = process.env.NODE_ENV == 'development' ? '\\config\\config.develop.js' : '/config/config.prod.js'
      let basePath = path.resolve('./')
      let fileContent = fs.readFileSync(basePath + fileName, 'utf-8').split?.(/\r\n|\n|\r/gm) || '';
      const startIndex = fileContent.findIndex(str => str.trim() === '/**everlasting-start**/');
      const endIndex = fileContent.findIndex(str => str.trim() === '/**everlasting-end**/');
      if (startIndex < 0 || endIndex < 0) {
        return logUtil.pluginLogger.error('nacos', '配置持久化', '失败')
      }
      fileContent.splice(startIndex + 1, endIndex - startIndex - 1, ...newLines)
      //文件写入成功。
      fs.writeFileSync(basePath + fileName, fileContent.join('\n'))
      logUtil.pluginLogger.info('nacos', 'success', '配置写入本地成功')
    } catch (_) {
      logUtil.pluginLogger.info('nacos', 'error', '参数获取异常，已启用本地配置')
    }
  },
  initNacosInstance: async () => {
    const client = new NacosNamingClient({
      logger: {
        info: (type, addr, prot) => {
          //logUtil.serviceLogger.info('nacos','NacosNamingClient-init',type+''+addr+''+prot)
        },
        debug: (type, addr, prot) => {
          //logUtil.serviceLogger.debug('nacos','NacosNamingClient-init',type+''+addr+''+prot)
        },
        error: (type, addr, prot) => {
          //logUtil.serviceLogger.error('nacos','NacosNamingClient-init',type+''+addr+''+prot)
        },
        warn: (type, addr, prot) => {
          //logUtil.serviceLogger.warn('nacos','NacosNamingClient-init',type+''+addr+''+prot)
        }
      },
      serverList: global.NACOS_IP,
      namespace: global.NACOS_NAME_SPACE
    });
    await client.ready()
    await client.registerInstance(global.NACOS_SERVICE_NAME, {
      ip: global.localIP,
      port: global.APP_PORT
    }, global.NACOS_GROUP_NAME).catch(() => {
      logUtil.pluginLogger.info('nacos', 'error', '注册失败，5s后将自动重连')
      setTimeout(() => {
        module.exports.initNacosInstance()
      }, 5000);
    })
  }
}