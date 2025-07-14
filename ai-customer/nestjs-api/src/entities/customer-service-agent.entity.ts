import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customer_service_agents')
export class CustomerServiceAgent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  difyAppId: string;

  @Column()
  difyApiKey: string;

  @Column({ default: 'http://localhost:5001' })
  difyBaseUrl: string;

  @Column({ type: 'json', nullable: true })
  config: any;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  totalConversations: number;

  @Column({ default: 0 })
  totalMessages: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 