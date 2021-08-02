/**
 * doc
 * https://my.oschina.net/u/4609891/blog/4775908
 */
const Redis = require('ioredis');
const logUtil = require('./log4j');
class RedisStore {
    constructor() {
        this.redis = new Redis({
            port: global.RD_PORT, // Redis port
            host: global.RD_HOST, // Redis host
            family: global.RD_FAMILY, // 4 (IPv4) or 6 (IPv6)
            password: global.RD_PASSWORD,
            db: global.RD_DB,
            retryStrategy(times){
              const delay = Math.min(times * 50, 2000);
              return delay;
            },
            reconnectOnError(err) {
              const targetError = "READONLY";
              if (err.message.includes(targetError)) {
                return true;
              }
            }
        });
        this.redis.connect(() => {
          logUtil.pluginLogger.info('Redis','connect','redis启动成功！')
        })
      }
      async set(sid,obj,type="",time){
        try {
          if(type!=''){
            await this.redis.set(sid, JSON.stringify(obj),type,time)
          }else{
            await this.redis.set(sid, JSON.stringify(obj))
          }
          logUtil.pluginLogger.info('Redis','set-'+sid,JSON.stringify(obj))
        } catch (e) {
          logUtil.pluginLogger.error('Redis','set-'+sid,JSON.stringify(e))
        }
        return sid;
      }
      async get(sid){
        let data = await this.redis.get(sid);
        logUtil.pluginLogger.info('Redis','get-'+sid,data)
        if (data && typeof JSON.parse(data) == "object") {
          return JSON.parse(data);
        }else{
          if(data){
            return data
          }else{
            return false
          }
          
        }
      }
      async incr(sid){
        try {
          await this.redis.incr(sid)
          logUtil.pluginLogger.info('Redis','incr-'+sid,JSON.stringify(obj))
        } catch (e) {
          logUtil.pluginLogger.error('Redis','incr-'+sid,JSON.stringify(e))
        }
        return sid;
        
      }
}
let redisStore = new RedisStore()
module.exports = {
    redisStore:redisStore
}