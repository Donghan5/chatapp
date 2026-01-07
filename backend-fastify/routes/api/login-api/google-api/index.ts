// This is the entry point for the Google login API
import fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import { GoogleService } from '../../../../login/google.service';

export default async function googleApiRoute(app: FastifyInstance) {
	app.post('/login', async (request, reply) => {
		try {
			const { token } = request.body as { token: string };

			if (!token) {
				return reply.status(400).send({ error: 'Token is required' });
			}

			const result = await GoogleService.handleGoogleLogin(token);

			return reply.send({
				success: true,
				token: result,
			});
		} catch (error) {
			console.error('Error during Google login:', error);
			reply.status(500).send({ error: 'Internal Server Error' });
		}
	});
}