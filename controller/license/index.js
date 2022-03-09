const fse = require('fs-extra');
const path = require('path'); // 图片路径
const dayjs = require('dayjs');
const minio = require('../../plugin/minio');

module.exports ={
    //上传分片
    updateLicense: async(ctx, next) =>{
        const { ip } = ctx.request

        const adminToken = ctx.header['admin-token']
        const moduleKey = ctx.header['modulekey']
        const userKey = 'authLocal:user:token:'
        const groupKey = 'authLocal:user:groupPermission:'
        const gropInfoKey = 'authLocal:groupInfo'
        const userInfo = {}
        const visitIp = ip.replace('::ffff:', '');
        if (adminToken) {
            const refreshToken = adminToken.split(" ")[0];
            const userName = await ctx.redisStore.get(userKey + refreshToken)
            if (userName) {
                const userNames = userName.replace(/\"/g, '')
                const userGroup = await ctx.redisStore.get(groupKey + userNames)
                const userGroupInfo = await ctx.redisStore.get(gropInfoKey + userGroup[0])
                userInfo.userName = userNames
                userInfo.groupCode = userGroupInfo.groupCode
                userInfo.groupName = userGroupInfo.name
            }
        }
        let chunkDir = path.join('./public/share/license/uecm_license.lid');
        await fse.move(ctx.request.files.file.path, chunkDir, { overwrite: true })
        if(fse.existsSync('/mnt/download')){
            await fse.move(`./public/share/license/uecm_license.lid`, `/mnt/download/uecm_license.lid`, { overwrite: true })
            await new Promise(function(reslove){
                setTimeout(()=>{reslove()},10000)
            })
            ctx.success({url:`/mnt/download/uecm_license.lid`})
        }else{
            ctx.fail('系统错误',500)
        }

        let optionResult = '失败'
        if (ctx.request.response.status >= 200 && ctx.request.response.status < 300) {
            if (ctx.request.response.body.code === 0) {
                optionResult = '成功'
            }
        }
        logsMsg = {
            threadId: process.pid,
            crateTime: dayjs().valueOf(),
            userName: userInfo.userName,
            groupCode: userInfo.groupCode,
            groupName: userInfo.groupName,
            uri: ctx.request.url,
            optionName: '更新License授权文件',
            optionType: 'UPDATA',
            // 模块名称,这个值需要从请求中获取 modulekey 
            modeName: moduleKey,
            // 操作结果")
            optionResult: optionResult,
            params: ctx.request.files.file.name,
            ips: visitIp
        }
        // 推送消息到指定交换机 并约定推送队列及消息标识
        const flasg = ctx.pubsubMq.sendMsg('topicExchangeFrontOperatorLog', 'topicRoutingFrontOperatorLog', logsMsg)
        if (flasg) {
            console.log('发送成功')
        }
    },
    //上传分片
    updateLicenseOss: async(ctx, next) =>{
        const { ip } = ctx.request
        let ossPath = '';
        const adminToken = ctx.header['admin-token']
        const moduleKey = ctx.header['modulekey']
        const userKey = 'authLocal:user:token:'
        const groupKey = 'authLocal:user:groupPermission:'
        const gropInfoKey = 'authLocal:groupInfo'
        const userInfo = {}
        const visitIp = ip.replace('::ffff:', '');
        const name = ctx.request.files.file.name;
        if (adminToken) {
            const refreshToken = adminToken.split(" ")[0];
            const userName = await ctx.redisStore.get(userKey + refreshToken)
            if (userName) {
                const userNames = userName.replace(/\"/g, '')
                const userGroup = await ctx.redisStore.get(groupKey + userNames)
                const userGroupInfo = await ctx.redisStore.get(gropInfoKey + userGroup[0])
                userInfo.userName = userNames
                userInfo.groupCode = userGroupInfo.groupCode
                userInfo.groupName = userGroupInfo.name
            }
        }
        if(fse.existsSync('/mnt/download')){
            const bucketName = 'uecm-license';
            
            // 验证储存桶， 不存在则去创建
            const getBucket = await minio.bucketExistsOrmakeBucket(bucketName);
            if(!getBucket){
                // 创建存储桶
                await minio.makeBucket(bucketName, 'us-east-1');
                await minio.setBucketPolicy(bucketName);
            }
            // 生成存储名字
            const fileName = name.split('.');
            fileName[0] =  `${fileName[0]}-${new Date().getTime()}`;
            const bucketFileName = fileName.join('.');

            // 上传文件到储存桶
            await minio.putObject(bucketName, `/license/${bucketFileName}`, fse.createReadStream(`${ctx.request.files.file.path}`), () => {
                // 删除
                // fse.remove(`./public/share/license/${bucketFileName}`)
            })      
            await new Promise(function(reslove){
                setTimeout(()=>{reslove()},10000)
            })
            ossPath = `${bucketName}/license/${bucketFileName}`;
            ctx.success({ url: `${ossPath}` })
        }else{
            ctx.fail('系统错误',500)
        }

        let optionResult = '失败'
        if (ctx.request.response.status >= 200 && ctx.request.response.status < 300) {
            if (ctx.request.response.body.code === 0) {
                optionResult = '成功'
            }
        }
        logsMsg = {
            threadId: process.pid,
            crateTime: dayjs().valueOf(),
            userName: userInfo.userName,
            groupCode: userInfo.groupCode,
            groupName: userInfo.groupName,
            ossPath,
            uri: ctx.request.url,
            optionName: '更新License授权文件',
            optionType: 'UPDATA',
            // 模块名称,这个值需要从请求中获取 modulekey 
            modeName: moduleKey,
            // 操作结果")
            optionResult: optionResult,
            params: ctx.request.files.file.name,
            ips: visitIp
        }
        // 推送消息到指定交换机 并约定推送队列及消息标识
        const flasg = ctx.pubsubMq.sendMsg('topicExchangeFrontOperatorLog', 'topicRoutingFrontOperatorLog', logsMsg)
        if (flasg) {
            console.log('发送成功')
        }
    },
}