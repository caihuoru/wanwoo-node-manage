FROM 172.18.5.171/iottepa-basic-main-pm2:latest
MAINTAINER Jvan <18146628322@189.cn>
# 拷贝项目进镜像
RUN mkdir /opt/node_app
WORKDIR /opt/node_app
# 项目本身包含ecosystem.yml
# CMD执行
ADD . .
RUN yarn
RUN ls
RUN cat ecosystem.yml
CMD ["pm2-docker", "start", "/opt/node_app/ecosystem.yml"]