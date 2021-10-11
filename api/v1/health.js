const router = require('koa-router')();
router.get('/status', ctx=>{
    ctx.success({}, 'ok', 0)
})
module.exports = router