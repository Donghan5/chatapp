import React, { useState, useEffect, useRef } from 'react';
import LocalAuth from './services/login/local/index';
import GoogleAuth from './services/login/google/index';
import ChatLayout from './services/chat/chat';
import { User } from '../../packages/common-types/src/user';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

	if (!user) {
		return (
		<div className="flex items-center justify-center h-screen w-full bg-gray-100">
			<div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
			<LocalAuth onSuccess={handleLoginSuccess} />

			<div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
				<p className="mx-4 text-center text-sm text-gray-500">OR</p>
			</div>

			<GoogleAuth onSuccess={handleLoginSuccess} />
			</div>
		</div>
		);
	}

  return <ChatLayout user={user} />;
}

export { App };
