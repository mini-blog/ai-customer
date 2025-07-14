import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Switch, 
  Space, 
  Typography, 
  message, 
  Popconfirm,
  Tag,
  Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title } = Typography;
const { TextArea } = Input;

interface Agent {
  id: number;
  name: string;
  description: string;
  difyAppId: string;
  difyApiKey: string;
  difyBaseUrl: string;
  isActive: boolean;
  totalConversations: number;
  totalMessages: number;
  createdAt: string;
  updatedAt: string;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [form] = Form.useForm();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAgents();
    }
  }, [isAuthenticated]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/admin/agents');
      setAgents(response.data);
    } catch (error) {
      message.error('获取智能体列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAgent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Agent) => {
    setEditingAgent(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/agents/${id}`);
      message.success('删除成功');
      fetchAgents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAgent) {
        await api.put(`/admin/agents/${editingAgent.id}`, values);
        message.success('更新成功');
      } else {
        await api.post('/admin/agents', values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchAgents();
    } catch (error) {
      message.error(editingAgent ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Dify App ID',
      dataIndex: 'difyAppId',
      key: 'difyAppId',
      width: 150,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {text.substring(0, 8)}...
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '对话数',
      dataIndex: 'totalConversations',
      key: 'totalConversations',
      width: 100,
    },
    {
      title: '消息数',
      dataIndex: 'totalMessages',
      key: 'totalMessages',
      width: 100,
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
      width: 150,
      render: (_: any, record: Agent) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个智能体吗？"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>智能体管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建智能体
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={agents}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingAgent ? '编辑智能体' : '创建智能体'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入智能体名称' }]}
          >
            <Input placeholder="请输入智能体名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入智能体描述' }]}
          >
            <TextArea rows={3} placeholder="请输入智能体描述" />
          </Form.Item>

          <Form.Item
            name="difyAppId"
            label="Dify App ID"
            rules={[{ required: true, message: '请输入Dify App ID' }]}
          >
            <Input placeholder="请输入Dify App ID" />
          </Form.Item>

          <Form.Item
            name="difyApiKey"
            label="Dify API Key"
            rules={[{ required: true, message: '请输入Dify API Key' }]}
          >
            <Input.Password placeholder="请输入Dify API Key" />
          </Form.Item>

          <Form.Item
            name="difyBaseUrl"
            label="Dify Base URL"
            initialValue="http://localhost:5001"
          >
            <Input placeholder="请输入Dify Base URL" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAgent ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Agents; 