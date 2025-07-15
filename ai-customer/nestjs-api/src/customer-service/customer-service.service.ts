import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { CustomerServiceAgent } from '../entities/customer-service-agent.entity';
import { DifyService, DifyMessageRequest } from './dify.service';

export interface ChatRequest {
  message: string;
  sessionId?: string;
  userId?: string;
  agentId: number;
}

export interface ChatResponse {
  answer: string;
  sessionId: string;
  conversationId: number;
  intent?: string;
  confidence?: number;
}

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CustomerServiceAgent)
    private agentRepository: Repository<CustomerServiceAgent>,
    private difyService: DifyService,
  ) {}

  async chat(request: ChatRequest): Promise<ChatResponse> {
    // 获取智能体配置
    const agent = await this.agentRepository.findOne({
      where: { id: request.agentId, isActive: true },
    });

    if (!agent) {
      throw new NotFoundException('智能体不存在或已禁用');
    }

    // 生成或获取会话ID
    const sessionId = request.sessionId;

    // 查找或创建对话
    let conversation = await this.conversationRepository.findOne({
      where: { sessionId, agentId: request.agentId },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        sessionId,
        userId: request.userId,
        agentId: request.agentId,
        status: 'active',
      });
      await this.conversationRepository.save(conversation);
    }

    // 保存用户消息
    const userMessage = this.messageRepository.create({
      conversationId: conversation.id,
      role: 'user',
      content: request.message,
    });
    await this.messageRepository.save(userMessage);

    // 调用Dify API
    const difyRequest: DifyMessageRequest = {
      inputs: {
        user_question: request.message,
        user_id: request.userId || 'anonymous',
        session_id: sessionId,
      },
      query: request.message,
      response_mode: 'blocking',
      user: request.userId || 'anonymous',
      conversation_id: conversation.sessionId,
    };

    const difyResponse = await this.difyService.sendMessage(
      agent.difyAppId,
      agent.difyApiKey,
      agent.difyBaseUrl,
      difyRequest,
    );

    // 保存助手回复
    const assistantMessage = this.messageRepository.create({
      conversationId: conversation.id,
      role: 'assistant',
      content: difyResponse.answer,
      metadata: {
        dify_message_id: difyResponse.message_id,
        usage: difyResponse.metadata.usage,
      },
    });
    await this.messageRepository.save(assistantMessage);

    // 更新对话统计
    await this.conversationRepository.update(conversation.id, {
      sessionId: difyResponse.conversation_id,
      totalMessages: conversation.totalMessages + 2,
    });

    // 更新智能体统计
    await this.agentRepository.update(agent.id, {
      totalMessages: agent.totalMessages + 2,
    });

    return {
      answer: difyResponse.answer,
      sessionId: difyResponse.conversation_id,
      conversationId: conversation.id,
    };
  }

  async getConversationHistory(sessionId: string, agentId: number): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { sessionId, agentId },
    });

    if (!conversation) {
      return [];
    }

    return this.messageRepository.find({
      where: { conversationId: conversation.id },
      order: { createdAt: 'ASC' },
    });
  }

  async getConversationStats(agentId: number): Promise<any> {
    const [totalConversations, totalMessages] = await Promise.all([
      this.conversationRepository.count({ where: { agentId } }),
      this.messageRepository.count({
        where: { conversation: { agentId } },
      }),
    ]);

    return {
      totalConversations,
      totalMessages,
    };
  }
} 