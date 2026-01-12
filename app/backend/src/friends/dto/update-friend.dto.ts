import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { FriendStatus } from '../entities/friend.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {
    @IsNotEmpty()
	@IsEnum(FriendStatus)
	status: FriendStatus;
}
