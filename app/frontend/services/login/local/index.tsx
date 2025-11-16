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
			<div className="flex border-b mb-4 border-gray-200 mb-8">
				<button
					onClick={() => setMode("login")}
					aria-pressed={mode === "login"}
					className={`flex-1 py-2 text-center border-b-2 font-semibold ${mode === 'login' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
				>
					Log in
				</button>
				<button
					onClick={() => setMode("register")}
					aria-pressed={mode === "register"}
					className={`flex-1 py-2 text-center border-b-2 font-semibold ${mode === 'register' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
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