import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";
import { ChatRoom } from "../chat-rooms/chat-room.entity";

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id!: number;

	@Column('text')
	content!: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;

	@ManyToOne(() => User, (user) => user.messages)
	sender: User;

	@ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
	room: ChatRoom;
}
