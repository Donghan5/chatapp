import { FastifyInstance } from 'fastify';
import { updateUser } from '../../../database/database';
import jwt from 'jsonwebtoken';

export default async function userApiRoute(app: FastifyInstance) {
	// to update user profile --> put (patch)
    app.put('/me', async (req: any, reply) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return reply.status(401).send({ error: 'No token provided' });

        try {
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'default_secret';
            const decoded = jwt.verify(token, secret) as any;
            
            const { name, status } = req.body;
            
            if (!name) return reply.status(400).send({ error: 'Name is required' });

            const updatedUser = await updateUser(decoded.id, name, status || '');
            
            return reply.send(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            return reply.status(500).send({ error: 'Failed to update profile' });
        }
    });
}