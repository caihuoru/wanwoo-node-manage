const Koa = require('koa')
const app = new Koa({
  proxy:true,
  maxIpsCount:0,
  keys:global.APP_COOKIE
})
const json = require('koa-json')
const body = require('koa-body');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');

//根据目录构建路由结构
const composeRouter = require('./middleware/composeRouter')
//返回值封装
const routerResponse = require('./middleware/routerResponse')
//校验参数
const datalizeVerify = require('./middleware/datalizeVerify')
//JWT
const jwtVerify = require('./middleware/jwtVerify')
//日志
const loggers = require('./middleware/loggers')
const { initPlugin } = require('./plugin');
// 注册插件
initPlugin(app)
// middlewares
app.use(cors());//允许跨域
app.use(loggers());// 本地log
app.use(body({
  multipart: true, // 支持文件上传
  formidable:{
    keepExtensions: true,    // 保持文件的后缀
    maxFileSize:20 * 1024 * 1024, // 文件上传大小
  }
}))
app.use(json({ limit: '50mb' }))
app.use(routerResponse())
app.use(jwtVerify())
//JWT
app.use(koajwt({
  secret: global.JWT_TOKEN
}).unless({
  path: [
    /^\/v1\/public/,
    /^\/v1\/assetmanage/,
    /^\/v1\/northport/,
    /^\/v1\/webhook/,
  ]
}))
app.use(require('koa-static')(__dirname + '/public'))
app.use(datalizeVerify())
// routes
app.use(composeRouter(__dirname + '/api').routes());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
