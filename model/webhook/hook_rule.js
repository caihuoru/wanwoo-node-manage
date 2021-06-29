const {Model} = require('sequelize');
class HookRuleModel extends Model {
    static init(sequelize, DataTypes){
        return super.init(
            {
                id: {
                    type: DataTypes.BIGINT(11),
                    allowNull: false,
                    primaryKey: true,
                    unique: true,
                    autoIncrement: true
                },
                rulesName:{
                    type: DataTypes.TEXT,
                    field: 'rulesName',
                    allowNull: true,
                    comment: '规则名'
                },
                callbackAddress:{
                    type: DataTypes.TEXT,
                    field: 'callbackAddress',
                    allowNull: true,
                    comment: '回调地址'
                },
                secretKey:{
                    type: DataTypes.TEXT,
                    field: 'secretKey',
                    allowNull: true,
                    comment: '秘钥'
                },
                hooklist:{
                    type: DataTypes.TEXT,
                    field: 'hooklist',
                    allowNull: true,
                    comment: '触发规则id集合',
                    get(){
                        return this.getDataValue('hooklist').split(',');
                    },
                    set(value){
                        return this.setDataValue('hooklist',value.join(','))
                    }
                },
                dataType:{
                    type: DataTypes.TEXT,
                    field: 'dataType',
                    allowNull: true,
                    comment: '协议数据类型'
                },
                isEncrypt:{
                    type: DataTypes.TEXT,
                    field: 'isEncrypt',
                    allowNull: true,
                    comment: '是否加密'
                },
                isOpen:{
                    type: DataTypes.TEXT,
                    field: 'secretKey',
                    allowNull: true,
                    comment: '是否启用'
                }
            },{
                sequelize,
                freezeTableName: true,
                timestamps: true,
                paranoid: true,
                modelName: 'node_hook_rules',
                comment: "规则表",
            }
        )
    }
    static findOrCreateByother(dataObj,types){
        const self = this;
        let whereObj = {
            [types]: dataObj[types]
        }
        let defaultData = {}
        for(let i in dataObj){
            if(i != types && i!='__files'){
                defaultData[i] = dataObj[i]
            }
        }
        return new Promise((resolve, reject) => {
            self.findOrCreate({
                where:whereObj,
                defaults:defaultData
            }).spread((sqlModel, created) => {
                sqlModel.get({
                    plain: true
                })
                if(created === false) {
                    sqlModel.update(dataObj)
                    resolve(created)
                }else{
                    resolve(created)
                }
            })
        })
    }
    // static associate(models) {
    //     //一对多 一个规则多条记录
    //     models.HookRule.hasMany(models.RuleHookType,{
    //         foreignKey: 'id',
    //         targetKey: 'ruleId'
    //     })
    // }
}
module.exports = {
    HookRuleModel:HookRuleModel
}