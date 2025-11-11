import GoogleLoginButton from "./index";

const LoginPage = () => {

	const handleGoogleLoginSuccess = async (credentialResponse: any) => {
		const googleToken = credentialResponse.credential;
		console.log('Google login successful, token:', googleToken);

		try {
			const response = await fetch('/api/google/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: googleToken }),
			});

			const data = await response.json();

			if (data.success) {
				localStorage.setItem('jwtToken', data.token);
				window.location.href = '/dashboard';
			} else {
				throw new Error(data.error || 'Google login failed');
			}
		} catch (error) {
			console.error('Error verifying Google token:', error);
		}
	};
		const handleGoogleLoginFailure = () => {
		console.error('Google login failed');
	};

	return (
		<>
			<GoogleLoginButton
				onSuccess={handleGoogleLoginSuccess}
				onFailure={handleGoogleLoginFailure}
			/>
		</>
	);
};

export default LoginPage;