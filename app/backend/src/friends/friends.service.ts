import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { FriendStatus } from './entities/friend.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        private readonly usersService: UsersService,
    ) { }

    async sendFriendRequest(requesterId: number, createFriendDto: CreateFriendDto) {
        const { recipientId } = createFriendDto;

        if (requesterId === recipientId) {
            throw new BadRequestException('You cannot send a friend request to yourself');
        }

        const recipient = await this.usersService.findUserById(recipientId);
        if (!recipient) {
            throw new NotFoundException('Recipient not found');
        }

        const existing = await this.friendRepository.findOne({
            where: [
                { requester: { id: requesterId }, recipient: { id: recipientId } },
                { requester: { id: recipientId }, recipient: { id: requesterId } },
            ],
        });

        if (existing) {
            if (existing.status === FriendStatus.ACCEPTED) {
                throw new ConflictException('You are already friends with this user');
            }

            if (existing.status === FriendStatus.PENDING) {
                throw new ConflictException('You have already sent a friend request to this user');
            }

            if (existing.status === FriendStatus.REJECTED) {
                await this.friendRepository.remove(existing);
            }
        }

        const friendRequest = await this.friendRepository.create({
            requester: { id: requesterId },
            recipient: { id: recipientId },
            status: FriendStatus.PENDING,
        });

        await this.friendRepository.save(friendRequest);

        return friendRequest;
    }

    async getReceivedFriendRequests(userId: number) {
        const receivedRequests = await this.friendRepository.find({
            where: {
                recipient: { id: userId },
                status: FriendStatus.PENDING,
            },
            relations: ['requester'],
        });

        return receivedRequests;
    }

    async getSentRequests(userId: number) {
        const sentRequests = await this.friendRepository.find({
            where: {
                requester: { id: userId },
                status: FriendStatus.PENDING,
            },
            relations: ['recipient'],
        });

        return sentRequests;
    }

    async getMyFriends(userId: number) {
        const friends = await this.friendRepository.find({
            where: [
                { requester: { id: userId }, status: FriendStatus.ACCEPTED },
                { recipient: { id: userId }, status: FriendStatus.ACCEPTED },
            ],
            relations: ['requester', 'recipient'],
        });

        const formattedFriends = friends.map(friend =>
            friend.requester.id === userId ? friend.recipient : friend.requester);
        return formattedFriends;
    }

    async updateStatus(id: number, userId: number, updateFriendDto: UpdateFriendDto) {
        // Update --> Accept or Reject
        const friendRequest = await this.friendRepository.findOne({
            where: { id },
            relations: ['recipient'],
        });

        if (!friendRequest) {
            throw new NotFoundException('Friend request not found');
        }

        if (updateFriendDto.status === FriendStatus.ACCEPTED && friendRequest.recipient.id !== userId) {
            throw new BadRequestException('You can only accept requests sent to you');
        }

        if (updateFriendDto.status === FriendStatus.REJECTED && friendRequest.recipient.id !== userId) {
            throw new BadRequestException('You can only reject requests sent to you');
        }


        friendRequest.status = updateFriendDto.status;

        if (updateFriendDto.status === FriendStatus.ACCEPTED) {
            friendRequest.matchedAt = new Date();
        }

        return await this.friendRepository.save(friendRequest);
    }

    async remove(id: number, userId: number) {
        const friend = await this.friendRepository.findOne({
            where: { id },
            relations: ['requester', 'recipient'],
        });

        if (!friend) {
            throw new NotFoundException('Friend not found');
        }

        if (friend.requester.id !== userId && friend.recipient.id !== userId) {
            throw new BadRequestException('You do not have permission to delete this friend');
        }

        return await this.friendRepository.remove(friend);
    }
}
