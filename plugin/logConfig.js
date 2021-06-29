let path = require('path');
//日志根目录
let baseLogPath = path.resolve(__dirname, '../logs')
// 请求日志
let httpPath = "/http";
// 请求日志文件名
let httpFileName = "http";
// 请求日志输出完整路径
let httpLogPath = baseLogPath + httpPath + "/" + httpFileName;
// 插件日志
let pluginPath = "/plugin";
//错误日志文件名
let pluginFileName = "plugin";
//错误日志输出完整路径
let pluginLogPath = baseLogPath + pluginPath + "/" + pluginFileName;
// 服务日志
let servicePath = "/service";
//错误日志文件名
let serviceFileName = "service";
//错误日志输出完整路径
let serviceLogPath = baseLogPath + servicePath + "/" + serviceFileName;
// 系统日志
let systemPath = "/system";
//错误日志文件名
let systemFileName = "system";
//错误日志输出完整路径
let systemLogPath = baseLogPath + systemPath + "/" + systemFileName;
// 数据库日志
let dbPath = "/db";
//错误日志文件名
let dbFileName = "db";
//错误日志输出完整路径
let dbLogPath = baseLogPath + dbPath + "/" + dbFileName;

module.exports = {
    // pm2: true,
    disableClustering: true,    // 这里这里
    // pm2InstanceVar: 'INSTANCE_ID',
    "appenders":{
        // log_file:{//记录器2：输出到文件
        //     type : 'file',
        //     // filename: __dirname + `/logs/${programName}.log`,//文件目录，当目录文件或文件夹不存在时，会自动创建
        //     maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
        //     backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
        //     //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
        //     encoding : 'utf-8',//default "utf-8"，文件的编码
        // },
        http: {
            category:"httpLogger",             //logger名称
            type: "dateFile",                   //日志类型
            filename: httpLogPath,             //日志输出位置
            alwaysIncludePattern:true,          //是否总是有后缀名
            pattern: "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            daysToKeep:20,                      //时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
            path: httpPath,
            encoding : 'utf-8', //default "utf-8"，文件的编码
            // compress: true, //是否压缩
        },
        plugin: {
            category:"pluginLogger",
            type: "dateFile",
            filename: pluginLogPath,
            alwaysIncludePattern:true,
            pattern: "-yyyy-MM-dd-hh.log",
            daysToKeep:20,
            path: pluginPath,
            encoding : 'utf-8'
        },
        service: {
            category:"serviceLogger",
            type: "dateFile",
            filename: serviceLogPath,
            alwaysIncludePattern:true,
            pattern: "-yyyy-MM-dd-hh.log",
            daysToKeep:20,
            path: servicePath,
            encoding : 'utf-8'
        },
        system: {
            category:"systemLogger",
            type: "dateFile",
            filename: systemLogPath,
            alwaysIncludePattern:true,
            pattern: "-yyyy-MM-dd-hh.log",
            daysToKeep:20,
            path: systemPath,
            encoding : 'utf-8'
        },
        db: {
            category:"dbLogger",
            type: "dateFile",
            filename: dbLogPath,
            alwaysIncludePattern:true,
            pattern: "-yyyy-MM-dd-hh.log",
            daysToKeep:20,
            path: dbPath,
            encoding : 'utf-8'
        },
        console: {
            "type": "console"
        },
        out: { 
            "type": "stdout"
        },
    },
    "categories" : { 
        http: { appenders: ['http','out'], level: 'all' },
        plugin: { appenders: ['plugin','out'], level: 'all' },
        service: { appenders: ['service','out'], level: 'all' },
        system: { appenders: ['system','out'], level: 'all' },
        db: { appenders: ['db','out'], level: 'all' },
        default: {appenders: ["console"], level: "all" }
    }
}