import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RoomParticipant } from './entities/room-participant.entity';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

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

    async createChatRoom(
        createChatRoomDto: CreateChatRoomDto,
        creatorId: number,
    ): Promise<ChatRoom> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const manager = queryRunner.manager;

            let roomName = createChatRoomDto.name;

            if (!roomName) {
                const creator = await manager.findOne(User, { where: { id: creatorId } });
                const names = [creator?.username];

                if (createChatRoomDto.inviteUserIds?.length) {
                    const invitedUsers = await manager.find(User, { where: { id: In(createChatRoomDto.inviteUserIds) } });
                    names.push(...invitedUsers.map(u => u.username));
                }

                roomName = names.filter(n => n).join(', ');
            }

            const newRoom = manager.create(ChatRoom, {
                name: roomName,
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

    private async addParticipant(
        manager: EntityManager,
        roomId: number,
        userId: number,
        isAdmin: boolean = false,
    ) {
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
            order: { lastMessageAt: 'DESC' },
        });
    }

    async getChatRoomById(roomId: number): Promise<ChatRoom> {
        const room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ['participants', 'createdBy'],
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

    async inviteUserToChatRoom(
        targetUserId: number,
        roomId: number,
    ): Promise<void> {
        return this.addParticipantToRoom(targetUserId, roomId);
    }

    async deleteChatRoom(roomId: number, userId: number): Promise<void> {
        const room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ['createdBy'],
        });

        if (!room) throw new NotFoundException('Room not found');

        if (room.createdBy.id !== userId) {
            throw new BadRequestException('Only the creator can delete this room');
        }

        await this.chatRoomRepository.delete(roomId);
    }

    async markAsRead(userId: number, roomId: number) {
        await this.roomParticipantRepository.update(
            { userId, roomId },
            { lastReadAt: new Date() },
        );
    }

    async updateChatRoom(
        roomId: number,
        userId: number,
        updateChatRoomDto: UpdateChatRoomDto,
    ): Promise<void> {
        const room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ['createdBy'],
        });

        if (!room) throw new NotFoundException('Room not found');

        if (room.createdBy.id !== userId) {
            throw new BadRequestException('Only the creator can update this room');
        }

        await this.chatRoomRepository.update(roomId, updateChatRoomDto);
    }

    private async addParticipantToRoom(
        userId: number,
        roomId: number,
    ): Promise<void> {
        const room = await this.chatRoomRepository.findOne({
            where: { id: roomId },
        });
        if (!room) {
            throw new NotFoundException('Chat room not found');
        }

        const existingParticipant = await this.roomParticipantRepository.findOne({
            where: { userId, roomId },
        });
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

