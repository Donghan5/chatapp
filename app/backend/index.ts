import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import localApiRoute from './routes/api/login-api/local-api';
import googleApiRoute from './routes/api/login-api/google-api';
import chatRoute from './routes/api/chat-api/index';

const app = Fastify({ logger: true });

app.register(cors, {
  origin: 'http://localhost:5173'
});

app.register(websocket);

app.register(localApiRoute, { prefix: '/api/auth/local' });
app.register(googleApiRoute, { prefix: '/api/auth/google' });
app.register(chatRoute);

const start = async () => {
  try {
    const PORT = Number(process.env.BACKEND_PORT) || 3000;
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();