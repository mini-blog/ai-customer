import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CustomerServiceAgent } from './customer-service-agent.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  agentId: number;

  @ManyToOne(() => CustomerServiceAgent)
  @JoinColumn({ name: 'agentId' })
  agent: CustomerServiceAgent;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'enum', enum: ['active', 'closed', 'archived'], default: 'active' })
  status: 'active' | 'closed' | 'archived';

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  totalMessages: number;
} 