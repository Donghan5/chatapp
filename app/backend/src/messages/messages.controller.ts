import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-messages.dto";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller('messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) { }

	@Get()
	async getMessagesByRoom(@Query('roomId') roomId: number, @Query('cursor') cursor: number | undefined, @Query('limit') limit: number) {
		return this.messageService.getMessagesByRoom(roomId, cursor, limit);
	}

	@Post()
	async createMessage(@Body() createMessageDto: CreateMessageDto) {
		return this.messageService.createMessage(createMessageDto);
	}

	// added to Message persistence
	@EventPattern('chat.message.create')
	async handleMessageCreate(@Payload() payload: { content: string, roomId: number, senderId: number }) {
		console.log('Received message from Kafka:', payload);
		await this.messageService.saveMessage(payload.content, payload.roomId, payload.senderId);
	}
}