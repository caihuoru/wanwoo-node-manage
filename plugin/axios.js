/**
 * doc 
 * https://www.axios-http.cn/docs/intro
 */
const axios = require('axios');
const UserAgent = require('user-agents');
const logUtil = require('./log4j');
axios.defaults.timeout = 50000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Cache-Control"] = "no-cache";
axios.defaults.headers.post["pragma"] = "no-cache";
axios.interceptors.response.use((response)=>{
    logUtil.pluginLogger.info('axios',response.config.method,response)
    return response
},(error)=>{
    logUtil.pluginLogger.error('axios',error.config.method,JSON.stringify(error))
    return Promise.reject(error)
})
module.exports = {
    filter:(url)=>{
        const UrlArr = url.split('/')
        let urlStr = ''
        switch (UrlArr[0]) {
            case 'jenkins':
                urlStr = UrlArr.slice(1,(UrlArr.length)).join('/')
                axios.defaults.baseURL = 'http://'+global.JENKINS_HOST;
                axios.interceptors.request.use((request) => {
                    request.headers['user-agent'] = new UserAgent().toString()
                    request.auth = {
                        username: 'root',
                        password: global.JENKINS_ROOT_TOKEN
                    }
                    return request;
                })
                axios.interceptors.response.use((response)=>{
                    return response
                },(error)=>{
                    const { response } = error;
                    return Promise.resolve({
                        status: response?.status || 500,
                        data: error.message
                    })
                })
                break;
            case 'gitlab':
                urlStr = UrlArr.slice(1,(UrlArr.length)).join('/')
                axios.defaults.baseURL = 'http://'+global.GITLAB_HOST;
                axios.interceptors.request.use((request) => {
                    request.headers['PRIVATE-TOKEN'] = global.GITLAB_ROOT_TOKEN
                    request.headers['user-agent'] = new UserAgent().toString()
                    return request;
                })
                axios.interceptors.response.use((response)=>{
                    return response
                },(error)=>{
                    const { response } = error;
                    return Promise.resolve({
                        status: response?.status || 500,
                        data: error.message
                    })
                })
                break;
            case 'nacos':
                urlStr = url
                axios.defaults.baseURL = 'http://'+global.NACOS_IP+'/';
                axios.interceptors.request.use((request) => {
                    request.headers['user-agent'] = new UserAgent().toString()
                    return request;
                })
                axios.interceptors.response.use((response)=>{
                    return response
                },(error)=>{
                    const { response } = error;
                    return Promise.resolve({
                        status: response?.status || 500,
                        data: error.message
                    })
                })
                break;
            case 'local':
                urlStr = UrlArr.slice(1,(UrlArr.length)).join('/')
                axios.defaults.baseURL = 'http://'+global.LOCAL1_IP+'/';
                console.log(axios,urlStr)
                axios.interceptors.request.use((request) => {
                    request.headers['user-agent'] = new UserAgent().toString()
                    return request;
                })
                axios.interceptors.response.use((response)=>{
                    console.log(response)
                    return response
                },(error)=>{
                    const { response } = error;
                    return Promise.resolve({
                        status: response.status || 500,
                        data: error.message
                    })
                })
                break;
            default:
                urlStr = url
                break;
        }
        return urlStr
    },
    post:(url, data, otherConfig)=>{
        return axios.post(module.exports.filter(url), data, otherConfig);
    },
    get:(url, data, otherConfig)=>{
        return axios.get(module.exports.filter(url), { params: data, ...otherConfig });
    },
    del:()=>{
        return axios.delete(module.exports.filter(url), data, otherConfig);
    },
    put:()=>{
        return axios.put(module.exports.filter(url), data, otherConfig);
    },
    patch:()=>{
        return axios.patch(module.exports.filter(url), data, otherConfig);
    },
    axios:(config)=>{
        return axios(config)
    },
    all:(iterable)=>{
        return axios.all(iterable)
    }
}