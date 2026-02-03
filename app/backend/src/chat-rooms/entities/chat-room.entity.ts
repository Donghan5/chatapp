import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
import { RoomParticipant } from './room-participant.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true })
  description!: string;

  @Column({ name: 'is_group_chat', default: false })
  isGroupChat!: boolean;

  @Column({
    name: 'last_message_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastMessageAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.createdChatRooms, {
    onDelete: 'SET NULL',
  })
  createdBy: User;

  @OneToMany(() => RoomParticipant, (roomParticipant) => roomParticipant.room)
  participants: RoomParticipant[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}

