import { Controller, Get, Post, Query, Body, Request, BadRequestException, ParseIntPipe, Param, Patch, Delete } from "@nestjs/common";
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

	@Get('search')
	searchMessages(
		@Request() req,
		@Query('q') query: string,
		@Query('roomId') roomId?: string,
	) {
		if (!query || query.trim().length < 2) {
			throw new BadRequestException('Query must be at least 2 characters');
		}

		return this.messageService.searchMessages(
			req.user.id,
			query.trim(),
			roomId ? parseInt(roomId, 10) : undefined,
		);
	}

	@Patch(':id')
    async editMessage(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body('content') content: string,
    ) {
        if (!content || content.trim().length === 0) {
            throw new BadRequestException('Content cannot be empty');
        }
        return this.messageService.editMessage(req.user.id, id, content.trim());
    }

	@Delete(':id')
	async deleteMessage(
			@Request() req,
			@Param('id', ParseIntPipe) id: number,
	) {
			return this.messageService.deleteMessage(req.user.id, id);
	}
}