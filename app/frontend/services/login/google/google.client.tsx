import React from 'react';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onFailure: () => void;
}

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

if (!clientId) {
  console.error("Not set Google Client ID (REACT_APP_GOOGLE_CLIENT_ID)");
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {

  if (!clientId) {
    return <div style={{ color: 'crimson' }}>Google Client ID가 설정되지 않았습니다.</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => {
          console.error('GoogleLogin component reported an error.');
          onFailure(); // props로 받은 핸들러 연결
        }}
      />
    </GoogleOAuthProvider>
  );
};

// 3. 기존의 default export (LoginPage) 제거
// export default LoginPage;