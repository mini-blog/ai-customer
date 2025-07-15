FROM node:18-alpine as build

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 多镜像源策略：先尝试淘宝源，失败后使用官方源
RUN npm config set registry https://registry.npm.taobao.org || \
    npm config set registry https://registry.npmmirror.com || \
    npm config set registry https://registry.npmjs.org

# 清理npm缓存
RUN npm cache clean --force

# 安装依赖
RUN npm i 

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境
FROM nginx:alpine

# 复制构建文件
COPY --from=build /app/build /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 