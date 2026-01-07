// This is the entry point for the local login API
import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { LocalService } from '../../../../login/local.service';

export default async function localApiRoute(app: FastifyInstance) {
	app.post('/register', async (request: any, reply: any) => {
		try {
			const { nickname, email, password, confirmPassword } = request.body;

			if (!nickname || !email || !password ) {
				return reply.status(400).send({ error: 'Nickname, email, and password are required' });
			}

			if (password !== confirmPassword) {
				return reply.status(400).send({ error: 'Passwords do not match' });
			}

			if (password.length < 8) {
				return reply.status(400).send({ error: 'Password must be at least 8 characters long' });
			}

			if (nickname.length < 3 || nickname.length > 20) {
				return reply.status(400).send({ error: 'Nickname must be between 3 and 20 characters long' });
			}


			// email regex validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return reply.status(400).send({ error: 'Invalid email format' });
			}

			const { token } = await LocalService.handleLocalRegister(nickname, email, password);


			return reply.send({
				success: true,
				message: 'User registered successfully',
				token: token
			});
		}
		catch (error) {
			console.error('Registration error:', error);
			const message = error instanceof Error ? error.message : 'Registration failed';
			return reply.status(400).send({ error: message });
		}
	});

	app.post('/login', async (request: any, reply: any) => {
		try {
			const { email, password } = request.body;

			if (!email || !password) {
				return reply.status(400).send({ error: 'Email and password are required' });
			}

			const result = await LocalService.handleLocalLogin(email, password);
			return reply.send({
				success: true,
				token: result.token
			});
		} catch (error) {
			console.error('Login error:', error);
			const message = error instanceof Error ? error.message : 'Login failed';
			return reply.status(400).send({ error: message });
		}
	});
}