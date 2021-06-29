const {Model} = require('sequelize');
class AssetTableModel extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                userid:{
                    type: DataTypes.TEXT,
                    field: 'userid',
                    allowNull: true,
                    comment: '用户id'
                },
                config:{
                    type: DataTypes.TEXT,
                    field: 'config',
                    allowNull: true,
                    comment: '资产页面table用户配置'
                },
            },{
                sequelize,
                freezeTableName: true,
                timestamps: true,
                paranoid: true,
                modelName: 'node_asset_table_list',
                comment: "资产页面table用户配置",
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
    AssetTableModel:AssetTableModel
}