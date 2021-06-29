module.exports = {
    systemupdate: async(ctx, next) =>{
        ctx.CheckSystem.emit('update-status',ctx.request.body)
        ctx.success({})
    },
}