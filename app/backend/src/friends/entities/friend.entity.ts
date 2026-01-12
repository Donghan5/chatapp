import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum FriendStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

@Entity('friends')
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentFriendRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'requester_id' })
    requester: User;

    @ManyToOne(() => User, (user) => user.receivedFriendRequests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @Column({
        type: 'enum',
        enum: FriendStatus,
        default: FriendStatus.PENDING,
    })
    status: FriendStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'matched_at', nullable: true })
    matchedAt: Date;
}