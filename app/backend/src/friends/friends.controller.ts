import {
    Controller, Get, Post, Body, Patch, Param, Delete, Request,
    UseGuards, ParseIntPipe
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('friends')
@UseGuards(JwtAuthGuard) // Protect all routes with JWT authentication
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) { }

    @Get()
    getMyFriends(@Request() req) {
        return this.friendsService.getMyFriends(req.user.id);
    }

    @Get('requests/received')
    getReceivedRequests(@Request() req) {
        return this.friendsService.getReceivedFriendRequests(req.user.id);
    }

    @Get('requests/sent')
    getSentRequests(@Request() req) {
        return this.friendsService.getSentRequests(req.user.id);
    }

    @Post('request')
    sendFriendRequest(@Request() req, @Body() createFriendDto: CreateFriendDto) {
        return this.friendsService.sendFriendRequest(req.user.id, createFriendDto);
    }

    @Patch('request/:id')
    respondToRequest(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFriendDto: UpdateFriendDto
    ) {
        return this.friendsService.updateStatus(id, req.user.id, updateFriendDto);
    }

    @Delete(':id')
    removeFriend(
        @Request() req,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.friendsService.remove(id, req.user.id);
    }
}
