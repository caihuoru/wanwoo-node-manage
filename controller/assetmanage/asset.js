const {Op} = require('sequelize');
const qs = require('qs')
module.exports = {
    getUserTableList: async(ctx, next)=>{  
        let {userid} = qs.parse(ctx.request.query)
        const Filter = userid ? { userid:  userid } : {} //精准查询
        const userConfigInfo = await ctx.db.AssetTable.findAll({
            where: Filter,
            attributes: ['userid','config'],
        })
        console.log(userConfigInfo)
        if(userConfigInfo.length){
            ctx.success(userConfigInfo[0].dataValues)
        }else{
            ctx.success({
                config:[
                    {
                        key: "0",
                        disabled: false,
                        name: "数据源",
                        title: "数据源",
                        slotName: "assetInormation.dataSource",
                        dataIndex: "assetFrom",
                        scopedSlots: { customRender: "assetFrom" },
                        sorter: true,
                      },
                      {
                        key: "1",
                        disabled: false,
                        name: "ip地址",
                        title: "ip地址",
                        slotName: "assetInormation.ip",
                        dataIndex: "ip",
                        scopedSlots: { customRender: "ip", title: "ip地址" },
                        sorter: true,
                        width: 170,
                      },
                      {
                        key: "2",
                        disabled: false,
                        name: "资产名称",
                        title: "资产名称",
                        slotName: "assetInormation.assetName",
                        scopedSlots: { customRender: "assetName" },
                        dataIndex: "assetName",
                        sorter: true,
                      },
                      {
                        key: "3",
                        disabled: false,
                        name: "设备序列号",
                        title: "设备序列号",
                        slotName: "assetInormation.assetEsnCode",
                        scopedSlots: { customRender: "assetEsnCode" },
                        dataIndex: "esncode",
                        sorter: true,
                      },
                      {
                        key: "4",
                        disabled: false,
                        name: "资产类型",
                        title: "资产类型",
                        slotName: "assetInormation.assetTypeName",
                        dataIndex: "deviceType",
                        scopedSlots: { customRender: "deviceType" },
                        sorter: true,
                      },
                      {
                        key: "5",
                        disabled: false,
                        name: "品牌",
                        title: "品牌",
                        slotName: "assetInormation.assetBrand",
                        dataIndex: "brand",
                        sorter: true,
                        customRender: (text) => {
                          return text || "--";
                        },
                      },
                      {
                        key: "6",
                        disabled: false,
                        name: "型号",
                        title: "型号",
                        slotName: "assetInormation.assetModel",
                        dataIndex: "model",
                        sorter: true,
                        customRender: (text) => {
                          return text || "--";
                        },
                      },
                      {
                        key: "7",
                        disabled: false,
                        name: "组织架构",
                        title: "组织架构",
                        slotName: "assetInormation.group",
                        dataIndex: "group",
                        sorter: true,
                        customRender: (text) => {
                          return text || "--";
                        },
                      },
                      {
                        key:'7',
                        disabled:false,
                        name: '挂账人',
                        title: "挂账人",
                        slotName:'assetInormation.assetOwner',
                        // width: 100,
                        dataIndex: 'assetOwner',
                        sorter: true,
                      },
                      {
                        key: "8",
                        disabled: false,
                        name: "在线状态",
                        title: "在线状态",
                        slotName: "assetInormation.onlineStatus",
                        // width: 100,
                        dataIndex: "onOffline",
                        scopedSlots: { customRender: "onOffline" },
                        sorter: true,
                      },
                      {
                  
                        key: "9",
                        disabled: false,
                        name: "阻断状态",
                        title: "阻断状态",
                        slotName: "assetInormation.status",
                        // width: 100,
                        dataIndex: "accessStatus",
                        scopedSlots: { customRender: "accessStatus" },
                        sorter: true,
                      },
                      {
                        key: "10",
                        name: "操作",
                        title: "操作",
                        slotName: "assetInormation.action",
                        dataIndex: "action",
                        scopedSlots: { customRender: "action" },
                      },
                      {
                        key: "11",
                        name: "引擎名称",
                        title: "引擎名称",
                        slotName: "assetInormation.ndName",
                        dataIndex: "ndName",
                        scopedSlots: { customRender: "ndName" },
                        customRender: (text) => {
                          return text || "--";
                        },
                      },
                ]
            })
        }
    },
    setUserTableList: async(ctx, next)=>{
      await ctx.db.AssetTable.findOrCreateByother(ctx.request.body,'userid')
      ctx.success({})
    }
}