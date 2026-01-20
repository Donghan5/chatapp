import { client } from '../../../lib/axios';
import type { LoginRequest, GoogleLoginRequest, AuthResponse } from '../types';
import type { User } from '../types';

export const authApi = {
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		const response = await client.post<AuthResponse>('/auth/login', data);
		return response.data;
	},

	loginWithGoogle: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
		const response = await client.post<AuthResponse>('/auth/google', data);
		return response.data;
	},

	logout: async (): Promise<void> => {
		await client.post('/auth/logout');
	},

	getMe: async (): Promise<User> => {
		const response = await client.get<User>('/auth/me');
		return response.data;
	}
}