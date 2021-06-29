const logUtil = require('../plugin/log4j');
const loggers = () => {
    return async (ctx, next) => {
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        let ms;
        try {
            //开始进入到下一个中间件
            await next();
            ms = new Date() - start;
            //记录响应日志
            logUtil.httpLogger.info(ctx, ms);
        } catch (error) {
            ms = new Date() - start;
            //记录异常日志
            logUtil.httpLogger.error(ctx, error, ms);
        }
    }
}

module.exports = loggers