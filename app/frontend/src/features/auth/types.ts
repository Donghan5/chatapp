import { User } from '@chatapp/common-types';

export interface AuthResponse {
	user: User;
	accessToken: string;
}

export interface LoginRequest {
	email: string;
	pass: string;
}

export interface GoogleLoginRequest {
	token: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	pass: string;
}