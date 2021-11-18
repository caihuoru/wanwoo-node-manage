module.exports = {
    //固定配置 config
    isRemoteConfig:false,
    isHTTPS:false,
    APP_PORT:19701,
    isSOCKET:false,
    APP_COOKIE:"nodeManageToken",
    NACOS_IP:"172.18.5.122:19679",
    NACOS_NAME_SPACE:"public",
    NACOS_SERVICE_NAME:"fzgang-node-manage",
    NACOS_GROUP_NAME:"DEFAULT_GROUP",
    NACOS_CONFIG:"all-base-service-config-develop.json",
    JWT_TOKEN:"manageStoreToken",
    JWT_IP_TIME:300,
    HTTPS_KEY:"./ssl/https/webserver.key",	//https证书秘钥
    HTTPS_CERT:"./ssl/https/webserver.crt",	//https证书
    PREFIX_IP_ADDRESS:'172.18', // ip前缀
    //如果启用本地配置
    DB_HOST: "172.18.5.122",
    DB_NAME: "Galaxy",
    DB_PORT: "13361",
    DB_USER: "root",
    DB_PASSWORD: "123456",
    DB_UNSECURE: true,
    RABBITMQ_HOSTNAME: "172.18.5.122",
    RABBITMQ_PORT: 18673,
    RABBITMQ_USERNAME: "admin",
    RABBITMQ_PASSWORD: "Wanwoo@123",
    RABBITMQ_PROTOCOL: "amqps",
    RABBITMQ_LOCALE: "zh-CN",
    RABBITMQ_FRAMEMAX: 0,
    RABBITMQ_HEARTBEAT: 0,
    RABBITMQ_VHOST: "/",
    RABBITMQ_SSl: true,
    RABBITMQ_CERTFILEPATH: "./ssl/rabbitmq/server_certificate.pem",
    RABBITMQ_KEYFILEPATH: "./ssl/rabbitmq/server_key.pem",
    RABBITMQ_PASSPHRASE:"Wanwoo@123",
    RABBITMQ_CAFILEPATH: "./ssl/rabbitmq/ca_certificate.pem",
	RD_FAMILY: 4,
    RD_PASSWORD: "",
    RD_DB: 0,
    RD_NAME: 'wanwoomaster',
    REDIS_MEMBERS:[ {"port":18671,"host":"172.18.5.122"}],
    // 三种接入模式：standalone（单机模式）,sentinel(哨兵模式)， cluster(集群模式)，默认是standalone
    REDIS_TEYP: 'standalone',
    // 持久化开始标识符（勿删）
    /**everlasting-start**/
    /**everlasting-end**/
};