import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMessagesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 20;
}