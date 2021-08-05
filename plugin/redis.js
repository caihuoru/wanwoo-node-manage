/**
 * doc
 * https://my.oschina.net/u/4609891/blog/4775908
 */
const Redis = require('ioredis');
const logUtil = require('./log4j');
const { Emitter } = require("@socket.io/redis-emitter")
class RedisStore {
  constructor() {
    try {
      const REDIS_MEMBERS = global.REDIS_MEMBERS
      const basicConf = {
        family: global.RD_FAMILY, // 4 (IPv4) or 6 (IPv6)
        password: global.RD_PASSWORD,
        db: global.RD_DB,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError(err) {
          const targetError = "READONLY";
          if (err.message.includes(targetError)) {
            return true;
          }
        }
      }
        if (Array.isArray(REDIS_MEMBERS)) {
          const MEMBERS = REDIS_MEMBERS.map(irm => {
            return {
              port: irm.port, // Redis port
              host: irm.host, // Redis host
            }
          })
        //   // 单机
        //   if (MEMBERS.length === 1) {
        //     this.redis = new Redis({ ...MEMBERS[0], ...basicConf });
        //   } else {
        //     // 集群
        //     this.redis = new Redis.Cluster(MEMBERS, {
        //       clusterRetryStrategy: basicConf.retryStrategy,
        //       enableReadyCheck: false,
        //       redisOptions: {
        //         reconnectOnError: basicConf.reconnectOnError,
        //         family: global.RD_FAMILY, // 4 (IPv4) or 6 (IPv6)
        //         password: global.RD_PASSWORD,
        //         db: global.RD_DB,
        //       }
        //     });
        //   }
      
          if(global.REDIS_TEYP === 'standalone'){
            // 单机
            this.redis = new Redis({ ...MEMBERS[0], ...basicConf });
          } else if(global.REDIS_TEYP === 'cluster') {
            // 集群
            this.redis = new Redis.Cluster(MEMBERS, {
              clusterRetryStrategy: basicConf.retryStrategy,
              enableReadyCheck: false,
              redisOptions: {
                reconnectOnError: basicConf.reconnectOnError,
                family: global.RD_FAMILY, // 4 (IPv4) or 6 (IPv6)
                password: global.RD_PASSWORD,
                db: global.RD_DB,
              }
            });
          }else if(global.REDIS_TEYP === 'sentinel') {
            // 哨兵
            this.redis = new Redis({
              family: global.RD_FAMILY, 
              password: global.RD_PASSWORD,
              db: global.RD_DB,
              sentinels: REDIS_MEMBERS,
              name: global.RD_NAME,
            });
          } else {
            logUtil.pluginLogger.info('Redis', 'connect', 'redis参数异常！')
          }

      }
    } catch (error) {
      logUtil.pluginLogger.info('Redis', 'connect', error.message)
    }
    this.redis.on('connect',() => {
      logUtil.pluginLogger.info('Redis', 'connect', 'redis启动成功！')
    })
    this.redis.on('error',(err) => {
      logUtil.pluginLogger.info('Redis', 'error', err.mseeage)
    })
  }
  async set(sid, obj, type = "", time) {
    try {
      if (type != '') {
        await this.redis.set(sid, JSON.stringify(obj), type, time)
      } else {
        await this.redis.set(sid, JSON.stringify(obj))
      }
      logUtil.pluginLogger.info('Redis', 'set-' + sid, JSON.stringify(obj))
    } catch (e) {
      logUtil.pluginLogger.error('Redis', 'set-' + sid, JSON.stringify(e))
    }
    return sid;
  }
  async get(sid) {
    let data = await this.redis.get(sid);
    logUtil.pluginLogger.info('Redis', 'get-' + sid, data)
    if (data && typeof JSON.parse(data) == "object") {
      return JSON.parse(data);
    } else {
      if (data) {
        return data
      } else {
        return false
      }

    }
  }
  async incr(sid) {
    try {
      await this.redis.incr(sid)
      logUtil.pluginLogger.info('Redis', 'incr-' + sid, JSON.stringify(obj))
    } catch (e) {
      logUtil.pluginLogger.error('Redis', 'incr-' + sid, JSON.stringify(e))
    }
    return sid;

  }
}
let redisStore = new RedisStore()
const redisSocket = new Emitter(redisStore.redis);
module.exports = {
  redisStore: redisStore,
  redisSocket: redisSocket
}