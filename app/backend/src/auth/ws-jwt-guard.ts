import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class WsJwtGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: Socket = context.switchToWs().getClient();
		const token = this.extractToken(client);

		if (!token) {
			throw new UnauthorizedException('Token not found');
		}

		try {
			const secret = this.configService.get<string>('JWT_SECRET');
			const payload = this.jwtService.verifyAsync(token, { secret });

			client.data.user = payload;

			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	private extractToken(client: Socket): string | undefined {
		if (client.handshake.auth && client.handshake.auth.token) {
			return client.handshake.auth.token;
		}

		const authHandler = client.handshake.headers.authorization;
		if (authHandler) {
			return authHandler.split(' ')[1];
		}

		return undefined;
	}
}

