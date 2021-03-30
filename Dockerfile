# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node:alpine

ENV PROD_MY_SQL_HOST="$PROD_MY_SQL_HOST"
ENV PROD_MY_SQL_PASSWORD="$PROD_MY_SQL_PASSWORD"
ENV PROD_MY_SQL_HOST="$PROD_MY_SQL_HOST"

WORKDIR /app

COPY . /app/

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install

RUN npm run tsc

# 暴露容器端口
EXPOSE 7001

CMD npm run start

