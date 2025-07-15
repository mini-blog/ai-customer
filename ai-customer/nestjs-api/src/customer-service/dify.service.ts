import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface DifyMessageRequest {
  inputs: Record<string, any>;
  query: string;
  response_mode: 'blocking' | 'streaming';
  user: string;
  conversation_id?: string;
}

export interface DifyMessageResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  metadata: {
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

@Injectable()
export class DifyService {
  private readonly axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(
    appId: string,
    apiKey: string,
    baseUrl: string,
    request: DifyMessageRequest,
  ): Promise<DifyMessageResponse> {
    try {
      const response = await this.axiosInstance.post(
        `${baseUrl}/chat-messages`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Dify API错误: ${error.response.data?.message || error.message}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Dify服务连接失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getConversationHistory(
    appId: string,
    apiKey: string,
    baseUrl: string,
    conversationId: string,
  ): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(
        `${baseUrl}/v1/chat-messages`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          params: {
            conversation_id: conversationId,
            limit: 50,
          },
        },
      );

      return response.data.data || [];
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `获取对话历史失败: ${error.response.data?.message || error.message}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Dify服务连接失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteConversation(
    appId: string,
    apiKey: string,
    baseUrl: string,
    conversationId: string,
  ): Promise<void> {
    try {
      await this.axiosInstance.delete(
        `${baseUrl}/v1/chat-messages`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          params: {
            conversation_id: conversationId,
          },
        },
      );
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `删除对话失败: ${error.response.data?.message || error.message}`,
          error.response.status,
        );
      }
      throw new HttpException(
        `Dify服务连接失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 