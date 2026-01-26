import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageService } from '../messages/messages.service';

@Controller()
export class ChatController {
    constructor(
        private readonly messageService: MessageService,
    ) { }

    @EventPattern('chat.send')
    async handleMessageCreate(@Payload() data: any) {
        console.log(`[Consumer] Received from Kafka: ${JSON.stringify(data)}`);

        const savedData = await this.messageService.saveMessage(
            data.content,
            data.roomId,
            data.senderId,
        );

        console.log(`[Consumer] Saved message: ${JSON.stringify(savedData)}`);
    }
}

