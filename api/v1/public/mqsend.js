var router = require('koa-router')()
router
.post('/sendToQueue',async(ctx,next)=>{
    try {
        function generateUuid() {
            return (
              Math.random().toString() +
              Math.random().toString() +
              Math.random().toString()
            )
          }
        const asd = await ctx.rpcMq.sendQueueMsg('e_direct_dc_galaxy',generateUuid(),{
            "service": 2006, // 源服务
            "target":2004,  // 目的服务
            "taskUrl": "sysConfigService-getSysConfigByName",
            "data": "{\"name\":\"color\"}"
        })
        console.log(asd)
        ctx.success(asd)
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
module.exports = router