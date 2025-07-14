import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('后台管理')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 智能体管理
  @Post('agents')
  @ApiOperation({ summary: '创建智能体' })
  @ApiResponse({ status: 201, description: '智能体创建成功' })
  async createAgent(@Body() agentData: any) {
    return this.adminService.createAgent(agentData);
  }

  @Get('agents')
  @ApiOperation({ summary: '获取所有智能体' })
  @ApiResponse({ status: 200, description: '成功获取智能体列表' })
  async getAllAgents() {
    return this.adminService.getAllAgents();
  }

  @Get('agents/:id')
  @ApiOperation({ summary: '获取智能体详情' })
  @ApiResponse({ status: 200, description: '成功获取智能体详情' })
  async getAgentById(@Param('id') id: number) {
    return this.adminService.getAgentById(id);
  }

  @Put('agents/:id')
  @ApiOperation({ summary: '更新智能体' })
  @ApiResponse({ status: 200, description: '智能体更新成功' })
  async updateAgent(@Param('id') id: number, @Body() agentData: any) {
    return this.adminService.updateAgent(id, agentData);
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: '删除智能体' })
  @ApiResponse({ status: 200, description: '智能体删除成功' })
  async deleteAgent(@Param('id') id: number) {
    return this.adminService.deleteAgent(id);
  }

  // 对话管理
  @Get('conversations')
  @ApiOperation({ summary: '获取对话列表' })
  @ApiResponse({ status: 200, description: '成功获取对话列表' })
  async getConversations(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('agentId') agentId?: number,
  ) {
    return this.adminService.getConversations(page, limit, agentId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: '获取对话详情' })
  @ApiResponse({ status: 200, description: '成功获取对话详情' })
  async getConversationById(@Param('id') id: number) {
    return this.adminService.getConversationById(id);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: '删除对话' })
  @ApiResponse({ status: 200, description: '对话删除成功' })
  async deleteConversation(@Param('id') id: number) {
    return this.adminService.deleteConversation(id);
  }

  // 统计信息
  @Get('stats/dashboard')
  @ApiOperation({ summary: '获取仪表板统计信息' })
  @ApiResponse({ status: 200, description: '成功获取统计信息' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/agents/:id')
  @ApiOperation({ summary: '获取智能体统计信息' })
  @ApiResponse({ status: 200, description: '成功获取智能体统计信息' })
  async getAgentStats(@Param('id') id: number) {
    return this.adminService.getAgentStats(id);
  }
} 