const jwt = require('jsonwebtoken');
const ipTime = async (ctx)=>{
    const { ip } = ctx.request
    const visitIp = ip.replace('::ffff:', '');
    let ipObj = await ctx.redisStore.get('system:node:'+visitIp)
    if(ipObj){
        if(ipObj>=2){
            await ctx.redisStore.set('system:node:'+visitIp,3,'EX',process.env.JWT_IP_TIME)
        }else{
            ipObj = Number(ipObj)+1
            await ctx.redisStore.set('system:node:'+visitIp,ipObj,'EX',process.env.JWT_IP_TIME)
        }
    }else{
        await ctx.redisStore.set('system:node:'+visitIp,1,'ex',process.env.JWT_IP_TIME)
    }
}
const jwtVerify = () => {
    return async(ctx, next) =>{
        try {
            const authorization = ctx.get('Authorization')
            // 检验 token 是否已过期
            if(authorization!=''){
                const token = authorization.split(' ')[1]
                try {
                    const payload =  await jwt.verify(token, global.JWT_TOKEN)
                    console.log('payloadpayloadpayload',payload)
                    // ctx.jwtId = payload.redis_id
                } catch (err) {
                    ctx.fail('token过期！！',401,{})
                    return
                }
            }
            await next().catch(async(err)=>{
                if (err.status === 401) {
                    ipTime(ctx)
                    ctx.fail('请登录！！',401,{})
                }else {
                    ctx.fail('系统错误',401,err.message)
                }
            })
        } catch (error) {
            ctx.fail('系统错误',401,error.message)
        }
    }
}
module.exports = jwtVerify