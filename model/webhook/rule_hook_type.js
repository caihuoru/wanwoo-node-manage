const {Model} = require('sequelize');
class RuleHookTypeModel extends Model {
    static init(sequelize, DataTypes){
        return super.init(
            {
                id: {
                    type: DataTypes.BIGINT(11),
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                ruleId:{
                    type: DataTypes.BIGINT(11),
                    field: 'ruleId',
                    allowNull: true,
                    comment: '规则id'
                },
                hookId:{
                    type: DataTypes.BIGINT(11),
                    field: 'hookId',
                    allowNull: true,
                    comment: '触发事件ID'
                }
            },{
                sequelize,
                freezeTableName: true,
                timestamps: true,
                modelName: 'node_rule_hook_type',
                comment: "事件规则关联关系",
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
    //     // 多对一 多个记录对应一个规则
    //     models.HookRule.hasMany(models.RuleHookType,{
    //         foreignKey: 'id',
    //         targetKey: 'ruleId'
    //     })
    // }
}
module.exports = {
    RuleHookTypeModel:RuleHookTypeModel
}