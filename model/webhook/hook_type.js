const {Model} = require('sequelize');
class HookTypeModel extends Model {
    static init(sequelize, DataTypes){
        return super.init(
            {
                id: {
                    type: DataTypes.BIGINT(11),
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                value:{
                    type: DataTypes.TEXT,
                    field: 'value',
                    allowNull: true,
                    comment: '值'
                },
                type:{
                    type: DataTypes.TEXT,
                    field: 'type',
                    allowNull: true,
                    comment: '数据类型'
                },
                isOpen:{
                    type: DataTypes.BOOLEAN,
                    field: 'isOpen',
                    allowNull: true,
                    comment: '是否启用'
                },
                remarks:{
                    type: DataTypes.TEXT,
                    field: 'remarks',
                    allowNull: true,
                    comment: '描述'
                }
            },{
                sequelize,
                freezeTableName: true,
                timestamps: true,
                paranoid: true,
                modelName: 'node_hook_type',
                comment: "hook事件类型",
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
    //     models.HookType.hasMany(models.RuleHookType,{
    //         foreignKey: 'id',
    //         targetKey: 'hookId'
    //     })
    // }
}
module.exports = {
    HookTypeModel:HookTypeModel
}