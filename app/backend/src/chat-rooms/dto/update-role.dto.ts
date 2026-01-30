import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'user'])
  role: 'admin' | 'user';
}