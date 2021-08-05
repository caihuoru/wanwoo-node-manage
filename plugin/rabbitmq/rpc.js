const amqp = require('amqplib')
const logUtil = require('../log4j');
const fs = require('fs');
class RpcMq{
    constructor() {
        this.opts = {
            cert: [fs.readFileSync(global.RABBITMQ_CERTFILEPATH)],      // client cert
            key: [fs.readFileSync(global.RABBITMQ_KEYFILEPATH)],        // client key
            passphrase: global.RABBITMQ_PASSPHRASE, // passphrase for key
            ca: [fs.readFileSync(global.RABBITMQ_CAFILEPATH)],            // array of trusted CA certs
            rejectUnauthorized: false
        }
        
        this.open = amqp.connect({
            protocol: global.RABBITMQ_PROTOCOL,
            hostname: global.RABBITMQ_HOSTNAME,
            port: global.RABBITMQ_PORT,
            username: global.RABBITMQ_USERNAME,
            password: global.RABBITMQ_PASSWORD,
            locale: global.RABBITMQ_LOCALE,
            frameMax: global.RABBITMQ_FRAMEMAX,
            heartbeat: global.RABBITMQ_HEARTBEAT,
            vhost: global.RABBITMQ_VHOST
        },global.RABBITMQ_SSl?this.opts:null).catch(error=>{
            logUtil.pluginLogger.error('RabbitMq','connect',JSON.stringify(error))
        })
    }
    sendQueueMsg = (queueName,correlationId,data)=>{
        const self = this;
        return new Promise(async (resolve,reject)=>{
            const rabbitConn = await self.open
            const rabbitChannel = await rabbitConn.createChannel()
            // const rabbitQueue = await rabbitChannel.bindExchange(queueName,correlationId, { durable: 'true' })
            console.log('rabbitChannel',rabbitChannel)
            rabbitChannel.publish(queueName,'',Buffer.from(JSON.stringify(data)),{ durable: 'true' },function(err, ok){
                console.log(err,ok)
                resolve({})
            })
            // console.log(rabbitChannel)
            // const rabbitQueue = await rabbitChannel.assertQueue(queueName, {durable: true});
            // rabbitChannel.consume(queueName,(msg)=>{
            //     if(msg.properties.correlationId == correlationId){
            //         resolve(msg.content.toString())
            //         rabbitChannel.close()
            //     }
            // },{
            //     noAck: true
            // })
            // const asd = await rabbitChannel.sendToQueue(queueName,correlationId,Buffer.from(JSON.stringify(data)))
            // console.log(asd)
            // resolve({})
            // const rabbitQueue = await rabbitChannel.assertQueue(queueName, {durable: true});
            // rabbitChannel.consume(rabbitQueue.queue,(msg)=>{
            //     if(msg.properties.correlationId == correlationId){
            //         resolve(msg.content.toString())
            //         rabbitChannel.close()
            //     }
            // },{
            //     noAck: true
            // })
            // rabbitChannel.sendToQueue('rpc_queue',Buffer.from(JSON.stringify(data)),{
            //     correlationId: correlationId, 
            //     replyTo: rabbitQueue.queue
            // })
        })
        // ch.consume(q.queue,(msg)=>{
        //     if(msg.properties.correlationId == correlationId){
        //         console.log(' [.] Got %s', msg.content.toString())
        //         setTimeout(()=>{
        //             rabbitChannel.close()
        //             process.exit(0)
        //         },500)
        //     }
        // })
        // ch.sendToQueue('rpc_queue',Buffer.from(num.toString()),{
        //   correlationId: correlationId, 
        //   replyTo: q.queue
        // })
    }
}
const rpcMq = new RpcMq()
module.exports = {
    rpcMq:rpcMq
}