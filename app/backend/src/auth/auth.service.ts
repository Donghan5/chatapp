import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalService } from './local.service';
 import { GoogleService } from './google.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private readonly localService: LocalService, private readonly googleService: GoogleService, private readonly jwtService: JwtService) {}

	async validateLocalUser(email: string, pass: string) {
		const user = await this.localService.validateUser(email, pass);
		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		return user;
	}


	async validateGoogleUser(email: string, firstName: string | undefined, lastName: string | undefined, socialId: string) {
    const user = await this.googleService.validateUser({ 
        email, 
        firstName: firstName || '', 
        lastName: lastName || '',
        socialId 
    });

    if (!user) {
        throw new UnauthorizedException('Invalid google user');
    }

    return user;
}
	async login(user: any) {
		const payload = { sub: user.id, email: user.email };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
