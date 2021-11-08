/**
 * 注册所有插件
 */
//  redisSocket
const { redisStore } = require('./redis');
const { simplestMq } = require('./rabbitmq/simplest');
const { workqueuetMq } = require('./rabbitmq/workqueue');
const { pubsubMq } = require('./rabbitmq/pubsub');
const { rpcMq } = require('./rabbitmq/rpc');
const logUtil = require('./log4j');
const db = require('../db/sequelize')
const axios = require('./axios');
module.exports={
    initPlugin: async(app)=>{
        // 初始化
        redisStore.set('system:status',{status:'NORMAL',data:{},message:'系统启动成功!'})
        // 插件注入
        app.context.redisStore = redisStore
        // app.context.redisSocket = redisSocket
        //  ------------ 队列 -------------
        app.context.simplestMq = simplestMq
        // 工作队列
        app.context.workqueuetMq = workqueuetMq
        // 订阅发布
        app.context.pubsubMq = pubsubMq
        // RPC模式
        app.context.rpcMq = rpcMq
        // 日志
        app.context.logUtil = logUtil
        app.context.axios = axios
        app.context.db = db
        // socket用户列表
        app.context.socketUser = []
    }
}