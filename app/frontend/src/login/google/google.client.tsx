import React from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onFailure: () => void;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

if (!clientId) {
  console.error("Not set Google Client ID (VITE_GOOGLE_CLIENT_ID)");
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {

  if (!clientId) {
    return <div className="text-crimson">Not set Google Client ID.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.error('GoogleLogin component reported an error.');
          onFailure();
        }}
      />
    </GoogleOAuthProvider>
  );
};

// 3. 기존의 default export (LoginPage) 제거
// export default LoginPage;