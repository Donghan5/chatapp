import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-messages.dto";

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
}