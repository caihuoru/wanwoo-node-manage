var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { updatetopathOss } = require('../../../controller/systemimg/index');
router
.post('/update',datalize([
    field('name').required(), //文件名
    field('type').required(), //文件用途 1 登录背景
    field('content').required().isBase64(), //文件base64
]),async (ctx, next) => {
    try {
        await updatetopathOss(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
})
module.exports = router