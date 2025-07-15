# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 多镜像源策略：先尝试淘宝源，失败后使用官方源
RUN npm config set registry https://registry.npm.taobao.org || \
    npm config set registry https://registry.npmmirror.com || \
    npm config set registry https://registry.npmjs.org

# 清理npm缓存
RUN npm cache clean --force

# 安装依赖，失败后重试
RUN npm i || (npm config set registry https://registry.npmjs.org && npm i)

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "run", "start:prod"] 