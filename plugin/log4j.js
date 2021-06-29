/**
 * doc
 * https://wangwl.net/static/pages/npm_log4js.html
 */
let log4js = require('log4js');
let logConfig = require('./logConfig');
let {formatHttpRes,formatHttpError,formatDbInfo} = require('../util/logtools')
//加载配置文件
log4js.configure(logConfig);
let logUtil = {};
// 请求日志特殊处理
let httpLogger = log4js.getLogger('http');
let pluginLogger = log4js.getLogger('plugin');
let serviceLogger = log4js.getLogger('service');
let systemLogger = log4js.getLogger('system');
let dbLogger = log4js.getLogger('db');

// 封装请求日志
logUtil.httpLogger = {
    info:(ctx, resTime)=>{
        httpLogger.info(formatHttpRes(ctx, resTime));
    },
    error:(ctx, error, resTime)=>{
        httpLogger.error(formatHttpError(ctx, error, resTime));
    }
}
logUtil.dbLogger = {
    info:(log,detail)=>{
        if (log) {
            dbLogger.info(formatDbInfo(log,detail));
        }
    },
}
logUtil.serviceLogger ={
    info:(type,fn,log)=>{
        if (log) {
            serviceLogger.info('【SERVICE】服务名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
        }
    },
    debug:(type,fn,log)=>{
        if (log) {
            serviceLogger.debug('【SERVICE】服务名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
        }
    },
    error:(type,fn,log)=>{
        if (log) {
            serviceLogger.error('【SERVICE】服务名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
        }
    },
    warn:(type,fn,log)=>{
        if (log) {
            serviceLogger.warn('【SERVICE】服务名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
        }
    },
}
logUtil.pluginLogger = {
    info:(type,fn,log)=>{
        if (log) {
            if(type == 'axios'){
                pluginLogger.info('【PLUGIN】插件名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+formatHttpRes({
                    status:log.status,
                    body:log.data,
                    request:{
                        method:log.request.method,
                        originalUrl:log.request.res.responseUrl,
                        ip:global.localIP,
                        query:log.config.params,
                        requestStartTime:()=>{
                            return 0
                        },
                        body:log.config.data
                    }
                },0)+'】');
            }else{
                pluginLogger.info('【PLUGIN】插件名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
            }
            
        }
    },
    error:(type,fn,log)=>{
        if (log) {
            pluginLogger.error('【PLUGIN】插件名:'+'【'+type+'】'+'方法名:【'+fn+'】'+'输出:【'+log+'】');
        }
    },
}
module.exports = logUtil;