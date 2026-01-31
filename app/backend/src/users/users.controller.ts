import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Body,
  UseGuards,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    }),
  }))
  
  async uploadAvatar(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      ],
    }),
  ) file: Express.Multer.File, @Request() req) {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await this.usersService.updateProfile(req.user.id, { avatarUrl });
    return { avatarUrl };
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
