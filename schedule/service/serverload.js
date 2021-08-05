const { get } = require('../../plugin/axios')
const { redisStore,redisSocket } = require('../../plugin/redis');
module.exports = {
    getServiceStatus: ()=>{
        return new Promise((resolve, reject)=>{
            const serviceList = [
                'fzgang-galaxy',
                'fzgang-gateway',
                'fzgang-data-center'
            ]
            get('nacos/v1/ns/service/list',{
                pageNo:1,
                pageSize:100
            }).then((result)=>{
                if(result.status == 200){
                    let serverList = JSON.parse(JSON.stringify(serviceList))
                    result.data.doms.map(item=>{
                        serverList.map((items,index)=>{
                            if(item == items){
                                serverList.splice(index,1)
                            }
                        })
                    })
                    /**
                     * NORMAL 正常状态，所有服务都启动后，才是正常状态；UI正常展示
                     * ERROE 异常 有一项关键服务没有启动，就是异常状态；异常状态需要同时明确异常点，需管理员处理异常；UI展示为“系统服务异常，请联系管理员处理”+ “具体异常原因”
                     * UNKNOWN 未知状态 只要是断电重启状态的场景，都是未知；UI展示为“系统服务启动中”
                     * UPDATE 升级状态，仅升级控制器组件时使用；UI展示为“系统升级中”
                     */
                     return redisStore.get('system:status').then(resStatus=>{
                        if(resStatus?.status != 'UPDATE'){
                            if(serverList.length == 0){
                                redisStore.set('system:status',{status:'NORMAL',data:{},message:'系统启动成功!'})
                            }else{
                                redisStore.set('system:status',{status:'ERROE',data:{},message:'有关键服务('+serverList.join(',')+')没有启动!'})
                            }
                        }else{
                            if(resStatus?.status == 'UPDATE'){
                                redisStore.set('system:status',{status:'UPDATE',data:{},message:'系统升级中!'})
                            }else{
                                redisStore.set('system:status',{status:'NORMAL',data:{},message:'系统启动成功!'})
                            }
                            
                        }
                    })
                }else{
                    //服务错误
                    redisStore.set('system:status',{status:'ERROE',data:{},message:JSON.stringify(result)})
                }
                resolve('1')
            })
        })
    },
    setServiceStatus: (app)=>{
        return new Promise((resolve, reject)=>{
            redisStore.get('system:status').then(systemStatus=>{
                // redisSocket.emit('system-status',systemStatus)
                app.context.CheckSystem.emit('system-status',systemStatus)
                resolve('1')
            })
        })
    }
}