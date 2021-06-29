const configProd = require('./config.prod');
const configDevelop = require('./config.develop');
let config = null;
(()=>{
    if(process.env.NODE_ENV == 'development'){
        config = configDevelop
    }else{
        config = configProd
    }
})();
module.exports = config