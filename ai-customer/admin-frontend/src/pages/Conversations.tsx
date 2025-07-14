import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Space, 
  Typography, 
  message, 
  Popconfirm,
  Tag,
  Button,
  Modal,
  Select,
  Input,
  Row,
  Col
} from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Conversation {
  id: number;
  sessionId: string;
  userId: string;
  agentId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  agent: {
    id: number;
    name: string;
  };
  messages: Message[];
}

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt: string;
}

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedAgent, setSelectedAgent] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
      fetchConversations();
    }
  }, [isAuthenticated, currentPage, pageSize, selectedAgent]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/admin/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(selectedAgent && { agentId: selectedAgent }),
      };
      const response = await api.get('/admin/conversations', { params });
      setConversations(response.data.conversations);
      setTotal(response.data.total);
    } catch (error) {
      message.error('获取对话列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (record: Conversation) => {
    try {
      const response = await api.get(`/admin/conversations/${record.id}`);
      setSelectedConversation(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取对话详情失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/conversations/${id}`);
      message.success('删除成功');
      fetchConversations();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    // 这里可以实现搜索功能，暂时只是设置搜索文本
  };

  const columns = [
    {
      title: '会话ID',
      dataIndex: 'sessionId',
      key: 'sessionId',
      width: 200,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {text}
        </span>
      ),
    },
    {
      title: '智能体',
      dataIndex: ['agent', 'name'],
      key: 'agentName',
      width: 150,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? '活跃' : '已关闭'}
        </Tag>
      ),
    },
    {
      title: '消息数',
      key: 'messageCount',
      width: 100,
      render: (_: any, record: Conversation) => record.messages?.length || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Conversation) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Popconfirm
            title="确定要删除这个对话吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <Title level={2}>对话管理</Title>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              placeholder="选择智能体"
              allowClear
              style={{ width: '100%' }}
              onChange={setSelectedAgent}
            >
              {agents.map(agent => (
                <Option key={agent.id} value={agent.id}>
                  {agent.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="搜索会话ID或用户ID"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={conversations}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 20);
            },
          }}
        />
      </Card>

      {/* 对话详情模态框 */}
      <Modal
        title="对话详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {selectedConversation && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <p><strong>会话ID:</strong> {selectedConversation.sessionId}</p>
              <p><strong>智能体:</strong> {selectedConversation.agent.name}</p>
              <p><strong>用户ID:</strong> {selectedConversation.userId}</p>
              <p><strong>状态:</strong> 
                <Tag color={selectedConversation.status === 'active' ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                  {selectedConversation.status === 'active' ? '活跃' : '已关闭'}
                </Tag>
              </p>
              <p><strong>创建时间:</strong> {new Date(selectedConversation.createdAt).toLocaleString('zh-CN')}</p>
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {selectedConversation.messages?.map((message, index) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    backgroundColor: message.role === 'user' ? '#f0f0f0' : '#e6f7ff',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {message.role === 'user' ? '用户' : '智能体'}
                  </div>
                  <div>{message.content}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {new Date(message.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Conversations; 