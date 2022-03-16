const fse = require('fs-extra');
const path = require('path'); // 图片路径
const minio = require('../../plugin/minio');
module.exports = {
    //上传分片
    updateFile: async (ctx, next) => {

        const { ip, body } = ctx.request
        const visitIp = ip.replace('::ffff:', '');
        let LOCK_DATA = await ctx.redisStore.get('system:updatelock:data')
        console.log(LOCK_DATA)
        const fileNameArr = ctx.request.files.file.name.split('.')
        const chunkDir = `./public/share/temp/${fileNameArr[0]}`
        const NEW_LOCK_DATA = {
            visitIp: visitIp,
            type: body.type,
            index: body.index,
            userId: body.userid
        }
       
        if (LOCK_DATA) {
           
            if (LOCK_DATA.type == body.type) {
                console.log('*******************************',LOCK_DATA)
                if (LOCK_DATA?.userId != body.userid) {
                    // 有用户正在升级,锁定
                    ctx.fail('上传失败', 50001, '已存在升级上传任务，请稍后重试！')
                    return
                } else {
                    if (LOCK_DATA?.visitIp != visitIp && fse.existsSync(chunkDir)) {
                        // ip发生变化，清空重新上传
                        await fse.remove(chunkDir)
                    }
                    if (body.index === '0' && fse.existsSync(chunkDir)) {
                        // 切片发生变化，清空
                        await fse.remove(chunkDir)
                    }
                }
            }
        } else if (body.index !== '0') {
            ctx.fail('上传失败', 50001, '任务已过期，请重新上传')
        }
        ctx.redisStore.set('system:updatelock:data', NEW_LOCK_DATA, 'EX', 3600 * 24)
        if (!fse.existsSync(chunkDir)) {// 没有目录就创建目录
            await fse.mkdirs(chunkDir)
        }
        const dPath = path.join(chunkDir, fileNameArr[1])
        await fse.move(ctx.request.files.file.path, dPath, { overwrite: true })
        ctx.success({})

    },
    //合并切片
    mergeFile: async (ctx, next) => {
        const { name } = ctx.request.body
        const fname = name.split('.')[0]
        const chunkDir = path.join(`./public/share/temp/`, fname)
        const chunks = await fse.readdir(chunkDir)
        chunks.sort((a, b) => a - b).map(chunkPath => {
            // 合并文件
            fse.appendFileSync(
                path.join(`./public/share/`, name),
                fse.readFileSync(`${chunkDir}/${chunkPath}`)
            )
        })
        fse.removeSync(chunkDir)
        if (fse.existsSync('/mnt/download')) {
            await fse.move(`./public/share/${name}`, `/mnt/download/${name}`, { overwrite: true })
        }
        ctx.success({ url: `/mnt/download/${name}` })
    },
    //合并切片
    mergeFileOss: async (ctx, next) => {
        const { name } = ctx.request.body
        const fname = name.split('.')[0]
        const chunkDir = path.join(`./public/share/temp/`, fname)
        const chunks = await fse.readdir(chunkDir)
        chunks.sort((a, b) => a - b)
        for(let i = 0; i < chunks.length; i++){
            const chunkPath = chunks[i];
            // 合并文件
            await fse.appendFileSync(
                path.join(`./public/share/`, name),
                fse.readFileSync(`${chunkDir}/${chunkPath}`)
            )
        }
        const bucketName = 'uecm-download';
        await fse.removeSync(chunkDir)
        
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
        let bucketFileName = fileName.join('.');
        // 暂时去掉括号
        bucketFileName = bucketFileName.split('(')?.join('')?.split(')')?.join('') || bucketFileName;
        // 上传文件到储存桶
        await minio.putObject(bucketName, bucketFileName, fse.createReadStream(`./public/share/${name}`), () => {
            // 删除
            fse.remove(`./public/share/${name}`)
        })      
        ctx.success({ url: `/k8s-oss/${bucketName}/${bucketFileName}` })
    }
}