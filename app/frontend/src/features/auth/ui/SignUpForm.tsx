import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Input } from "../../../components/atoms/Input";
import { Button } from "../../../components/atoms/Button";

export const SignUpForm = () => {
	const {
		register,
		isLoading,
		error
	} = useAuth();
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [pass, setPass] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!email || !pass || !name) return;

		register({
			email,
			pass,
			name
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
			<div className="flex gap-2">
				<Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
			</div>
			<Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<Input label="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
			
			{error && (
				<div className="p-3 text-sm text-red-600 bg-red-500 rounded-md">{error}</div>
			)}

			<Button type="submit" size="lg" disabled={isLoading} className="w-full mt-2">
				{isLoading ? 'Signing up...' : 'Sign Up'}
			</Button>
		</form>
	)
}