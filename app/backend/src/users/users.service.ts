import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./create-user.dto";
import { UpdateSettingsDto } from "./update-user.dto";

@Injectable()
export class UsersService { 
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) { }

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		try {
			const user = this.userRepository.create(createUserDto);
			return await this.userRepository.save(user);
		} catch (error) {
			if (error.code === '23505') {
				throw new UnauthorizedException('Email already exists');
			}
			throw new InternalServerErrorException();
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.userRepository.findOneBy({
			email: email,
		})
		return user;
	}

	async getMyProfile(id: number): Promise<User> {
		const user = this.userRepository.findOne({ where: { id }});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { passwordHash, ...safeUser } = user;
		return safeUser as User;
	}

	async updateProfile(id: number, dto: UpdateSettingsDto): Promise<void> {
		await this.userRepository.update(id, dto);
	}

	async updateSettings(id: number, dto: UpdateSettingsDto): Promise<User> {
		const user = await this.getMyProfile(id);

		// Merge settings
		user.settings = { ...user.settings, ...dto };

		return await this.userRepository.save(user);
	}

}