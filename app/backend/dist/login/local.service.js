"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
class LocalService {
    static async handleLocalLogin(email, password) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const params = [email];
        const users = await (0, database_1.runDatabase)(query, params);
        const user = users[0];
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const secret = process.env.JWT_SECRET_KEY || 'default_secret';
        const token = jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: '1h' });
        return { token };
    }
    static async handleLocalRegister(name, email, password) {
        if (!name || !email || !password) {
            throw new Error('Name, email, and password are required');
        }
        const existingUser = await (0, database_1.dbFindByEmail)(email);
        if (existingUser) {
            if (email == existingUser.email) {
                throw new Error('User already exists');
            }
            if (name == existingUser.name) {
                throw new Error('Username already taken');
            }
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const newUser = await (0, database_1.insertLocalUser)(name, email, hashedPassword);
        return newUser;
    }
}
exports.LocalService = LocalService;
