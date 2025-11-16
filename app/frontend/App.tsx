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
		<div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
			<div className="bg-whatsapp-green p-6">
				<h1 className="text-3xl font-bold text-white text-center">
          			Welcome to ChatApp
        		</h1>
			<LocalAuth onSuccess={handleLoginSuccess} />

			<div className="p-8">
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
