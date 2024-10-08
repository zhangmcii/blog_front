# syntax=docker/dockerfile:1


ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION} as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json 文件到容器中
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝所有源代码到容器中
COPY . .

# 构建项目
RUN npm run build

# 使用 nginx 作为基础镜像
FROM nginx:latest as production-stage

# 将构建好的项目文件复制到 nginx 静态文件目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 使用容器内的默认 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露容器端口
EXPOSE 80

# 启动 nginx 服务
CMD ["nginx", "-g", "daemon off;"]
