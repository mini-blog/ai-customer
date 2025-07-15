-- 创建数据库
CREATE DATABASE IF NOT EXISTS ecommerce_customer_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecommerce_customer_service;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 客服智能体表
CREATE TABLE IF NOT EXISTS customer_service_agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  difyAppId VARCHAR(100) NOT NULL,
  difyApiKey VARCHAR(255) NOT NULL,
  difyBaseUrl VARCHAR(255) DEFAULT 'http://localhost:5001',
  config JSON,
  isActive BOOLEAN DEFAULT TRUE,
  totalConversations INT DEFAULT 0,
  totalMessages INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 对话表
CREATE TABLE IF NOT EXISTS conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sessionId VARCHAR(100) NOT NULL,
  userId VARCHAR(100),
  agentId INT NOT NULL,
  metadata JSON,
  totalMessages INT DEFAULT 0,
  status ENUM('active', 'closed', 'archived') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agentId) REFERENCES customer_service_agents(id) ON DELETE CASCADE,
  INDEX idx_session_agent (sessionId, agentId),
  INDEX idx_user (userId),
  INDEX idx_created_at (createdAt)
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversationId INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  metadata JSON,
  intent VARCHAR(50),
  confidence FLOAT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE,
  INDEX idx_conversation (conversationId),
  INDEX idx_created_at (createdAt)
);

-- 插入默认管理员用户
INSERT INTO users (username, password, email, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'admin');

-- 插入示例智能体
INSERT INTO customer_service_agents (name, description, difyAppId, difyApiKey, difyBaseUrl) VALUES 
('电商客服智能体', '专业的电商客服智能体，支持商品咨询、订单查询、售后服务等', 'app-123456789', 'sk-123456789', 'http://host.docker.internal');

-- 创建索引
CREATE INDEX idx_agents_active ON customer_service_agents(isActive);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_role ON messages(role); 