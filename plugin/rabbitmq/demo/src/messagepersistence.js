/*
 * @Author: liyonglong
 * @Date: 2019-10-16 20:59:54
 * @Last Modified by: liyonglong
 * @Last Modified time: 2019-10-18 01:15:36
 */

// 简单队列
const amqp = require('amqplib/callback_api')

// 发送消息
module.exports.send = async function() {
  /**
   * 1.连接mq
   * 2.创建通道
   * 3.声明队列
   * 4.创建消息
   * 5.发送消息
   */
  // 1.
  amqp.connect({
    protocol: 'amqp',
    hostname: '192.168.1.13',
    port: 19316,
    username: 'admin',
    password: 'admin',
    locale: 'zh-CN',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/'
  }, function(error0, connection) {
    if (error0) {
      throw error0
    }
    // 2
    connection.createChannel(async function(error1, channel) {
      if (error1) {
        throw error1
      }
      // 3.
      const queue = 'simplest'
      //   // 4.
      //   const msg = 'Hello world'

      channel.assertQueue(queue, {
        durable: false
      })
      // 5.
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            channel.sendToQueue(queue, Buffer.from(`生产消息:${i}`))
            console.log(`[p]<-- 生产消息:${i}`)
            resolve()
          }, 1500)
        })
      }
    })
  })
}

// 接收消息
module.exports.receive = async function() {
  /**
   * 1.连接mq
   * 2.创建通道
   * 3.声明队列
   * 4.创建回调函数，等待消息
   */
  // 1.
  amqp.connect({
    protocol: 'amqp',
    hostname: '192.168.1.13',
    port: 19316,
    username: 'admin',
    password: 'admin',
    locale: 'zh-CN',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/'
  }, function(error0, connection) {
    if (error0) {
      throw error0
    }
    // 2
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1
      }
      var queue = 'simplest'

      channel.assertQueue(queue, {
        durable: false
      })

      // 自动回执消息
      const opt = {
        noAck: true
      }
      // 每次消费一个消息
      channel.prefetch(1)
      // 消费消息
      channel.consume(
        queue,
        msg => {
          const msgText = msg.content.toString()
          console.log(`[c]--> 接收到消息:${msgText}`)
        },
        opt
      )
    })
  })
}
