import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { Reaction } from './entities/reaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Message, Reaction])],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService],
})
export class MessageModule { }

