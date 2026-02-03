import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatRoom } from '../../chat-rooms/entities/chat-room.entity';
import { Reaction } from './reaction.entity';

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  DELETED = 'deleted',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Index('idx_messages_search', { synchronize: false })
  @Column({
    type: 'tsvector',
    nullable: true,
    select: false,
  })
  searchVector: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  senderId: number;

  @ManyToOne(() => ChatRoom)
  room: ChatRoom;

  @Column()
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  // File/image upload
  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileType: string; // 'image' | 'file'

  @Column({ nullable: true })
  mimeType: string;

  @OneToMany(() => Reaction, (reaction) => reaction.message)
  reactions: Reaction[];
}
