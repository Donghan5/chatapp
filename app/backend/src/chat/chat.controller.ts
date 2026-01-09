import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload, Ctx, KafkaContext } from "@nestjs/microservices";
import { ChatService } from "./chat.service";

interface ChatMessage {
	roomId: number;
	content: string;
	senderId: number;
	senderEmail?: string;
}

@Controller()
export class ChatController {
	private readonly logger = new Logger(ChatController.name);

	constructor(private readonly chatService: ChatService) { }

	@EventPattern('chat.send')
	async handleChatSend(
		@Payload() message: ChatMessage,
		@Ctx() context: KafkaContext
	) {
		try {
			this.logger.log(`Kafka Message Received: ${JSON.stringify(message)}`);

			if (!message.roomId || !message.senderId || !message.content) {
				this.logger.error('Invalid message payload');
				return;
			}

			await this.chatService.saveMessage(
				message.content,
				message.roomId,
				message.senderId
			);

			this.logger.log(`Message saved successfully for Room ID: ${message.roomId}`);
		} catch (error) {
			this.logger.error(`Failed to save message: ${error.message}`);
		}
	}
}