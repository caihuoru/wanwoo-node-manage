//datalize 表单校验及自定义校验规则
const datalize = require('datalize');
// set datalize to throw an error if validation fails
datalize.set('autoValidate', true);
const Field = datalize.Field;
//自定义过滤器，你就可以用.dateTime() 过滤器链接字段对日期输入进行验证
Field.prototype.dateTime = function(format = 'YYYY-MM-DD HH:mm') {
    return this.date(format);
};
Field.prototype.phone = function() {
    return this.add((value)=>{
        if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){ 
            throw new Error('%s is not a valid phone.');
        }
        return value
    })
};
Field.prototype.isBase64 = function(){
    return this.add((value)=>{
        const reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
        if(!(reg.test(value))){ 
            throw new Error('%s is not a valid base64.');
        }
        return value
    })
};
Field.prototype.isIp = function(){
    return this.add((value)=>{
        const reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if(reg.test(value)){
            if(RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
                return value
            }else{
                throw new Error('%s is not a valid IP.');
            }
        }else{
            throw new Error('%s is not a valid IP.');
        }
    })
};
Field.prototype.isJSONString = function(){
    return this.add((value)=>{
        try{
            if (typeof JSON.parse(value) == "object") {
                return value
            }
        } catch(e) {
            throw new Error('%s is not a valid JSON.');
        }
        
    })
};
function datalizeVerify(){
    return async function(ctx, next){
        try {
            await next()
        } catch (error) {
            if (error instanceof datalize.Error) {
                ctx.fail('参数错误',9998,error.errors)
            }
        }
    }
}
module.exports = datalizeVerify