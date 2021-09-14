const schedule = require('node-schedule');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const {getServiceStatus, setServiceStatus} = require('./service/serverload')
const scheduleNode = (app)=>{
    //schedule.scheduleJob('*/5 * * * * ?',async ()=>{
        //触发多个mq
        // app.context.simplestMq.sendQueueMsg('webhook:node',{
        //         type:"user:login",
        //         id:1,
        //         data:{
        //             userName: "用户名",
        //             time: "时间戳"
        //         }
        // })
        // app.context.workqueuetMq.sendQueueMsg('JvanTest1',['11111','22222','33333','44444','55555'])
        // app.context.pubsubMq.sendQueueMsg('JvanTest2','queue',['211111','222222','233333','244444','255555'])
    //});
    // schedule.scheduleJob('*/10 * * * * ?',async ()=>{
    //     getServiceStatus()
    // })
    // schedule.scheduleJob('*/30 * * * * ?',async()=>{
    //     setServiceStatus(app)
    // })
    // schedule.scheduleJob('*/1 * * * * ?',async ()=>{
    //     console.log(schedule.scheduledJobs)
    // })
}
const scheduleToad = (app)=>{
    const scheduler = new ToadScheduler()
    // const getServiceStatusTask = new AsyncTask('getServiceStatus', ()=>{
    //     return getServiceStatus()
    // },(err) => {})
    const setServiceStatusTask = new AsyncTask('setServiceStatus',()=>{
        return setServiceStatus(app)
    },(err) => {})
    // const job1 = new SimpleIntervalJob({ seconds: 10, }, getServiceStatusTask)
    const job2 = new SimpleIntervalJob({ seconds: 30, }, setServiceStatusTask)
    // scheduler.addSimpleIntervalJob(job1)
    scheduler.addSimpleIntervalJob(job2)
}
module.exports = {
    scheduleToad:scheduleToad,
    scheduleNode:scheduleNode
}