const os = require('os');
// const {HmacSHA512,AES,enc,mode,pad} = require('crypto-js');
module.exports = {
    getLocalIP: ()=>{
        const ifaces = os.networkInterfaces();
        let locatIp = '';
        for (let dev in ifaces) {
            //兼容mac linux windows
            if (dev === 'en0' || dev === '以太网' || dev === 'eth0' || dev === 'LAN1'){
                for (let j = 0;j < ifaces[dev].length;j++) {
                    if (ifaces[dev][j].family === 'IPv4') {
                        locatIp = ifaces[dev][j].address;
                        break;
                    }
                }
            }
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