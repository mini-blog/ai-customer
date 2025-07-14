import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerServiceService, ChatRequest, ChatResponse } from './customer-service.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('客服服务')
@Controller('customer-service')
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) {}

  @Post('chat')
  @ApiOperation({ summary: '发送消息给客服智能体' })
  @ApiResponse({ status: 200, description: '成功获取回复' })
  @ApiResponse({ status: 404, description: '智能体不存在' })
  async chat(@Body() request: ChatRequest): Promise<ChatResponse> {
    return this.customerServiceService.chat(request);
  }

  @Get('history/:sessionId')
  @ApiOperation({ summary: '获取对话历史' })
  @ApiResponse({ status: 200, description: '成功获取对话历史' })
  async getConversationHistory(
    @Param('sessionId') sessionId: string,
    @Query('agentId') agentId: number,
  ) {
    return this.customerServiceService.getConversationHistory(sessionId, agentId);
  }

  @Get('stats/:agentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取智能体统计信息' })
  @ApiResponse({ status: 200, description: '成功获取统计信息' })
  async getConversationStats(@Param('agentId') agentId: number) {
    return this.customerServiceService.getConversationStats(agentId);
  }
} 