var router = require('koa-router')()
const datalize = require('datalize');
const field = datalize.field;
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs')
const { getList, getInfo, addIpInfo,editIpInfo,delIpInfo } = require('../../../../controller/northport/list');
router
.get('/getlist',datalize.query([
    field('pageNo').required().min(1), //当前页码
    field('pageSize').required().min(1), //页面条数
  ]),async (ctx, next) => {
    try {
      await getList(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.get('/getinfo',datalize.query([
    field('id').required(), //规则id
  ]),async (ctx, next) => {
    try {
      await getInfo(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.get('/del',datalize.query([
  field('id').required(), //规则id
]),async (ctx, next) => {
  try {
    await delIpInfo(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
.post('/add',datalize([
    field('ip').required().isIp(), //ip
    field('isOpen').required() //是否开启
  ]),async (ctx, next) => {
    try {
      await addIpInfo(ctx, next);
    } catch (error) {
      ctx.fail('系统错误',-1,error.message)
    }
})
.post('/edit',datalize([
  field('id').required(), //ip
  field('ip').required().isIp(), //ip
  field('accesscert'), //访问凭证
  field('certTime') //凭证有效时间
]),async (ctx, next) => {
  try {
    await editIpInfo(ctx, next);
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
.post('/getaccesscert',datalize([
  field('time').required(), //时间 60, "2 days", "10h", "7d"
]),async (ctx, next) => {
  try {
    const { time } = ctx.request.body
    const { ip } = ctx.request
    const visitIp = ip.replace('::ffff:', '');
    const token = jwt.sign({
      visitIp:visitIp
    }, global.JWT_TOKEN, { expiresIn: Number(time) });
    ctx.success({
      accesscert:token,
      certTime:dayjs().add(Number(time), 'day').unix()
    })
  } catch (error) {
    ctx.fail('系统错误',-1,error.message)
  }
})
module.exports = router