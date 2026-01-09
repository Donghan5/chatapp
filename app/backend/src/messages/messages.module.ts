import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Messages } from "./messages.entity";
import { MessageService } from "./messages.service";
import { MessageController } from "./messages.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Messages])],
	providers: [MessageService],
	controllers: [MessageController],
})
export class MessageModule { }