import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard'; //
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('chat-rooms')
@UseGuards(JwtAuthGuard)
export class ChatRoomsController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  createChatRoom(@Request() req, @Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.createChatRoom(createChatRoomDto, req.user.id);
  }

  @Get('my')
  getMyChatRooms(@Request() req) {
    return this.chatRoomService.getMyChatRooms(req.user.id);
  }

  @Get(':id')
  getChatRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomService.getChatRoomById(id);
  }

  @Delete(':id')
  deleteChatRoom(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatRoomService.deleteChatRoom(id, req.user.id);
  }

  @Delete(':id/leave')
  leaveChatRoom(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatRoomService.leaveChatRoom(req.user.id, id);
  }

  @Patch(':id')
  updateChatRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ) {
    return this.chatRoomService.updateChatRoom(
      id,
      req.user.id,
      updateChatRoomDto,
    );
  }

  @Post(':id/join')
  joinChatRoom(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.chatRoomService.joinChatRoom(req.user.id, id);
  }

  @Post(':id/invite')
  inviteUserToChatRoom(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    return this.chatRoomService.inviteUserToChatRoom(
      inviteUserDto.targetUserId,
      id,
    );
  }

  @Delete(':id/participants/:userId')
    removeParticipant(
      @Request() req,
      @Param('id', ParseIntPipe) roomId: number,
      @Param('userId', ParseIntPipe) targetUserId: number,
    ) {
      return this.chatRoomService.removeParticipant(req.user.id, roomId, targetUserId);
    }

    @Patch(':id/participants/:userId/role')
    updateParticipantRole(
      @Request() req,
      @Param('id', ParseIntPipe) roomId: number,
      @Param('userId', ParseIntPipe) targetUserId: number,
      @Body() updateRoleDto: UpdateRoleDto,
    ) {
      return this.chatRoomService.updateParticipantRole(
        req.user.id,
        roomId,
        targetUserId,
        updateRoleDto.role,
      );
    }
}

