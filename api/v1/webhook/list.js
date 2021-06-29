var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const { getHookType, addHookType, editHookType, delHookType, getRule, addRule, editRule, delRule } = require('../../../controller/webkook/list');
router
.get('/hooktypelist',datalize.query([
  field('pageNo').required().min(1), //当前页码
  field('pageSize').required().min(1), //页面条数
  field('type').required(), //数据类型
]),async (ctx, next) => {
    try {
      await getHookType(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.post('/addhooktype',datalize([
    field('value').required(), //事件名称
    field('isOpen').required(), //是否启用
    field('type').required(), //数据类型
  ]),async (ctx, next) => {
    try {
      await addHookType(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.post('/edithooktype',datalize([
  field('id').required(), //ip
  field('value').required(), //事件名称
  field('isOpen').required(), //是否启用
  field('type').required(), //数据类型
]),async (ctx, next) => {
  try {
    await editHookType(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
.get('/delhooktype',datalize.query([
  field('id').required(), //规则id
]),async (ctx, next) => {
  try {
    await delHookType(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
.get('/rulelist',datalize.query([
  field('pageNo').required().min(1), //当前页码
  field('pageSize').required().min(1), //页面条数
]),async (ctx, next) => {
    try {
      await getRule(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.post('/addrule',datalize([
    field('rulesName').required(), //规则名称
    field('callbackAddress').required(), //回调地址
    field('dataType').required(), //请求格式
    field('hooklist').required().array(), //触发事件
    field('isEncrypt').required(), //是否加密
    field('isOpen').required(), //是否启用
  ]),async (ctx, next) => {
    try {
      await addRule(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.post('/editrule',datalize([
  field('id').required(), //id
  field('rulesName').required(), //规则名称
  field('callbackAddress').required(), //回调地址
  field('dataType').required(), //请求格式
  field('hooklist').required().array(), //触发事件
  field('isEncrypt').required(), //是否加密
  field('isOpen').required(), //是否启用
]),async (ctx, next) => {
  try {
    await editRule(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
.get('/delrule',datalize.query([
  field('id').required(), //规则id
]),async (ctx, next) => {
  try {
    await delRule(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
module.exports = router