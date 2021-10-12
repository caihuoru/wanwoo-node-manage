const router = require('koa-router')();
router.get('/status', ctx=>{
    ctx.body = 'OK'
})
module.exports = router