/**
 * doc
 * https://www.sequelize.com.cn/
 * 多表联查
 * https://itbilu.com/nodejs/npm/EJarwPD8W.html#relation
 */
const { Sequelize } = require('sequelize');
const logUtil = require('../plugin/log4j')
const sequelize = new Sequelize(global.DB_NAME,global.DB_USER,global.DB_PASSWORD,{
    host: global.DB_HOST,
    port: global.DB_PORT,
    dialect:'mysql',
    logging: log,
    dialectOptions: {
        charset: "utf8",
        bigNumberStrings: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
});
// 模型生效 不允许生产环境使用
// // {alter: true}
// // {force: true}
// sequelize.sync({alter: true})
function log(sql,detail){
    logUtil.dbLogger.info(sql,detail);
}
// 注册模型
const {NorthPortListModel} = require("../model/northport/northportlist");
const {AssetTableModel} = require("../model/assetmanage/assets");
const {FileUpdateHistModel} = require("../model/systemimg/file")
const {RuleHookTypeModel}  = require("../model/webhook/rule_hook_type")
const {HookTypeModel} = require("../model/webhook/hook_type")
const {HookRuleModel} = require("../model/webhook/hook_rule")
const models = {
    NorthPortList: NorthPortListModel.init(sequelize, Sequelize),
    AssetTable: AssetTableModel.init(sequelize, Sequelize),
    FileUpdateHist:FileUpdateHistModel.init(sequelize, Sequelize),
    RuleHookType:RuleHookTypeModel.init(sequelize, Sequelize),
    HookType:HookTypeModel.init(sequelize, Sequelize),
    HookRule:HookRuleModel.init(sequelize, Sequelize),
};
Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));
const db = {
    ...models,
    sequelize
};
module.exports = db