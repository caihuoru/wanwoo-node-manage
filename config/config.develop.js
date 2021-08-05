module.exports = {
    //固定配置 config
    isRemoteConfig:true,
    isHTTPS:false,
    APP_PORT:18701,
    isSOCKET:false,
    APP_COOKIE:"nodeManageToken",
    NACOS_IP:"172.18.5.125:18679",
    NACOS_NAME_SPACE:"public",
    NACOS_SERVICE_NAME:"fzgang-node-manage",
    NACOS_GROUP_NAME:"DEFAULT_GROUP",
    NACOS_CONFIG:"all-base-service-config-develop.json",
    JWT_TOKEN:"manageStoreToken",
    JWT_IP_TIME:300,
    HTTPS_KEY:"./ssl/https/webserver.key",	//https证书秘钥
    HTTPS_CERT:"./ssl/https/webserver.crt",	//https证书
    //如果启用本地配置
    DB_HOST: "172.18.5.125",
    DB_NAME: "Galaxy",
    DB_PORT: "13361",
    DB_USER: "root",
    DB_PASSWORD: "123456",
    DB_UNSECURE: true,
    RABBITMQ_HOSTNAME: "172.18.5.125",
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
    REDIS_MEMBERS:[ {"port":18671,"host":"172.18.5.125"}]
};