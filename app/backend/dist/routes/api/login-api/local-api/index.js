"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = localApiRoute;
// This is the entry point for the local login API
const fastify_1 = __importDefault(require("fastify"));
const local_service_1 = require("../../../../login/local.service");
async function localApiRoute(app) {
    fastify_1.default.post('/register', async (request, reply) => {
        try {
            const { nickname, email, password, confirmPassword } = request.body;
            if (!nickname || !email || !password) {
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
            const token = await local_service_1.LocalService.handleLocalRegister(nickname, email, password);
            return reply.send({
                success: true,
                message: 'User registered successfully',
                requiresLogin: true
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            const message = error instanceof Error ? error.message : 'Registration failed';
            return reply.status(400).send({ error: message });
        }
    });
    fastify_1.default.post('/login', async (request, reply) => {
        try {
            const { email, password } = request.body;
            if (!email || !password) {
                return reply.status(400).send({ error: 'Email and password are required' });
            }
            const result = await local_service_1.LocalService.handleLocalLogin(email, password);
            return reply.send({
                success: true,
                token: result.token
            });
        }
        catch (error) {
            console.error('Login error:', error);
            const message = error instanceof Error ? error.message : 'Login failed';
            return reply.status(400).send({ error: message });
        }
    });
}
