// 发布订阅模式
/**
 * 
 * 一个生产者,多个消费者
 * 每一个消费者都有自己的队列
 * 生产者没有直接把消息发送到队列 而是发到了交换机 转发器 exchange
 * 每一个队列都要绑定到交换机上
 * 生产者发送的消息 经过交换机 到达队列 就能实现一个消息被多个消费者消费
 * 大白话：
 * 一个富人说今天给老人（交换类型）发钱（消息）
 * 每一个 老人 带上自己的碗(队列)来装钱
 * 
 * 交换类型
 * direct
 * topic
 * headers
 * fanout
 */
const amqp = require('amqplib')
const logUtil = require('../log4j');
const fs = require('fs');
class PubsubMq{
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
    sendQueueMsg= async (exchange_name,queue,msg)=>{
        const self = this;
        const rabbitConn = await self.open
        const rabbitChannel = await rabbitConn.createChannel()
        // 创建临时交换机
        await rabbitChannel.assertExchange(exchange_name, 'fanout', { durable: false })
        //参数1 交换机名字 参数2 指定队列 3 内容
        for (let i = 0; i < msg.length; i++) {
            logUtil.pluginLogger.info('RabbitMq','pubsub-sendQueueMsg-'+exchange_name+'-'+queue,msg[i])
            await rabbitChannel.publish(exchange_name, queue, Buffer.from(JSON.stringify(msg[i])))
        }
        rabbitChannel.close()
    }
    receiveQueueMsg = async (exchange_name,queue,callback)=>{
        const self = this;
        const rabbitConn =  await self.open
        const rabbitChannel = await rabbitConn.createChannel()
        rabbitChannel.assertExchange(exchange_name, 'fanout',{
            durable: false
        })
        const q =  await rabbitChannel.assertQueue(queue, 'fanot')
        rabbitChannel.bindQueue(q.queue, exchange_name, queue)
        rabbitChannel.consume(
            q.queue,
            msg => {
                let data = msg.content.toString();
                logUtil.pluginLogger.info('RabbitMq','pubsub-receiveQueueMsg-'+exchange_name+'-'+queue,data)
                callback(data)
                // rabbitChannel.close()
            },
            {
                noAck: true
            }
        )
    }
}
const pubsubMq = new PubsubMq()
module.exports = {
    pubsubMq:pubsubMq
}