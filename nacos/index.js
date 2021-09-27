const NacosNamingClient = require('nacos').NacosNamingClient;
const NacosConfigClient = require('nacos').NacosConfigClient;
const logUtil = require('../plugin/log4j')
const fs = require('fs')
module.exports = {
  initNacosConfig: async () => {
    const configClient = new NacosConfigClient({
      serverAddr: global.NACOS_IP
    });
    try {
      const content = await configClient.getConfig(global.NACOS_CONFIG, global.NACOS_GROUP_NAME);
      const processConfig = JSON.parse(content)
      //再次使用远程覆盖本地赋值
      for (const k in processConfig) {
        global[k] = processConfig[k]
      }
      // const fileName = process.env.NODE_ENV == 'development'?'../config/config.develop':'../config/config.prod'
      // const oldConfig = require(fileName+'.js')
      // for (const k in oldConfig) {
      //   oldConfig[k] = global[k]
      // }
      // const oldConfigStr  =JSON.stringify(oldConfig)
      //   //文件写入成功。
      // fs.writeFileSync(fileName, oldConfigStr)
      // logUtil.pluginLogger.info('nacos', 'success', '配置写入本地成功')
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
    }, global.NACOS_GROUP_NAME).catch(()=>{
      logUtil.pluginLogger.info('nacos', 'error', '注册失败，5s后将自动重连')
      setTimeout(() => {
        module.exports.initNacosInstance()
      }, 5000);
    })
  }
}