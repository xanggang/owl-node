# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node:alpine

WORKDIR /app

COPY package.json /app/

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install
RUN npm run tsc

COPY . /app/

# 暴露容器端口
EXPOSE 7001

CMD npm run start

