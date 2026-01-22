import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chat-room.entity";
import { RoomParticipant } from "./entities/room-participant.entity";
import { ChatRoomService } from "./chat-room.service";
import { ChatRoomsController } from "./chat-room.controller";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, RoomParticipant, User]),
  ],
  providers: [ChatRoomService],
  controllers: [ChatRoomsController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}