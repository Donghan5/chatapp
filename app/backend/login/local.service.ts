import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { runDatabase, insertLocalUser, dbFindByEmail } from '../database/database';

class LocalService {
	public static async handleLocalLogin(email: string, password: string) {
		const query = 'SELECT * FROM users WHERE email = $1';
		const params = [email];
		const users = await runDatabase(query, params);
		const user = users[0];

		if (!user) {
			throw new Error('User not found');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}

		const secret = process.env.JWT_SECRET_KEY || 'default_secret';
		const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

		return { token };
	}

	public static async handleLocalRegister(name: string, email: string, password: string) {
		if (!name || !email || !password) {
			throw new Error('Name, email, and password are required');
		}

		const existingUser = await dbFindByEmail(email);
		if (existingUser) {
			if (email == existingUser.email) {
				throw new Error('User already exists');
			}

			if (name == existingUser.name) {
				throw new Error('Username already taken');
			}
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await insertLocalUser(name, email, hashedPassword);
		return newUser;
	}
}

export { LocalService };