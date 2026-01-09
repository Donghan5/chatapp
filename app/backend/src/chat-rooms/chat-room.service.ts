import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateChatRoomDto } from "./create-chat-room.dto";
import { ChatRoom } from "./chat-room.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, EntityManager } from "typeorm";
import { User } from "../users/user.entity";
import { RoomParticipant } from "./room-participant.entity";

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(RoomParticipant)
        private roomParticipantRepository: Repository<RoomParticipant>,
        private dataSource: DataSource,
    ) { }

    async createChatRoom(createChatRoomDto: CreateChatRoomDto, creatorId: number): Promise<ChatRoom> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const manager = queryRunner.manager;

            const newRoom = manager.create(ChatRoom, {
                name: createChatRoomDto.name,
                isGroupChat: createChatRoomDto.isGroup,
                createdBy: { id: creatorId },
                description: '',
            });

            const savedRoom = await manager.save(newRoom);

            await this.addParticipant(manager, savedRoom.id, creatorId, true);

            if (createChatRoomDto.inviteUserIds) {
                for (const userId of createChatRoomDto.inviteUserIds) {
                    await this.addParticipant(manager, savedRoom.id, userId, false);
                }
            }

            await queryRunner.commitTransaction();
            return savedRoom;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error);
            throw new InternalServerErrorException('Failed to create chat room');
        } finally {
            await queryRunner.release();
        }
    }

    private async addParticipant(manager: EntityManager, roomId: number, userId: number, isAdmin: boolean = false) {
        const participant = manager.create(RoomParticipant, {
            user: { id: userId } as User,
            room: { id: roomId } as ChatRoom,
            role: isAdmin ? 'admin' : 'user',
        });

        await manager.save(participant);
    }

    async getMyChatRooms(userId: number): Promise<ChatRoom[]> {
        return this.chatRoomRepository.find({
            where: { participants: { user: { id: userId } } },
            relations: ['participants', 'createdBy'],
            order: { lastMessageAt: 'DESC' }
        });
    }

    async getChatRoomById(roomId: number): Promise<ChatRoom> {
        const room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ['participants', 'createdBy']
        });
        
        if (!room) throw new NotFoundException('Chat room not found');
        return room;
    }

    async leaveChatRoom(userId: number, roomId: number): Promise<void> {
        await this.roomParticipantRepository.delete({ userId, roomId });
    }

    async joinChatRoom(userId: number, roomId: number): Promise<void> {
        return this.addParticipantToRoom(userId, roomId);
    }

    async inviteUserToChatRoom(targetUserId: number, roomId: number): Promise<void> {
        return this.addParticipantToRoom(targetUserId, roomId);
    }

    async deleteChatRoom(roomId: number): Promise<void> {
        await this.chatRoomRepository.delete(roomId);
    }

	async markAsRead(userId: number, roomId: number) {
		await this.roomParticipantRepository.update(
			{ userId, roomId },
			{ lastReadAt: new Date() },
		);
	}

    private async addParticipantToRoom(userId: number, roomId: number): Promise<void> {
        const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new NotFoundException('Chat room not found');
        }

        const existingParticipant = await this.roomParticipantRepository.findOne({ where: { userId, roomId } });
        if (existingParticipant) {
            throw new BadRequestException('User is already in the chat room');
        }

        const newParticipant = this.roomParticipantRepository.create({
            userId: userId,
            roomId: roomId,
            role: 'user',
        });

        await this.roomParticipantRepository.save(newParticipant);
    }
}