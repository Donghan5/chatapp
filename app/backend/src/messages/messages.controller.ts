import { Controller, Get, Post, Query, Body, Request, BadRequestException, ParseIntPipe, Param, Patch, Delete } from "@nestjs/common";
import { MessageService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-messages.dto";
import { EventPattern, Payload } from "@nestjs/microservices";
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from "@nestjs/platform-express";
import { extname } from 'path';
@Controller('messages')
export class MessageController {
	constructor(private readonly messageService: MessageService) { }

	@Get()
	async getMessagesByRoom(
		@Query('roomId', ParseIntPipe) roomId: number,  
		@Query('cursor') cursor: number | undefined, 
		@Query('limit') limit?: string    
	) {
		const numericLimit = limit  ? parseInt(limit, 10) : 20;
		console.log('[getMessagesByRoom] Called with roomId:', roomId, 'limit:', numericLimit);
		const result = await this.messageService.getMessagesByRoom(roomId, cursor, numericLimit);
		console.log('[getMessagesByRoom] Returning', result.data.length, 'messages');
		return result;
	}

	@Post()
	async createMessage(@Body() createMessageDto: CreateMessageDto) {
		return this.messageService.createMessage(createMessageDto);
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

	@Post(':id/reactions')
	addReaction(
		@Request() req,
		@Param('id', ParseIntPipe) messageId: number,
		@Body('emoji') emoji: string
	) {
		return this.messageService.addReaction(req.user.id, messageId, emoji);
	}


	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: './uploads/messages',
			filename: (req, file, cb) => {
				const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				cb(null, `${uniqueName}${extname(file.originalname)}`);
			}
		}),
		limits: { fileSize: 10 * 1024 * 1024 },
	}))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Request() req,
		@Body('roomId') roomId: string,
	) {
		const isImage = file.mimetype.startsWith('image/');
		return this.messageService.createFileMessage(
			req.user.id,
			parseInt(roomId),
			`/uploads/messages/${file.filename}`,
			file.originalname,
			isImage ? 'image' : 'file',
			file.mimetype,
		);
	}
}
