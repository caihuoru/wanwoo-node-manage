const NacosNamingClient = require('nacos').NacosNamingClient;
const NacosConfigClient = require('nacos').NacosConfigClient;
module.exports = {
  initNacosConfig: async () => {
    const configClient = new NacosConfigClient({
      serverAddr: global.NACOS_IP
    });
    const content = await configClient.getConfig(global.NACOS_CONFIG, global.NACOS_GROUP_NAME);
    const processConfig = JSON.parse(content)
    //再次使用远程覆盖本地赋值
    for (const k in processConfig) {
      global[k] = processConfig[k]
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
    }, global.NACOS_GROUP_NAME)
  }
}