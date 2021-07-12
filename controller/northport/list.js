const {Op} = require('sequelize');
const {randomString} = require('../../util/lib')
module.exports = {
    getList:async (ctx, next)=>{
        let { pageNo, pageSize} = ctx.request.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                {}
                // apiurl ? { url: { [Op.like]: `%${apiurl}%` } } : {},
                // logtype ? { logType: { [Op.like]: `%${logtype}%` } } : {},
                // createTimes ? { createdTime: { [Op.between]: createTimes } } : {}
            ]
        }
        const listInfo =  await ctx.db.NorthPortList.findAndCountAll({
            where:Filter,
            //offet去掉前多少个数据
            offset,
            attributes: ['id','ip','accesscert','isOpen', 'certTime','remarks'],
            //limit每页数据数量
            limit: Number(pageSize)
        })
        ctx.success({
            pages: Math.ceil(listInfo.count/Number(pageSize)),
            records: listInfo.rows,
            total: listInfo.count,
            current: Number(pageNo),
            size: Number(pageSize)
        })
    },
    getInfo: async(ctx, next)=>{
        let {id} = ctx.request.query
        const Filter = { id:  id } //精准查询
        const idInfo = await ctx.db.NorthPortList.findAll({
            where: Filter,
            attributes: ['id','ip','accesscert','certTime','remarks','isOpen'],
        })
        console.log(idInfo)
        if(idInfo?.length){
            ctx.success(idInfo[0].dataValues)
        }else{
            ctx.fail('查询错误',40001,'不存在该配置')
        }
    },
    addIpInfo:async (ctx, next)=>{
        await ctx.db.NorthPortList.create(Object.assign(ctx.request.body,{
            secretKey: randomString(32)
        }))
        ctx.success({})
    },
    editIpInfo:async (ctx, next)=>{
        const {id,ip,accesscert,certTime,isOpen,remarks} = ctx.request.body
        const ipInfo =  await ctx.db.NorthPortList.update({
            id,ip,accesscert,certTime,isOpen,remarks
        },
            {
                where: { id }
            }
        )
        if(ipInfo[0]){
            ctx.success({})
        }else{
            ctx.fail('查询错误',40001,'不存在该配置')
        }
    },
    getIpPond:(ctx)=>{
        return new Promise(async(resolve)=>{
            const listInfo =  await ctx.db.NorthPortList.findAndCountAll({
                where:{},
                attributes: ['ip']
            })
            const ippondList = listInfo.rows.map((item)=>{
                return item.ip
            })
            resolve({ippondList})
        })        
    },
    delIpInfo: async(ctx, next)=>{
        let {id} = ctx.request.query
        const idInfo = await ctx.db.NorthPortList.destroy({
            where: {
                id: id
            }
        })
        if(idInfo){
            ctx.success({})
        }else{
            ctx.fail('删除失败',40001,'不存在该配置')
        }
    }
}