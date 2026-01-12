import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/entities/user.entity";
import { ChatRoom } from "../chat-room.entity";

@Entity('room_participants')
export class RoomParticipant {
	@PrimaryColumn({ name: 'user_id' })
	userId!: number;

	@PrimaryColumn({ name: 'room_id' })
	roomId!: number;

	@Column({ length: 20, default: 'user' })
	role!: string;

	@ManyToOne(() => User, (user) => user.participatingRooms, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => ChatRoom, (room) => room.participants, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'room_id' })
	room: ChatRoom;

	@CreateDateColumn({ name: 'joined_at' })
	joinedAt: Date;

	@Column({ name: 'last_read_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	lastReadAt: Date;
}