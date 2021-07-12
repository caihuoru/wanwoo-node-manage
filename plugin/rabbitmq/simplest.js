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
const config = require('../../config')

class SimplestMq{
    constructor() {
        this.opts = {
            cert: [fs.readFileSync(config.RABBITMQ_CERTFILEPATH)],      // client cert
            key: [fs.readFileSync(config.RABBITMQ_KEYFILEPATH)],        // client key
            passphrase: config.RABBITMQ_PASSPHRASE, // passphrase for key
            ca: [fs.readFileSync(config.RABBITMQ_CAFILEPATH)],            // array of trusted CA certs
            rejectUnauthorized: false
        }
        
        this.open = amqp.connect({
            protocol: config.RABBITMQ_PROTOCOL,
            hostname: config.RABBITMQ_HOSTNAME,
            port: config.RABBITMQ_PORT,
            username: config.RABBITMQ_USERNAME,
            password: config.RABBITMQ_PASSWORD,
            locale: config.RABBITMQ_LOCALE,
            frameMax: config.RABBITMQ_FRAMEMAX,
            heartbeat: config.RABBITMQ_HEARTBEAT,
            vhost: config.RABBITMQ_VHOST
        },config.RABBITMQ_SSl?this.opts:null).catch(error=>{
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