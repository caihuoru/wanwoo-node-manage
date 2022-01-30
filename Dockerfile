FROM node:14.17.0-slim
# 镜像元信息
LABEL Racaly="zhaoyan@iottepa.cn" 
# 工作区
WORKDIR /node            
# 拷贝代码进镜像
COPY . .
# 拷贝证书
COPY ssl /ssl
# 删除多余文件并安装依赖
RUN rm -rf ./ssl \ 
    && yarn
# CMD执行
CMD ["yarn", "start"]
