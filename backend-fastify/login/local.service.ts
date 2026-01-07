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

		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}

		const { password_hash, ...safeUser } = user;

		const secret = process.env.JWT_SECRET || 'default_secret';
		const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

		return { token, user: safeUser };
	}

	public static async handleLocalRegister(name: string, email: string, password: string) {
		if (!name || !email || !password) {
			throw new Error('Name, email, and password are required');
		}

		const existingUser = await dbFindByEmail(email);
		if (existingUser) {
			throw new Error('User already exists');
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await insertLocalUser(name, email, hashedPassword);
		const secret = process.env.JWT_SECRET || 'default_secret';
		const token = jwt.sign({ id: newUser.id }, secret, { expiresIn: '1h' });

		const { password_hash, ...safeUser } = newUser;
		return { token, user: safeUser };
	}
}

export { LocalService };