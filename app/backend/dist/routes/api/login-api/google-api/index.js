"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = googleApiRoute;
// This is the entry point for the Google login API
const fastify_1 = __importDefault(require("fastify"));
const google_service_1 = require("../../../../login/google.service");
async function googleApiRoute(app) {
    fastify_1.default.post('/api/google/verify', async (request, reply) => {
        try {
            const { token } = request.body;
            if (!token) {
                return reply.status(400).send({ error: 'Token is required' });
            }
            const result = await google_service_1.GoogleService.handleGoogleLogin(token);
            return reply.send({
                success: true,
                token: result.token,
            });
        }
        catch (error) {
            console.error('Error during Google login:', error);
            reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
