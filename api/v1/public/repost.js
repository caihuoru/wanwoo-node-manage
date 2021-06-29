var router = require('koa-router')()
const { systemupdate } = require('../../../controller/repost/index');
router
.post('/socket',async(ctx,next)=>{
    try {
        await systemupdate(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
module.exports = router