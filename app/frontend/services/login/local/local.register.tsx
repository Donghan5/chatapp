import React, { useState } from "react";
import { User } from "@chatapp/common-types/src/user";
import { decodeJwt, AuthResult, Props } from "./local.client"

const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-whatsapp-green focus:border-blue-500 sm:text-sm";


export function RegisterForm({ onSuccess }: Props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setInfo(null);

		if (!name || !email || !password || !confirm) {
			setError("Please fill in all fields.");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/auth/local/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					nickname: name, 
					email: email, 
					password: password,
					confirmPassword: confirm
				}),
			});

			const data: AuthResult = await res.json();

			if (!res.ok || (!data.ok && !data.success)) {
				setError(data.message ?? "Failed to register.");
				return;
			}

			setInfo("Registration successful. Logging in...");
			const user = decodeJwt(data.token);
			onSuccess?.(user);
		} catch (err) {
			setError("Unable to connect to the server.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Name
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={loading}
						className={inputStyle}
						placeholder="Your Name"
					/>
				</label>

				<label className="block text-sm font-medium text-gray-700">
					Email
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
						disabled={loading}
						className={inputStyle}
						placeholder="your@example.com"
					/>
				</label>

				<label className="block text-sm font-medium text-gray-700">
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="new-password"
						disabled={loading}
						className={inputStyle}
						placeholder="********"
					/>
				</label>

				<label className="block text-sm font-medium text-gray-700">
					Confirm Password
					<input
						type="password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						required
						disabled={loading}
						className={inputStyle}
						placeholder="********"
					/>
				</label>
			</div>

			<div className="mt-4">
				<button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Processing..." : "Register"}
				</button>
			</div>

			{error && <div className="text-crimson mt-2">{error}</div>}
			{info && <div className="text-green-500 mt-2">{info}</div>}
		</form>
	);
}