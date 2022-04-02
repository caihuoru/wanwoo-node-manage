const { redisSocket } = require('../../plugin/redis');
module.exports = {
    systemupdate: async(ctx, next) =>{
        redisSocket.emit('update-status',ctx.request.body)
        // ctx.CheckSystem.emit('update-status',ctx.request.body)
        ctx.success({})
    },
}