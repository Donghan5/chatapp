import React from 'react';
import { SignUpForm } from '../features/auth/ui/SignUpForm';
import { Link } from 'react-router-dom';

export const SignUpPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
					<p className="text-gray-600 mt-2">Join us!</p>
				</div>

				{/* Call Sign up form */}
				<SignUpForm />

				{/* Link to login page */}
				<div className="mt-6 text-center">
					<p className="text-gray-600">
						Already have an account?{" "}
						<Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}