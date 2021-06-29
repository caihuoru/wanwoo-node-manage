const { getIpPond } = require('../controller/northport/list');
function ipdisabled(){
    return async function(ctx,next){
        const { ip, url } = ctx.request
        const visitIp = ip.replace('::ffff:', '');
        const {ippondList} = await getIpPond(ctx)
        // 在限制接口地址标识中
        if(url.indexOf("/northport/client/")!=-1){
            // 没有在访问列表ip
            if(ippondList.includes(visitIp)){
                const ippond = await ctx.redisStore.get('system:node:'+visitIp)
                if(ippond>=3){
                    ctx.fail('系统错误',40003,'ip已被锁定!')
                }else{
                    await next()
                }
            }else{
                ctx.fail('未授权ip',40002,'请向管理员申请增加ip授权!')
            }
        }else{
            await next()
        }
        
        
    }
}
module.exports= ipdisabled