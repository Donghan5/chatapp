import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { compare } from "bcrypt";

@Injectable()
export class LocalService {
	constructor(
		@InjectRepository(User) private usersRepository: Repository<User>,
	) {}

	async validateUser(email: string, pass: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: { email },
			select: ['id', 'email', 'passwordHash', 'username', 'provider'],
		});

		if (user && user.provider === 'local' && await compare(pass, user.passwordHash)) {
			const { passwordHash, ...result } = user;
			return result as User;
		}

		throw new UnauthorizedException('Invalid email or password');
	}
}