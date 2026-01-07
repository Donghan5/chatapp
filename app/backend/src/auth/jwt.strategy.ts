import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
	sub: string;
	email: string;
	role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(config: ConfigService) {
		const jwtSecret = config.get<string>('JWT_SECRET');

		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined');
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	async validate(payload: JwtPayload) {
		return {
			id: payload.sub,
			email: payload.email,
			role: payload.role || 'user',
		};
	}
}