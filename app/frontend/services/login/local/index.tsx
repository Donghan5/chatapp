import React, { useState } from "react";
import { LoginForm } from "./local.client";
import { RegisterForm } from "./local.client";
import { User } from "@chatapp/common-types/src/user";

interface LocalAuthProps {
	onSuccess: (loggedInUser: User) => void;
}

const LocalAuth: React.FC<LocalAuthProps> = ({ onSuccess }) => {
	const [mode, setMode] = useState<"login" | "register">("login");

	return (
		<div>
			<div style={{ marginBottom: 12 }}>
				<button
					onClick={() => setMode("login")}
					aria-pressed={mode === "login"}
					style={{ marginRight: 8 }}
				>
					Log in
				</button>
				<button
					onClick={() => setMode("register")}
					aria-pressed={mode === "register"}
				>
					Register
				</button>
			</div>

			{mode === "login" ? (
				<LoginForm onSuccess={onSuccess} />
			) : (
				<RegisterForm onSuccess={onSuccess} />
			)}
		</div>
	);
};

export default LocalAuth;

export { LocalAuth };