import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ChatRoom } from "../chat-rooms/chat-room.entity";
import { Message } from "../messages/message.entity";
import { RoomParticipant } from "../chat-rooms/room-participant.entity";

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100, nullable: true })
	username: string;

	@Column({ length: 100, unique: true })
	email: string;

	@Column({ name: 'password_hash', nullable: true })
	passwordHash: string;

	@Column({ length: 50 })
	provider: string;

	@Column({ name: 'profile_completed', default: false })
	profileCompleted: boolean;

	@Column({ length: 255, nullable: true })
	avatarUrl: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ name: 'social_id', nullable: true })
	socialId: string;

	// Chat room which user made
	@OneToMany(() => ChatRoom, (chatRoom) => chatRoom.createdBy)
	createdChatRooms: ChatRoom[];

	@OneToMany(() => Message, (message) => message.sender)
	messages: Message[];

	@OneToMany(() => RoomParticipant, (roomParticipant) => roomParticipant.user)
	participatingRooms: RoomParticipant[];
}