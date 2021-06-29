const {Op} = require('sequelize');
module.exports = {
    getHookType: async(ctx, next)=>{
        let { pageNo, pageSize, type} = ctx.request.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                type ? { type: { [Op.like]: `%${type}%` } } : {},
                {isOpen:{ [Op.like]: 1}}
                // logtype ? { logType: { [Op.like]: `%${logtype}%` } } : {},
                // createTimes ? { createdTime: { [Op.between]: createTimes } } : {}
            ]
        }
        const listInfo =  await ctx.db.HookType.findAndCountAll({
            where:Filter,
            //offet去掉前多少个数据
            offset,
            attributes: ['id','value','type','isOpen','remarks'],
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
    addHookType: async(ctx, next)=>{
        await ctx.db.HookType.create(ctx.request.body)
        ctx.success({})
    },
    delHookType: async(ctx, next)=>{
        let {id} = ctx.request.query
        const idInfo = await ctx.db.HookType.destroy({
            where: {
                id: id
            }
        })
        if(idInfo){
            ctx.success({})
        }else{
            ctx.fail('删除失败',40001,'不存在该配置')
        }
    },
    editHookType: async(ctx, next)=>{
        // await ctx.db.HookType.findOrCreateByother(ctx.request.body,"id")
        const {id} = ctx.request.body
        const ipInfo =  await ctx.db.HookType.update(ctx.request.body,
            {
                where: { id }
            }
        )
        if(ipInfo[0]){
            ctx.success({})
        }else{
            ctx.fail('查询错误',40001,'不存在该配置')
        }
        ctx.success({})
    },
    getRule: async(ctx, next)=>{
        let { pageNo, pageSize, type} = ctx.request.query
        let offset = (Number(pageNo) - 1) * Number(pageSize);
        const Filter = {
            [Op.and]: [
                type ? { type: { [Op.like]: `%${type}%` } } : {}
                // logtype ? { logType: { [Op.like]: `%${logtype}%` } } : {},
                // createTimes ? { createdTime: { [Op.between]: createTimes } } : {}
            ]
        }
        const listInfo =  await ctx.db.HookRule.findAndCountAll({
            where:Filter,
            //offet去掉前多少个数据
            offset,
            attributes: ['id','rulesName','callbackAddress','secretKey','dataType', 'hooklist' ,'isEncrypt', 'isOpen','secretKey'],
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
    addRule: async(ctx, next)=>{
        const { dataType, hooklist } =  ctx.request.body
        await ctx.db.sequelize.transaction( async (t)=>{
            const ruleInfo = await ctx.db.HookRule.create(ctx.request.body,{ transaction: t})
            const hooklistArr = hooklist.map(item=>{
                return {ruleId:ruleInfo.id,hookId:item}
            })
            hooklistArr.push({
                ruleId:ruleInfo.id,hookId:dataType
            })
            await ctx.db.RuleHookType.bulkCreate(hooklistArr,{},{ transaction: t})
        })
        ctx.success({})
    },
    editRule: async(ctx, next)=>{
        const {id,dataType, hooklist} = ctx.request.body
        await ctx.db.sequelize.transaction( async (t)=>{
            await ctx.db.HookRule.findOrCreateByother(ctx.request.body,"id",)
            await ctx.db.RuleHookType.destroy({
                where: {
                    'ruleId': id
                }
            },{ transaction: t})
            const hooklistArr = hooklist.map(item=>{
                return {ruleId:id,hookId:item}
            })
            hooklistArr.push({
                ruleId:id,hookId:dataType
            })
            await ctx.db.RuleHookType.bulkCreate(hooklistArr,{},{ transaction: t})
        })
        ctx.success({})
    },
    delRule: async(ctx, next)=>{
        let {id} = ctx.request.query
        const idInfo = await ctx.db.HookRule.destroy({
            where: {
                id: id
            }
        })
        await ctx.db.RuleHookType.destroy({
            where: {
                'ruleId': id
            }
        })
        if(idInfo){
            ctx.success({})
        }else{
            ctx.fail('删除失败',40001,'不存在该配置')
        }
    }
}