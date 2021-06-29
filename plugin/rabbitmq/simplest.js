// 简单队列 
/**
 * 
 * 一个生产者对应一个消费者
 * 三个角色
 * 消息生产者 Producer
 * 消息中间件（提供消息队列） Queue
 * 消费消费者 Consumer
 */
const amqp = require('amqplib')
const logUtil = require('../log4j');
const fs = require('fs');
class SimplestMq{
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
    sendQueueMsg= async (queueName, msg)=>{
        const self = this;
        const rabbitConn = await self.open
        const rabbitChannel = await rabbitConn.createChannel()
        await rabbitChannel.assertQueue(queueName, {durable: true});
        logUtil.pluginLogger.info('RabbitMq','simplest-sendQueueMsg-'+queueName,msg)
        await rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {deliveryMode: true});
        rabbitChannel.close()
    }
    receiveQueueMsg = async (queueName,callback)=>{
        const self = this;
        const rabbitConn =  await self.open
        const rabbitChannel = await rabbitConn.createChannel()
        rabbitChannel.assertQueue(queueName, {
            durable: true
        })
        rabbitChannel.prefetch(1)
        rabbitChannel.consume(
            queueName,
            msg => {
                let data = msg.content.toString();
                logUtil.pluginLogger.info('RabbitMq','simplest-receiveQueueMsg-'+queueName,data)
                callback(data)
            },
            {
                noAck: true
            }
        )
    }
}
const simplestMq = new SimplestMq()
module.exports = {
    simplestMq:simplestMq
}