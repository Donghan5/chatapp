// This is the entry point for the Google login API
import fastify from 'fastify';
import { GoogleService } from '../../../../login/google.service';

export default async function googleApiRoute(app: fastify.FastifyInstance) {
	fastify.get('/callback', async (request, reply) => {
		const { token } = await (fastify as any).googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

		try {
			const jwtToken = await GoogleService.handleGoogleLogin(token);

			const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

			if (!frontendUrl) {
				throw new Error('FRONTEND_URL is not defined');
			}

			reply.redirect(`${frontendUrl}/login/success?token=${jwtToken}`);
		} catch (error) {
			console.error('Error during Google login:', error);
			reply.status(500).send({ error: 'Internal Server Error' });
		}
	});
}