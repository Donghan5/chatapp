import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '@chatapp/common-types';
import { insertGoogleUser, dbFindById, dbFindByEmail } from '../database/database';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
	public static async handleGoogleLogin(idToken: any) {
		const ticket = await client.verifyIdToken({
			idToken: idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			throw new Error('Invalid Google token payload');
		}

		const userName = payload.name;
		const userEmail = payload.email;
		const userPicture = payload.picture;

		if (!userEmail) {
			throw new Error('Email not found in Google token');
		}

		let user: User | undefined = await dbFindByEmail(userEmail);

		if (!user) {
			console.log('Creating new user in the database');
			user = await insertGoogleUser(userName!, userEmail, userPicture!);
		}

		// After creation of the user, verification of it
		if (!user) {
			throw new Error('User creation failed or User not found');
		}

		const secret = process.env.JWT_SECRET || 'default_secret';
		const ourJwtToken = jwt.sign(
			{
				id: user.id,
				name: user.name,
				email: user.email,
				picture: user.picture,
				profileCompleted: user.profileCompleted,
			},
			secret,
			{ expiresIn: '24h' }
		);

		return ourJwtToken;
	}
}

export { GoogleService };