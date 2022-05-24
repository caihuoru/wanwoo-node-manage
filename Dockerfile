FROM docker.iottepa.cn:32011/node-basic:1.0.0
# 镜像元信息
LABEL Jvan <18146628322@189.cn>
# 工作区
WORKDIR  /opt/node_app
# 拷贝代码进镜像
COPY . .
# CMD执行
CMD ["yarn", "start"]
