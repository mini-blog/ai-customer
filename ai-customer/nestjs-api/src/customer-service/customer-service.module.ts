import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { DifyService } from './dify.service';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { CustomerServiceAgent } from '../entities/customer-service-agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, CustomerServiceAgent]),
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService, DifyService],
  exports: [CustomerServiceService, DifyService],
})
export class CustomerServiceModule {} 