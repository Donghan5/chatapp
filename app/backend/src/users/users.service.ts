import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService { 
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) { }

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		const user = this.userRepository.create(createUserDto);
		return this.userRepository.save(user);
	}
}