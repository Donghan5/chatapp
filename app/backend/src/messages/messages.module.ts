import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService],
})
export class MessageModule { }

