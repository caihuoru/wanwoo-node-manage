var router = require('koa-router')()
const { updateLicense } = require('../../../controller/license/index');
router
.post('/update', async(ctx, next)=>{
    try {
        await updateLicense(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
})
module.exports = router