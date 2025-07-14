import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import {
  RobotOutlined,
  MessageOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  totalMessages: number;
  totalUsers: number;
  recentConversations: number;
}

interface RecentConversation {
  id: number;
  sessionId: string;
  userId: string;
  agentId: number;
  status: string;
  createdAt: string;
  agent: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [statsResponse, conversationsResponse] = await Promise.all([
          api.get('/admin/stats/dashboard'),
          api.get('/admin/conversations?page=1&limit=10')
        ]);

        setStats(statsResponse.data);
        setRecentConversations(conversationsResponse.data.conversations);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const conversationColumns = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      key: 'sessionId',
      width: 200,
    },
    {
      title: '智能体',
      dataIndex: ['agent', 'name'],
      key: 'agentName',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === 'active' ? '#52c41a' : '#faad14',
          fontWeight: 'bold'
        }}>
          {status === 'active' ? '活跃' : '已关闭'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>仪表板</Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总智能体数"
              value={stats?.totalAgents || 0}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃智能体"
              value={stats?.activeAgents || 0}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总对话数"
              value={stats?.totalConversations || 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总消息数"
              value={stats?.totalMessages || 0}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="最近7天对话"
              value={stats?.recentConversations || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近对话 */}
      <Card title="最近对话" style={{ marginTop: 24 }}>
        <Table
          columns={conversationColumns}
          dataSource={recentConversations}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Dashboard; 