FROM docker.iottepa.cn:32011/node-basic:1.0.0
# 镜像元信息
LABEL Jvan <18146628322@189.cn>
# 工作区
WORKDIR  /opt/node_app
# 安装依赖
RUN yarn 
# 复制mc
COPY ./bin/mc /usr/local/bin/mc
RUN   chmod -R 777 /usr/local/bin/mc
# 时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone
# 拷贝代码进镜像
COPY . .
# CMD执行
CMD ["yarn", "start"]
 