const {Model} = require('sequelize');
class FileUpdateHistModel extends Model {
    static init(sequelize, DataTypes){
        return super.init(
            {
                id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
                },
                name:{
                    type: DataTypes.TEXT,
                    field: 'name',
                    allowNull: true,
                    comment: '文件名称'
                },
                type:{
                    type: DataTypes.CHAR(2),
                    field: 'type',
                    allowNull: true,
                    comment: '文件类型'
                },
                url:{
                    type: DataTypes.TEXT,
                    field: 'url',
                    allowNull: true,
                    comment: '文件地址'
            }
            },{
                sequelize,
                freezeTableName: true,
                timestamps: true,
                modelName: 'node_update_file',
                comment: "上传文件记录表",
            }
        )
    }
}
module.exports = {
    FileUpdateHistModel:FileUpdateHistModel
}