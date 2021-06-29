const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
function requireRouters(base_path,file_path){
    let files = fs.readdirSync(base_path + file_path);
    files.forEach(file=>{
        let file_name = base_path + file_path + file
        if(fs.statSync(file_name).isFile() && path.extname(file_name)==='.js'){
            let inner_router = require(file_name)
            let base_router = file_path + file.substring(0,file.length-3)
            router.use(base_router,inner_router.routes())
        }else{
            requireRouters(base_path,`${file_path}${file}/`)
        }
    })
}
module.exports = (routerPath)=>{
    let base_path = routerPath
    let file_path = '/'
    requireRouters(base_path,file_path)
    return router
}