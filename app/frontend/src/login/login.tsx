import React from 'react';
import LocalAuth from './local/index';
import GoogleAuth from './google/index';

interface LoginProps {
	onSuccess: (user: any) => void;
}

export default function Login({ onSuccess }: LoginProps) {
	return (
	<div className="min-h-screen bg-whatsapp-bg flex flex-col items-center justify-center relative">
      <div className="absolute top-0 w-full h-32 bg-whatsapp-green z-0"></div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg z-10 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-whatsapp-dark-green mb-2">
              ChatApp
            </h1>
            <p className="text-gray-500 text-sm">
              Connect with friends in real-time
            </p>
          </div>

          <div className="space-y-6">
            <LocalAuth onSuccess={onSuccess} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleAuth onSuccess={onSuccess} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            By logging in, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
	);
}

export { Login };
