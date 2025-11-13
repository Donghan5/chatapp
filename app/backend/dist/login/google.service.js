"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
// Here db import
class GoogleService {
    static async handleGoogleLogin(idToken) {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google token payload');
        }
        const userName = payload.name || payload.email.split('@')[0];
        const userEmail = payload.email;
        const userPicture = payload.picture;
        if (!userEmail) {
            throw new Error('Email not found in Google token');
        }
        let user = await (0, database_1.dbFindByEmail)(userEmail);
        if (!user) {
            console.log('Creating new user in the database');
            user = await (0, database_1.insertGoogleUser)(userName, userEmail, userPicture);
        }
        if (!user) {
            throw new Error('User creation failed or User not found');
        }
        const secret = process.env.JWT_SECRET || 'default_secret';
        const ourJwtToken = jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            profileCompleted: user.profileCompleted,
        }, secret, { expiresIn: '24h' });
        return ourJwtToken;
    }
}
exports.GoogleService = GoogleService;
