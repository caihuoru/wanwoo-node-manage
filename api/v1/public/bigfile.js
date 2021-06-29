var router = require('koa-router')()
const { updateFile,mergeFile } = require('../../../controller/bigfile/index');
router
.post('/upload', async (ctx, next) => {
    try {
        await updateFile(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
  .post('/merge', async (ctx, next) => {
    try {
        await mergeFile(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
module.exports = router