import React, { useState } from "react";
import { User } from "@chatapp/common-types/src/user";


export type AuthResult = {
	ok: boolean;
	success?: boolean;
	message?: string;
	user?: User;
	token?: string;
};

export type Props = {
	onSuccess?: (user: User) => void;
};

export function decodeJwt(token: string): User {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload) as User;
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    throw new Error("Invalid token structure");
  }
}

const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-whatsapp-green focus:border-blue-500 sm:text-sm";

export function LoginForm({ onSuccess }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setInfo(null);

		if (!email || !password) {
			setError("Please enter your email and password.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/auth/local/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data: AuthResult = await res.json();

			if (!res.ok || !data.success || !data.token) {
				setError(data.message ?? "Failed to log in.");
				return;
			}

			setInfo("Login successful. Redirecting...");
			const user = decodeJwt(data.token);
			onSuccess?.(user);
		} catch (err) {
			setError("Unable to connect to the server.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Email
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
						className={inputStyle}
						disabled={loading}
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
						autoComplete="current-password"
						className={inputStyle}
						disabled={loading}
						placeholder="********"
					/>
				</label>
			</div>

			<div className="pt-2">
				<button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Logging in..." : "Log in"}
				</button>
			</div>

			{error && <div className="text-crimson mt-2">{error}</div>}
			{info && <div className="text-green-500 mt-2">{info}</div>}
		</form>
	);
}

