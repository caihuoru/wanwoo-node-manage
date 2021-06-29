const fse = require('fs-extra');
const path = require('path'); // 图片路径
module.exports ={
    //上传分片
    updateFile: async(ctx, next) =>{
        console.log(ctx.request.files)
        const fileNameArr = ctx.request.files.file.name.split('.')
        const chunkDir = `./public/share/temp/${fileNameArr[0]}`
        if (!fse.existsSync(chunkDir)) {// 没有目录就创建目录
            await fse.mkdirs(chunkDir)
        }
        const dPath = path.join(chunkDir, fileNameArr[1])
        await fse.move(ctx.request.files.file.path, dPath, { overwrite: true })
        ctx.success({})
    },
    //合并切片
    mergeFile: async(ctx, next) =>{
        const { name }= ctx.request.body
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
        if(fse.existsSync('/mnt/download')){
            await fse.move(`./public/share/${name}`, `/mnt/download/${name}`, { overwrite: true })
        }
        ctx.success({url:`/mnt/download/${name}`})
    }
}