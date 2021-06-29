const {Op} = require('sequelize');
const pngToIco = require('png-to-ico');
const fse = require('fs-extra');
module.exports = {
    updatetopath:async(ctx, next) =>{
        const extend_name = ctx.request.body.name
        const bitmap = ctx.request.body.content.split(',')[1].slice(0,-2)
        let index = bitmap.lastIndexOf('=')
        if(index!==-1){
            index = bitmap.charAt(index-1)==='#'?-2:-1
            bitmap = bitmap.slice(0,index)
        }
        const buffer = Buffer.from(bitmap,'base64')
        let date = new Date()
        let timeStamp = date.valueOf()
        if (!fse.existsSync(`./public/upload/`)) {// 没有目录就创建目录
            await fse.mkdirs(`./public/upload/`)
        }
        if(ctx.request.body.type == '5'){
            let path =`./public/upload/${timeStamp}${extend_name}`
            await fse.writeFile(path,buffer,async function(err){
                if(err){
                    return errdata(err);
                }
            })
            let imgUrl  = `/upload/${timeStamp}${extend_name.split('.')[0]}.ico`
            let obj = {
                name: '',
                type:'',
                url:'',
                time:'',
            }
            obj.name = ctx.request.body.name
            obj.type = ctx.request.body.type
            obj.url = imgUrl
            obj.time = date
            await ctx.db.FileUpdateHist.create(obj)
            pngToIco(path).then(buf => {
                fse.writeFileSync(`./public/upload/${timeStamp}${extend_name.split('.')[0]}.ico`, buf);
            }).catch(console.error);
            ctx.success({'url':imgUrl},'上传成功!')
        }else{
            let path =`./public/upload/${timeStamp}${extend_name}`
            let imgUrl  = `/upload/${timeStamp}${extend_name}`
            let obj = {
                name: '',
                type:'',
                url:'',
                time:'',
            }
            obj.name = ctx.request.body.name
            obj.type = ctx.request.body.type
            obj.url = imgUrl
            obj.time = date
            await ctx.db.FileUpdateHist.create(obj)
            await fse.writeFile(path,buffer,async function(err){
                if(err){
                    return errdata(err);
                }
            })
            ctx.success({'url':imgUrl},'上传成功!')
        }
    },
}