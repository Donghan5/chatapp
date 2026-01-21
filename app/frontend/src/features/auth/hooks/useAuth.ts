import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import type { GoogleLoginRequest, LoginRequest, RegisterRequest } from "../types";
import { User } from "@chatapp/common-types";

export const useAuth = () => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	const navigate = useNavigate();

	const login = async (data: LoginRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await authApi.login(data);

			setUser(response.user);
			console.log('Login successful: ', response.user);

			navigate('/dashboard');
		} catch (err: any) {
			console.error(err);

			const message = err.response?.data?.message || 'Login failed';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterRequest) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await authApi.register(data);

			setUser(response.user);
			// redirect to login page (after sign up)
			navigate('/login');
		} catch (err: any) {
			console.error(err);

			const message = err.response?.data?.message || 'Registration failed';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	// For google login, we don't have a form data, we only have a token
	const loginWithGoogle = async (token: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await authApi.loginWithGoogle({ token });

			setUser(response.user);
			navigate('/dashboard');
		} catch (err: any) {
			setError('Failed to login with Google');
		} finally {
			setIsLoading(false);
		};
	};

	const logout = async () => {
		try {
			await authApi.logout();
			setUser(null);
			navigate('/login');
		} catch (err: any) {
			setError('Failed to logout');
		}
	};

	return {
		user,
		login,
		loginWithGoogle,
		logout,
		isLoading,
		error,
		register,
	};
}