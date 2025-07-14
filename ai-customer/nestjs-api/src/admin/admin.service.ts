import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerServiceAgent } from '../entities/customer-service-agent.entity';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(CustomerServiceAgent)
    private agentRepository: Repository<CustomerServiceAgent>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 智能体管理
  async createAgent(agentData: Partial<CustomerServiceAgent>): Promise<CustomerServiceAgent> {
    const agent = this.agentRepository.create(agentData);
    return this.agentRepository.save(agent);
  }

  async getAllAgents(): Promise<CustomerServiceAgent[]> {
    return this.agentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getAgentById(id: number): Promise<CustomerServiceAgent> {
    const agent = await this.agentRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException('智能体不存在');
    }
    return agent;
  }

  async updateAgent(id: number, agentData: Partial<CustomerServiceAgent>): Promise<CustomerServiceAgent> {
    await this.agentRepository.update(id, agentData);
    return this.getAgentById(id);
  }

  async deleteAgent(id: number): Promise<void> {
    const result = await this.agentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('智能体不存在');
    }
  }

  // 对话管理
  async getConversations(page: number = 1, limit: number = 20, agentId?: number): Promise<any> {
    const query = this.conversationRepository.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.agent', 'agent')
      .orderBy('conversation.createdAt', 'DESC');

    if (agentId) {
      query.where('conversation.agentId = :agentId', { agentId });
    }

    const [conversations, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      conversations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversationById(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['agent', 'messages'],
    });
    if (!conversation) {
      throw new NotFoundException('对话不存在');
    }
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    const result = await this.conversationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('对话不存在');
    }
  }

  // 统计信息
  async getDashboardStats(): Promise<any> {
    const [
      totalAgents,
      activeAgents,
      totalConversations,
      totalMessages,
      totalUsers,
    ] = await Promise.all([
      this.agentRepository.count(),
      this.agentRepository.count({ where: { isActive: true } }),
      this.conversationRepository.count(),
      this.messageRepository.count(),
      this.userRepository.count(),
    ]);

    // 获取最近7天的对话统计
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentConversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.createdAt >= :date', { date: sevenDaysAgo })
      .getCount();

    return {
      totalAgents,
      activeAgents,
      totalConversations,
      totalMessages,
      totalUsers,
      recentConversations,
    };
  }

  async getAgentStats(agentId: number): Promise<any> {
    const agent = await this.getAgentById(agentId);
    
    const [
      totalConversations,
      totalMessages,
      recentConversations,
    ] = await Promise.all([
      this.conversationRepository.count({ where: { agentId } }),
      this.messageRepository.count({
        where: { conversation: { agentId } },
      }),
      this.conversationRepository.count({
        where: {
          agentId,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return {
      agent,
      totalConversations,
      totalMessages,
      recentConversations,
    };
  }
} 