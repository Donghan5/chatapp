import React from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';

interface GoogleLoginButton {
  onSuccess: (response: CredentialResponse) => void;
  onFailure: (error?: any) => void;
}

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

if (!clientId) {
  console.error("Google Client ID (REACT_APP_GOOGLE_CLIENT_ID)가 설정되지 않았습니다.");
}

const GoogleLoginButton: React.FC<GoogleLoginButton> = ({ onSuccess, onFailure }) => {

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

export default GoogleLoginButton;