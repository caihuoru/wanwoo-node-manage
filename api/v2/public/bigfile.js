var router = require('koa-router')()
const { updateFile, mergeFileOss, getOssUploadUrl } = require('../../../controller/bigfile/index');
router
.post('/upload', async (ctx, next) => {
    try {
        await updateFile(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error)
    }
  })
  .post('/merge', async (ctx, next) => {
    try {
        await mergeFileOss(ctx, next);
        next()
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
  .post('/getOssUploadUrl', async (ctx, next) => {
    try {
        await getOssUploadUrl(ctx, next);
        next()
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
  })
module.exports = router