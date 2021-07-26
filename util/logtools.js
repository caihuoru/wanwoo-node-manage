module.exports = {
    formatHttpInfo:(req, resTime)=>{
        let logText = new String();
        let method = req.method;
        //访问方法
        logText += "request method: " + method + "\n";
        //请求原始地址
        logText += "request originalUrl:  " + req.originalUrl + "\n";
        //客户端ip
        logText += "request client ip:  " + req.ip + "\n";
        //开始时间
        // let startTime;
        //请求参数
        if (method === 'GET') {
            logText += "request query:  " + JSON.stringify(req.query) + "\n";
            // startTime = req.query.requestStartTime || req.requestStartTime;
        } else {
            logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
            // startTime = req.body.requestStartTime || req.requestStartTime;
        }
        //服务器响应时间
        logText += "response time: " + resTime + "ms\n";
        return logText;
    },
    formatHttpRes:(ctx, resTime)=>{
        let logText = new String();
        //响应日志开始
        logText += "\n" + "*************** response log start ***************" + "\n";
        //添加请求日志
        logText += module.exports.formatHttpInfo(ctx.request, resTime);
        //响应状态码
        logText += "response status: " + ctx.status + "\n";
        //响应内容
        logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";
        //响应日志结束
        logText += "*************** response log end ***************" + "\n";
        return logText;
    },
    formatHttpError:(ctx, err, resTime)=>{
        let logText = new String();
        //错误信息开始
        logText += "\n" + "*************** error log start ***************" + "\n";
        //添加请求日志
        logText += module.exports.formatHttpInfo(ctx.request, resTime);
        //错误名称
        logText += "err name: " + err.name + "\n";
        //错误信息
        logText += "err message: " + err.message + "\n";
        //错误详情
        logText += "err stack: " + err.stack + "\n";
        //错误信息结束
        logText += "*************** error log end ***************" + "\n";
        return logText;
    },
    formatDbInfo:(log, detail)=>{
        return '【数据库读写】 操作类型:【'+detail.type+'】' + '输出语句:【'+log+'】';
    }
}