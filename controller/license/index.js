const fse = require('fs-extra');
const path = require('path'); // 图片路径
module.exports ={
    //上传分片
    updateLicense: async(ctx, next) =>{
        let chunkDir = path.join('./public/share/license/uecm_license.lid');
        await fse.move(ctx.request.files.file.path, chunkDir, { overwrite: true })
        if(fse.existsSync('/mnt/download')){
            fse.move(`./public/share/license/uecm_license.lid`, `/mnt/download/uecm_license.lid`, { overwrite: true })
        }
        ctx.success({url:`/mnt/download/uecm_license.lid`})
    },
}