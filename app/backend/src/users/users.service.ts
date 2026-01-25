import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto, UpdateSettingsDto } from "./dto/update-user.dto";

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
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { passwordHash, ...safeUser } = user;
		return safeUser as User;
	}

	async updateProfile(id: number, dto: UpdateProfileDto): Promise<void> {
		await this.userRepository.update(id, dto);
	}

	async updateSettings(id: number, dto: UpdateSettingsDto): Promise<User> {
		const user = await this.getMyProfile(id);

		// Merge settings
		user.settings = { ...user.settings, ...dto };

		return await this.userRepository.save(user);
	}

	async deleteMyProfile(id: number): Promise<void> {
		const result = await this.userRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException('User not found');
		}
	}

	async findUserById(id: number): Promise<User | null> {
		const user = await this.userRepository.findOne({ where: { id } });
		return user;
	}

	async searchUsers(username: string): Promise<User[]> {
		const users = await this.userRepository.find({
			where: {
				username: Like(`%${username}%`),
			},
			select: ['id', 'username', 'avatarUrl', 'createdAt', 'updatedAt'],
		});
		return users;
	}
}