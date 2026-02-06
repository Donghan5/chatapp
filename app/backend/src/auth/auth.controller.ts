import { Controller, UseGuards, Post, Req, Request, Get, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req) {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@Req() req, @Res() res: Response) {
			const { accessToken } = await this.authService.login(req.user);

			const frontendUrl = process.env.FRONTEND_URL || "http://localhost";
			res.redirect(`${frontendUrl}/login?token=${accessToken}`);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	getProfile(@Request() req) {
		return req.user;
	}

	@Post('register')
	async register(@Body() registerDto: CreateUserDto) {
		return this.authService.register(registerDto);
	}
}
