/**
 * doc
 * https://socketio.bootcss.com/docs/server-api/
 */
const IO = require('socket.io')
const {createNewServer} = require('./sshService')
const redisAdapter = require("socket.io-redis");
const {redisStore} = require('../plugin/redis');
const logUtil = require('../plugin/log4j');
const Redis = require('ioredis');
function creatSocket(app,koa) {
  /**
     * 系统升级检查服务及系统状态
     */
  koa.context.CheckSystem = IO(app,{
      origin: "*.*",
      path:'/socketnode/checksocket/',
      transports: ['polling', 'websocket'],
      pingTimeout: 180000, 
      pingInterval: 25000,
      // cors: { 
      //   origin: "*.*", 
      //   methods: [ "GET" , "POST" ], 
      //   credentials: true
      // }
  })
  if (Array.isArray(global.REDIS_MEMBERS)) {
    // const MEMBERS =  global.REDIS_MEMBERS.map(irm => {
    //   return {
    //     port: irm.port, // Redis port
    //     host: irm.host, // Redis host
    //     family: global.RD_FAMILY,
    //     db: global.RD_DB
    //   }
    // })
    // if(MEMBERS.length===1){
    //   koa.context.CheckSystem.adapter(
    //     redisAdapter({
    //       pubClient: redisStore.redis, 
    //       subClient: redisStore.redis.duplicate()
    //     })
    //   );
    // }else{
    //   koa.context.CheckSystem.adapter(
    //     redisAdapter({
    //       pubClient: redisStore.redis, 
    //       subClient: redisStore.redis
    //     })
    //   );
    // }
  }else{
    logUtil.pluginLogger.info('Redis', 'connect', 'redis参数异常！')
  }
  koa.context.CheckSystem.on("connection", async function(clientSocket) {
      console.log('用户开始进场：',clientSocket.id)
      const systemStatus = await redisStore.get('system:status')
      clientSocket.emit('system-status',systemStatus)
      clientSocket.on('disconnect', function(e){
          console.log('user disconnected',e);
      });
  });
  /**
     * ssh webssh服务
     */
  const sshService = IO(app,{
      origin: "*.*",
      path:'/socketnode/ssh',
      transports: ['polling', 'websocket'],
      pingTimeout: 180000, 
      pingInterval: 25000,
      // cors: { 
      //   origin: "*.*", 
      //   methods: [ "GET" , "POST" ], 
      //   credentials: true
      // }
  })
  if (Array.isArray(global.REDIS_MEMBERS)) {
    // const MEMBERS =  global.REDIS_MEMBERS.map(irm => {
    //   return {
    //     port: irm.port, // Redis port
    //     host: irm.host, // Redis host
    //     family: global.RD_FAMILY,
    //     password: global.RD_PASSWORD
    //   }
    // })
    // if(MEMBERS.length===1){
    //   koa.context.CheckSystem.adapter(
    //     redisAdapter({
    //       pubClient: redisStore.redis, 
    //       subClient: redisStore.redis.duplicate()
    //     })
    //   );
    // }else{
    //   koa.context.CheckSystem.adapter(
    //     redisAdapter({
    //       pubClient: redisStore.redis, 
    //       subClient: redisStore.redis
    //     })
    //   );
    // }
  }else{
    logUtil.pluginLogger.info('Redis', 'connect', 'redis参数异常！')
  }
  // 每个客户端socket连接时都会触发 connection 事件
  sshService.on("connection", function(clientSocket) {
        console.log('sshService新用户进场',clientSocket.id)
  });
  const sshSocket = sshService.of('/')
  sshSocket.on('connection',function(sshSocket) {
    sshSocket.on('createNewServer', function(machineConfig) {//新建一个ssh连接
          createNewServer(machineConfig,sshService)
    })
    sshSocket.on('disconnect', function(){
          console.log('user disconnected');
    });
  })
}
module.exports = {
  creatSocket
}