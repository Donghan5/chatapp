import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatRoom } from '../../chat-rooms/entities/chat-room.entity';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column('text')
  content!: string;

  @Column('boolean', { default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  room: ChatRoom;
}
