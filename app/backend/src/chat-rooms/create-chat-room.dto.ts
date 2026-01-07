import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateChatRoomDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsBoolean()
    @IsNotEmpty()
    isGroup!: boolean;
}