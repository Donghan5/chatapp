// app/frontend/services/login/google/index.tsx

import React from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { GoogleLoginButton } from './google.client'; 
import { User } from '../../../../packages/common-types/src/user'; 

interface GoogleAuthProps {
  onSuccess: (loggedInUser: User) => void;
  onFailure?: () => void;
}


function decodeJwt(token: string): User {
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

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onFailure }) => {

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) {
      console.error('No credential returned from Google');
      return;
    }

    try {
      const response = await fetch('/api/google/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.error || 'Google login verification failed');
      }

      localStorage.setItem('jwtToken', data.token);

      const user = decodeJwt(data.token);

      onSuccess(user);

    } catch (error) {
      console.error('Error verifying Google token:', error);
      onFailure?.();
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error('Google login failed');
    onFailure?.();
  };

  return (
    <GoogleLoginButton
      onSuccess={handleGoogleLoginSuccess}
      onFailure={handleGoogleLoginFailure}
    />
  );
};

export default GoogleAuth;