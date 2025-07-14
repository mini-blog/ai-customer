import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DashboardOutlined,
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  ChatOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/agents',
      icon: <RobotOutlined />,
      label: '智能体管理',
    },
    {
      key: '/conversations',
      icon: <MessageOutlined />,
      label: '对话管理',
    },
    {
      key: '/test-chat',
      icon: <ChatOutlined />,
      label: '聊天测试',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sider width={250} className="site-layout-background">
      <div className="logo">电商客服智能体</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={handleMenuClick}
        theme="dark"
      />
      <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '16px' }}>
        <div style={{ color: 'white', marginBottom: '8px', fontSize: '12px' }}>
          欢迎，{user?.username}
        </div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: 'white', width: '100%' }}
        >
          退出登录
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar; 