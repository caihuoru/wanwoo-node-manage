const { Op } = require('sequelize');
const dayjs = require('dayjs')
const pngToIco = require('png-to-ico');
const fse = require('fs-extra');
module.exports = {
    updatetopath: async (ctx, next) => {
        const { ip, body } = ctx.request
        const extend_name = body.name
        const bitmap = body.content.split(',')[1].slice(0, -2)
        let index = bitmap.lastIndexOf('=')
        if (index !== -1) {
            index = bitmap.charAt(index - 1) === '#' ? -2 : -1
            bitmap = bitmap.slice(0, index)
        }
        const visitIp = ip.replace('::ffff:', '');
        const buffer = Buffer.from(bitmap, 'base64')
        let date = new Date()
        let timeStamp = date.valueOf()
        if (!fse.existsSync(`./public/upload/`)) {// 没有目录就创建目录
            await fse.mkdirs(`./public/upload/`)
        }

        const adminToken = ctx.header['admin-token']
        const moduleKey = ctx.header['modulekey']
        const userKey = 'authLocal:user:token:'
        const groupKey = 'authLocal:user:groupPermission:'
        const gropInfoKey = 'authLocal:groupInfo'
        const userInfo = {}
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
        optionsNameObj = {
            '4': 'Logo图',
            '3': 'Logo+白色文字图',
            '6': '原色Logo+文字图',
            '5': '网页标题Icon'
        }
        if (body.type == '5') {
            let path = `./public/upload/${timeStamp}${extend_name}`
            await fse.writeFile(path, buffer, async function (err) {
                if (err) {
                    return errdata(err);
                }
            })
            let imgUrl = `/upload/${timeStamp}${extend_name.split('.')[0]}.ico`
            let obj = {
                name: '',
                type: '',
                url: '',
                time: '',
            }
            obj.name = body.name
            obj.type = body.type
            obj.url = imgUrl
            obj.time = date
            await ctx.db.FileUpdateHist.create(obj)
            pngToIco(path).then(buf => {
                fse.writeFileSync(`./public/upload/${timeStamp}${extend_name.split('.')[0]}.ico`, buf);
            }).catch(console.error);
            ctx.success({ 'url': imgUrl }, '上传成功!')
        } else {
            let path = `./public/upload/${timeStamp}${extend_name}`
            let imgUrl = `/upload/${timeStamp}${extend_name}`
            let obj = {
                name: '',
                type: '',
                url: '',
                time: '',
            }
            obj.name = body.name
            obj.type = body.type
            obj.url = imgUrl
            obj.time = date
            await ctx.db.FileUpdateHist.create(obj)
            await fse.writeFile(path, buffer, async function (err) {
                if (err) {
                    return errdata(err);
                }
            })
            ctx.success({ 'url': imgUrl }, '上传成功!')
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
            optionName: optionsNameObj[body.type],
            optionType: 2,
            // 模块名称,这个值需要从请求中获取 modulekey 
            modeName: moduleKey,
            // 操作结果")
            optionResult: optionResult,
            params: `{name:${body.name},type:${body.type},content:'...'}`,
            ips: visitIp
        }
        // 推送消息到指定交换机 并约定推送队列及消息标识
        const flasg = ctx.pubsubMq.sendMsg('topicExchangeFrontOperatorLog', 'topicRoutingFrontOperatorLog', logsMsg)
        if (flasg) {
            console.log('发送成功')
        }
    },
}