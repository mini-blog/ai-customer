import React, { useState } from 'react';
import { Card, Input, Button, List, Typography, Space, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import api from '../services/api';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TestChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
  const [agentId, setAgentId] = useState(1);
  const [agents, setAgents] = useState<any[]>([]);

  React.useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/admin/agents');
      setAgents(response.data);
      if (response.data.length > 0) {
        setAgentId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await api.post('/customer-service/chat', {
        message: message,
        agentId: agentId,
        sessionId: sessionId,
        userId: 'test-user',
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，发送消息失败，请稍后重试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card title="客服聊天测试" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>智能体:</Text>
          <Select
            value={agentId}
            onChange={setAgentId}
            style={{ width: 200, marginLeft: 8 }}
          >
            {agents.map(agent => (
              <Option key={agent.id} value={agent.id}>
                {agent.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Text strong>会话ID:</Text>
          <Input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            style={{ width: 300, marginLeft: 8 }}
          />
        </div>

        <div style={{ height: 400, border: '1px solid #d9d9d9', borderRadius: 6, padding: 16, overflowY: 'auto' }}>
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item style={{ border: 'none', padding: '8px 0' }}>
                <div style={{
                  width: '100%',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}>
                  <div style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    backgroundColor: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                    color: msg.role === 'user' ? 'white' : 'black',
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
            style={{ height: 'auto' }}
          >
            发送
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default TestChat; 