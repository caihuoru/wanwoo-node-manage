//工作队列/任务队列
/**
 * 工作队列（又称任务队列）的主要思想是避免立即执行资源密集型任务，而不得不等待它完成。
 * 相反，我们安排任务在以后完成。我们将任务封装 为消息并将其发送到队列。
 * 在后台运行的工作进程将弹出任务并最终执行作业。
 * 当您运行许多工作人员时，任务将在他们之间共享。
 * 工作队列 方式派发消息的方式的两种方式
 * 1. 轮询
 * 2. 任务队列
 *  2.1关闭自动回执(ack)
 *  2.2设置每次接受消息
 *  2.3数手动回执
 */
const amqp = require('amqplib')
const logUtil = require('../log4j');
const fs = require('fs');
const config = require('../../config')

class WorkqueuetMq{
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
        for (let i = 0; i < msg.length; i++) {
            logUtil.pluginLogger.info('RabbitMq','workqueuet-sendQueueMsg-'+queueName,msg[i])
            rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg[i])))
        }
        rabbitChannel.close()
    }
    receiveQueueMsg = async (queueName,time,callback)=>{
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
                setTimeout(() => {
                    // 手动发送回执
                    logUtil.pluginLogger.info('RabbitMq','workqueuet-sendQueueMsg-'+queueName,data)
                    callback(data)
                    rabbitChannel.ack(msg)
                  }, time)
            },
            {
                noAck: false
            }
        )
    }
}
const workqueuetMq = new WorkqueuetMq()
module.exports = {
    workqueuetMq:workqueuetMq
}