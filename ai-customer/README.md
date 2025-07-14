# 电商客服智能体系统

这是一个基于Dify和NestJS的电商客服智能体系统，支持知识库检索、短期记忆和长期记忆功能。

## 系统架构

- **Dify**: 智能体编排和对话管理
- **NestJS API**: 后端API服务
- **React Admin**: 后台管理系统
- **MySQL**: 数据存储
- **Redis**: 缓存和会话管理
- **Nginx**: 反向代理

## 功能特性

### 客服智能体功能
- ✅ 知识库检索和问答
- ✅ 短期记忆（会话上下文）
- ✅ 长期记忆（用户历史）
- ✅ 意图识别和分类
- ✅ 多智能体支持

### 后台管理功能
- ✅ 智能体管理（创建、编辑、删除）
- ✅ 对话历史查看
- ✅ 统计分析
- ✅ 用户管理
- ✅ Dify配置管理

## 快速开始

### 1. 环境要求

- Docker & Docker Compose
- Node.js 18+
- MySQL 8.0+
- Redis 7+

### 2. 部署Dify

首先部署Dify服务：

```bash
# 进入Dify目录
cd dify-1.5.1

# 复制环境配置
cp docker/.env.example docker/.env

# 修改配置（根据需要调整）
vim docker/.env

# 启动Dify
cd docker
docker-compose up -d
```

### 3. 配置Dify智能体

1. 访问Dify控制台：http://localhost/install
2. 完成初始化设置
3. 创建新的Chatflow应用
4. 导入提供的应用配置：`dify-app.dsl`
5. 配置知识库和模型
6. 获取API密钥和应用ID

### 4. 部署客服系统

```bash
# 克隆项目
git clone <repository-url>
cd ai-customer

# 修改配置
vim .env

# 启动服务
docker-compose up -d
```

### 5. 导入Dify应用配置

在Dify控制台中导入应用配置：

1. 进入应用管理页面
2. 点击"导入应用"
3. 选择"从DSL文件导入"
4. 上传 `电商客服智能体.dsl` 文件
5. 确认导入配置
6. 根据需要调整模型配置和知识库设置
7. 创建知识库，使用`file.md` 文件的内容

### 6. 访问系统

- 后台管理：http://localhost:3002
- API文档：http://localhost:3001/api-docs
- 默认管理员：admin / password

## 配置说明

### 环境变量

创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=dify
DB_PASSWORD=dify123456
DB_DATABASE=ai-customer

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379

# JWT配置
JWT_SECRET=your-super-secret-jwt-key

# API配置
PORT=3001
NODE_ENV=production

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

### Dify配置

在后台管理系统中配置智能体：

1. 名称：智能体显示名称
2. 描述：智能体功能描述
3. Dify App ID：从Dify控制台获取
4. Dify API Key：从Dify控制台获取
5. Dify Base URL：Dify服务地址

## API使用

### 发送消息

```bash
curl -X POST http://localhost:3001/customer-service/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，我想咨询一下商品信息",
    "agentId": 1,
    "sessionId": "session-123",
    "userId": "user-456"
  }'
```

### 获取对话历史

```bash
curl -X GET "http://localhost:3001/customer-service/history/session-123?agentId=1"
```

## 数据库结构

### 主要表结构

- `users`: 用户表
- `customer_service_agents`: 智能体配置表
- `conversations`: 对话表
- `messages`: 消息表

详细结构请参考：`database/init.sql`

## 开发指南

### 本地开发

```bash
# 安装依赖
cd nestjs-api
npm install

# 启动开发服务器
npm run start:dev

# 前端开发
cd admin-frontend
npm install
npm start
```

### 代码结构

```
ai-customer/
├── 电商客服智能体.yml              # Dify应用配置
├── file.md                      # 知识库测试文件
├── nestjs-api/                 # NestJS后端服务
│   ├── src/
│   │   ├── entities/           # 数据库实体
│   │   ├── customer-service/   # 客服服务模块
│   │   ├── admin/             # 后台管理模块
│   │   └── auth/              # 认证模块
├── admin-frontend/             # React后台管理前端
├── database/                   # 数据库脚本
├── nginx/                      # Nginx配置
└── docker-compose.yml         # Docker编排文件
```

## 监控和日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f api
docker-compose logs -f mysql
```
