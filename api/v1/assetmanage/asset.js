var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { setUserTableList,getUserTableList } = require('../../../controller/assetmanage/asset');
router
.get('/getconfig',datalize.query([
    field('userid').required(), //用户id
  ]),async(ctx, next)=>{
    try {
        await getUserTableList(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
})
.post('/setconfig',datalize([
    field('userid').required(), //用户id
    field('config').required() //配置
]), async(ctx, next)=>{
    try {
        console.log('-----------------')
        await setUserTableList(ctx, next);
    } catch (error) {
        ctx.fail('系统错误',500,error.message)
    }
})
module.exports = router