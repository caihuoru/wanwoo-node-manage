const {Model} = require('sequelize');
class NorthPortListModel extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                ip:{
                    type: DataTypes.TEXT,
                    field: 'ip',
                    allowNull: true,
                    comment: 'ip地址'
                },
                accesscert:{
                    type: DataTypes.TEXT,
                    field: 'accesscert',
                    allowNull: true,
                    comment: '鉴权token'
                },
                certTime:{
                    type: DataTypes.TEXT,
                    field: 'certTime',
                    allowNull: true,
                    comment: '鉴权token有效时长'
                },
                isOpen:{
                    type: DataTypes.TEXT,
                    field: 'isOpen',
                    allowNull: true,
                    comment: '秘钥'
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
                modelName: 'node_northport_list',
                comment: "北向接口配置",
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
}
module.exports = {
    NorthPortListModel:NorthPortListModel
}
