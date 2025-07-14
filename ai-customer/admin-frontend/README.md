# 电商客服智能体 - 后台管理前端

这是电商客服智能体系统的后台管理前端，基于React + TypeScript + Ant Design构建。

## 功能特性

- 🔐 用户认证和授权
- 📊 数据统计仪表板
- 🤖 智能体管理（CRUD操作）
- 💬 对话历史管理
- 🧪 聊天功能测试
- 📱 响应式设计

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design** - UI组件库
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Context API** - 状态管理

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── Sidebar.tsx     # 侧边栏导航
│   └── TestChat.tsx    # 聊天测试组件
├── contexts/           # React Context
│   └── AuthContext.tsx # 认证上下文
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表板
│   ├── Agents.tsx      # 智能体管理
│   ├── Conversations.tsx # 对话管理
│   └── Login.tsx       # 登录页面
├── services/           # API服务
│   ├── api.ts          # 通用API配置
│   └── auth.ts         # 认证API
├── App.tsx             # 主应用组件
├── index.tsx           # 应用入口
└── index.css           # 全局样式
```

## 页面说明

### 登录页面 (/login)
- 用户登录表单
- 支持用户名/密码登录
- 自动跳转到仪表板

### 仪表板 (/)
- 系统统计信息展示
- 智能体数量、对话数量等
- 最近对话列表

### 智能体管理 (/agents)
- 智能体列表展示
- 创建、编辑、删除智能体
- Dify配置管理

### 对话管理 (/conversations)
- 对话历史列表
- 按智能体筛选
- 查看对话详情
- 删除对话记录

### 聊天测试 (/test-chat)
- 实时聊天界面
- 选择智能体进行测试
- 会话管理

## API接口

### 认证相关
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册

### 智能体管理
- `GET /admin/agents` - 获取智能体列表
- `POST /admin/agents` - 创建智能体
- `PUT /admin/agents/:id` - 更新智能体
- `DELETE /admin/agents/:id` - 删除智能体

### 对话管理
- `GET /admin/conversations` - 获取对话列表
- `GET /admin/conversations/:id` - 获取对话详情
- `DELETE /admin/conversations/:id` - 删除对话

### 客服API
- `POST /customer-service/chat` - 发送消息
- `GET /customer-service/history/:sessionId` - 获取对话历史

## 环境变量

创建 `.env` 文件：

```env
REACT_APP_API_URL=http://localhost:3001
```

## 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新组件
2. 在 `src/App.tsx` 中添加路由
3. 在 `src/components/Sidebar.tsx` 中添加菜单项

### 添加新API

1. 在 `src/services/` 目录下创建API文件
2. 使用 `api` 实例发送请求
3. 处理响应和错误

### 样式定制

- 全局样式：`src/index.css`
- 组件样式：`src/App.css`
- Ant Design主题：在 `src/index.tsx` 中配置

## 部署

### Docker部署

```bash
# 构建镜像
docker build -t ecommerce-admin-frontend .

# 运行容器
docker run -p 3000:3000 ecommerce-admin-frontend
```

### 静态文件部署

```bash
# 构建
npm run build

# 部署build目录到Web服务器
```