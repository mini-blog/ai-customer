import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CustomerServiceAgent } from '../entities/customer-service-agent.entity';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerServiceAgent, Conversation, Message, User]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 