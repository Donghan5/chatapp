import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GoogleService {
	constructor(
		@InjectRepository(User) private usersRepository: Repository<User>,
	) { }

	async validateUser(details: { email: string; firstName: string; lastName: string; socialId: string }): Promise<User | null> {
		const user = await this.usersRepository.findOne({
			where: { email: details.email },
			select: ['id', 'email', 'passwordHash', 'username', 'provider'],
		});

		if (user && user.provider === 'google') {
			if (!user.username) {
				user.username = details.firstName + details.lastName;
				await this.usersRepository.save(user);
			}
			return user;
		}

		console.log('User not found, creating new user');
		console.log(details);

		const newUser = this.usersRepository.create({
			email: details.email,
			username: details.firstName + details.lastName,
			provider: 'google',
			socialId: details.socialId,
		});

		return await this.usersRepository.save(newUser);
	}
}