import jwt from 'jsonwebtoken';
import { User } from '@chatapp/common-types';
import { insertGoogleUser, dbFindById } from '../database/database';

// Here db import

class GoogleService {
	public static async handleGoogleLogin(token: any) {
		const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error('Error fetching user info from Google:', errorBody);
			throw new Error('Failed to fetch user info from Google');
		}

		const googleUser = await response.json();
		const userName = googleUser.name || googleUser.email.split('@')[0];
		const userEmail = googleUser.email;
		const userPicture = googleUser.picture;

		let user: User /* | undefined = await dbGet() */;

		if (!user) {
			console.log('Creating new user in the database');
			const result = await insertGoogleUser(userName, userEmail, userPicture);
			user = await dbFindById(result.insertedId);
		}

		if (!user) {
			throw new Error('User creation failed or User not found');
		}

		const secret = process.env.JWT_SECRET || 'default_secret';
		const jwtToken = jwt.sign(
			{
				id: user.id,
				name: user.name,
				email: user.email,
				picture: user.picture,
				profileCompleted: user.profileCompleted,
			},
		);

		const ourJwtToken = jwt.sign(jwtToken, secret, { expiresIn: '24h' });
		return ourJwtToken;
	}
}

export { GoogleService };