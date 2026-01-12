// app/frontend/services/login/google/index.tsx

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface GoogleAuthProps {
  onSuccess: (user: any) => void;
}

export default function GoogleAuth({ onSuccess }: GoogleAuthProps) {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        // Decode token or fetch user info here
        // Mocking for now
        onSuccess({ name: 'Google User', email: 'google@example.com' });
      }
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login Failed')}
          theme="outline"
          shape="pill"
          width="300%"
        />
      </GoogleOAuthProvider>
    </div>
  );
}