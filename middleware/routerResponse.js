 function routerResponse(option={}){
    return async function(ctx,next){
        ctx.success = function (data,msg) {
            ctx.status = 200;
            ctx.type = option.type || 'json'
            ctx.body = {
                code : option.successCode || 0,
                message : msg || option.successMsg ||  'success',
                result : data || {}
            }
        }
        ctx.fail = function (msg,code,result) {
            ctx.status = 200;
            ctx.type = option.type || 'json'
            ctx.body = {
                code : code || option.failCode || 1,
                message : msg || option.successMsg || 'fail',
                result : result || {}
            }
        }
        await next()
    }
}
module.exports= routerResponse