const NacosNamingClient = require('nacos').NacosNamingClient;
const NacosConfigClient = require('nacos').NacosConfigClient;
const config = require('../config')
module.exports = {
    initNacosConfig: async ()=>{
        const configClient = new NacosConfigClient({
            serverAddr: config.NACOS_IP
        });
        const content = await configClient.getConfig(config.NACOS_CONFIG, config.NACOS_GROUP_NAME);
        const processConfig = JSON.parse(content)
        for (const k in processConfig ) {
          
          global[k] = processConfig[k]
        }
    },
    initNacosInstance:async ()=>{
        const client = new NacosNamingClient({
            logger: {
                info:(type,addr,prot)=>{
                  //logUtil.serviceLogger.info('nacos','NacosNamingClient-init',type+''+addr+''+prot)
                },
                debug:(type,addr,prot)=>{
                  //logUtil.serviceLogger.debug('nacos','NacosNamingClient-init',type+''+addr+''+prot)
                },
                error:(type,addr,prot)=>{
                  //logUtil.serviceLogger.error('nacos','NacosNamingClient-init',type+''+addr+''+prot)
                },
                warn:(type,addr,prot)=>{
                  //logUtil.serviceLogger.warn('nacos','NacosNamingClient-init',type+''+addr+''+prot)
                }
              },
            serverList: config.NACOS_IP,
            namespace: config.NACOS_NAME_SPACE
        });
        await client.ready()
        await client.registerInstance(config.NACOS_SERVICE_NAME,{
            ip:global.localIP,
            port:config.APP_PORT
        },config.NACOS_GROUP_NAME)
    }
}