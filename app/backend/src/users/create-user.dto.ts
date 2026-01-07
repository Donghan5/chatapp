import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

	@IsString()
	@IsNotEmpty()
	provider!: string;

	@IsString()
	@IsOptional()
	avatarUrl?: string;

	@IsBoolean()
	@IsNotEmpty()
	profileCompleted!: boolean;
}
