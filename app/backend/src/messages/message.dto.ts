import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content!: string;

	// sender id should be take from jwt token
	// so here will be room id
	@IsNumber()
	@IsNotEmpty()
	roomId!: number;
}