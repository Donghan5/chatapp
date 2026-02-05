import { Controller, UseGuards, Post, Req, Request, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

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
			const { access_token } = await this.authService.login(req.user);

			const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
			res.redirect(`${frontendUrl}/login?token=${access_token}`);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	getProfile(@Request() req) {
		return req.user;
	}
}
