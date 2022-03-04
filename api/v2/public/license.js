var router = require('koa-router')()
const { updateLicenseOss } = require('../../../controller/license/index');
router
.post('/update', async(ctx, next)=>{
    try {
        await updateLicenseOss(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
})
module.exports = router