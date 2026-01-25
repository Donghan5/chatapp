import {
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  Body,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getMyProfile(@Request() req) {
    return this.usersService.getMyProfile(req.user.id);
  }

  @Get('search')
  async searchUsers(@Query('username') username: string) {
    const users = await this.usersService.searchUsers(username);
    return users;
  }

  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileDto,
  ): Promise<void> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Patch('settings')
  async updateSettings(
    @Request() req,
    @Body() dto: UpdateSettingsDto,
  ): Promise<User> {
    return this.usersService.updateSettings(req.user.id, dto);
  }

  @Delete()
  async deleteMyProfile(@Request() req) {
    return this.usersService.deleteMyProfile(req.user.id);
  }
}
