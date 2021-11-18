const os = require('os');
// const {HmacSHA512,AES,enc,mode,pad} = require('crypto-js');
module.exports = {
    getLocalIP: ()=>{
        const ifaces = os.networkInterfaces();
        let locatIp = '';
        for (let dev in ifaces) {
            //兼容mac linux windows
            for (let j = 0;j < ifaces[dev].length;j++) {
                if (ifaces[dev][j].family === 'IPv4') {
                    if(ifaces[dev][j].address&&(ifaces[dev][j].address.indexOf( global.PREFIX_IP_ADDRESS)>-1)){
                        locatIp = ifaces[dev][j].address;
                        break;
                    }
                }
            }
        }
        if(!locatIp){
            throw new Error('ipv4地址异常')
        }
        return {
            ip:locatIp,
            hostName:os.hostname()
        };
    },
    randomString: (length)=>{
        var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) 
            result += str[Math.floor(Math.random() * str.length)];
        return result;
    },
    // //解密aesPkcs7
    // aesPkcs7Decode: (data,key,iv)=>{
    //     const bytes = AES.decrypt(data,enc.Utf8.parse(key),{
    //         mode: mode.CBC,
    //         padding: pad.Pkcs7,
    //         iv: enc.Utf8.parse(iv),
    //     })
    //     const decryptedStr = enc.Utf8.stringify(bytes);
    //     return decryptedStr.toString();
    // },
    // //加密
    // aesPkcs7Encrypt: (data,key,iv)=>{
    //     const encryptedStr  = AES.encrypt(enc.Utf8.parse(data),enc.Utf8.parse(key),{
    //         mode: mode.CBC,
    //         padding: pad.Pkcs7,
    //         iv: enc.Utf8.parse(iv),
    //     })
    //     return encryptedStr
    // },
    // // HmacSHA512加密
    // hmacSHA512:(data,key)=>{
    //     return HmacSHA512(data,key).toString()
    // },
}