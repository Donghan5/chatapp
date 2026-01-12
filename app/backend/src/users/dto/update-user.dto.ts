import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class UpdateProfileDto {
	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	statusMessage?: string;

	@IsString()
	@IsOptional()
	avatarUrl?: string;
}

export class UpdateSettingsDto {
	@IsEnum(['light', 'dark', 'system'])
	@IsOptional()
	theme?: 'light' | 'dark' | 'system';

	@IsBoolean()
	@IsOptional()
	isPushEnabled?: boolean;
}