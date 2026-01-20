import React from 'react';
import { LoginForm } from '../features/auth/ui/LoginForm';

export const LoginPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
					<p className="text-gray-600 mt-2">Login to your account</p>
				</div>

				<LoginForm />

				<p className="text-center text-sm text-gray-400 mt-6">
					Don't have an account? <span className="text-blue-600 hover:underline">Sign up</span>
				</p>
			</div>
		</div>
	)
}