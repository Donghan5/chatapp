export interface User {
	id: string;
	name: string;
	email: string;
	password_hash?: string;
	avatarUrl?: string;
	profileCompleted: boolean;
	token?: string;
}