import React, { useState } from "react";

type AuthResult = {
	ok: boolean;
	message?: string;
	user?: { id?: string; email?: string; name?: string };
};

type Props = {
	onSuccess?: (user: AuthResult["user"]) => void;
};

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

			if (!res.ok || !data.ok) {
				setError(data.message ?? "Failed to log in.");
				return;
			}

			setInfo("Login successful. Redirecting...");
			onSuccess?.(data.user);
		} catch (err) {
			setError("Unable to connect to the server.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
			<h2>Login (Local)</h2>

			<label>
				Email
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
					disabled={loading}
				/>
			</label>

			<label>
				Password
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					autoComplete="current-password"
					disabled={loading}
				/>
			</label>

			<div style={{ marginTop: 12 }}>
				<button type="submit" disabled={loading}>
					{loading ? "Logging in..." : "Log in"}
				</button>
			</div>

			{error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
			{info && <div style={{ color: "green", marginTop: 8 }}>{info}</div>}
		</form>
	);
}

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
		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
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
				body: JSON.stringify({ name, email, password }),
			});

			const data: AuthResult = await res.json();

			if (!res.ok || !data.ok) {
				setError(data.message ?? "Failed to register.");
				return;
			}

			setInfo("Registration successful. Logging in...");
			onSuccess?.(data.user);
		} catch (err) {
			setError("Unable to connect to the server.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
			<h2>Register (Local)</h2>

			<label>
				Name
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					disabled={loading}
				/>
			</label>

			<label>
				Email
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
					disabled={loading}
				/>
			</label>

			<label>
				Password
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					autoComplete="new-password"
					disabled={loading}
				/>
			</label>

			<label>
				Confirm Password
				<input
					type="password"
					value={confirm}
					onChange={(e) => setConfirm(e.target.value)}
					required
					disabled={loading}
				/>
			</label>

			<div style={{ marginTop: 12 }}>
				<button type="submit" disabled={loading}>
					{loading ? "Processing..." : "Register"}
				</button>
			</div>

			{error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
			{info && <div style={{ color: "green", marginTop: 8 }}>{info}</div>}
		</form>
	);
}