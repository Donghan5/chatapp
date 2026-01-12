import { IsBoolean, IsNotEmpty, IsString, IsArray, IsNumber, IsOptional } from "class-validator";

export class CreateChatRoomDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsBoolean()
    @IsNotEmpty()
    isGroup!: boolean;

    @IsArray()
    @IsNumber({}, {each: true})
    @IsOptional()
    inviteUserIds?: number[];
}