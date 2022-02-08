FROM node:14.17.0-slim
# 镜像元信息
LABEL Jvan <18146628322@189.cn>
# 工作区
WORKDIR  /opt/node_app          
# 拷贝代码进镜像
COPY . .
# 删除多余文件并安装依赖
RUN  yarn
# CMD执行
CMD ["yarn", "start"]
