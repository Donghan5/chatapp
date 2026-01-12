import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ChatRoom } from "../../chat-rooms/entities/chat-room.entity";
import { Messages } from "../messages/messages.entity";
import { RoomParticipant } from "../../chat-rooms/room-participant.entity";
import { Friend } from "src/friends/entities/friend.entity";

/*
	User settings (basic)
*/
export interface UserSettings {
	theme: 'light' | 'dark' | 'system';
	isPushEnabled: boolean;
	isMarketingAgreed: boolean;
}

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

	@Column({ length: 100, nullable: true })
	statusMessage: string;

	@Column({
		type: 'jsonb',
		default: { theme: 'system', isPushEnabled: true, isMarketingAgreed: false }
	})
	settings: UserSettings;

	// Chat room which user made
	@OneToMany(() => ChatRoom, (chatRoom) => chatRoom.createdBy)
	createdChatRooms: ChatRoom[];

	@OneToMany(() => Messages, (message) => message.sender)
	messages: Messages[];

	@OneToMany(() => RoomParticipant, (roomParticipant) => roomParticipant.user)
	participatingRooms: RoomParticipant[];

	@OneToMany(() => Friend, (friend) => friend.requester)
    sentFriendRequests: Friend[];

    @OneToMany(() => Friend, (friend) => friend.recipient)
    receivedFriendRequests: Friend[];
}