import React, { useState, useEffect, useRef } from 'react';
import LocalAuth from './local/index';
import GoogleAuth from './google/index';
import ChatLayout from '../chat/chat';
import { User } from '../../../packages/common-types/src/user';
import Dashboard from '../dashboard/index';
import Logout from '../logout/index';



export default function Login() {
	const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

	if (!user) {
		return (
		<div className="rounded-lg shadow-xl w-full max-w-lg mx-auto overflow-hidden">
			<div className="bg-whatsapp-green p-6">
				<h1 className="text-3xl font-bold text-black text-center">
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

//  return <ChatLayout user={user} />;
	return <Dashboard user={user} onLogout={Logout} />;
}

export { Login };