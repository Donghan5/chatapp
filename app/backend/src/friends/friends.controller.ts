import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Request, 
  UseGuards, ParseIntPipe
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  sendFriendRequest(@Request() req, @Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.sendFriendRequest(req.user.id, createFriendDto);
  }

  @Get() 
  getReceivedFriendRequests(@Request() req) {
    return this.friendsService.getReceivedFriendRequests(req.user.id);
  }

  @Get('sent')
  getSentFriendRequests(@Request() req) {
    return this.friendsService.getSentRequests(req.user.id);
  }

  @Get('my')
  getMyFriends(@Request() req) {
    return this.friendsService.getMyFriends(req.user.id);
  }

  @Patch('status/:id')
  update(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateFriendDto: UpdateFriendDto
  ) {
    return this.friendsService.updateStatus(id, req.user.id, updateFriendDto);
  }

  @Delete(':id')
  remove(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.friendsService.remove(id, req.user.id);
  }
}