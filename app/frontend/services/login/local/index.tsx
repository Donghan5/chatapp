import React, { useState } from 'react';
import { User } from '../../../../packages/common-types/src/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LocalAuthProps {
    onSuccess: (user: User) => void;
}

const InputField = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    required = true 
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    required?: boolean;
}) => (
    <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-whatsapp-green focus:border-transparent 
                       text-gray-900 placeholder-gray-400 transition-all outline-none"
            placeholder={placeholder}
            required={required}
        />
    </div>
);

export default function LocalAuth({ onSuccess }: LocalAuthProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (isRegistering && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const endpoint = isRegistering ? '/api/auth/local/register' : '/api/auth/local/login';
        
        const body = isRegistering 
            ? formData 
            : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                
                const user: User = data.user || {
                    id: 'temp-id', 
                    name: formData.nickname || 'User',
                    email: formData.email,
                    picture: '',
                    profileCompleted: true
                };
                
                onSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                    <InputField
                        label="Nickname"
                        value={formData.nickname}
                        onChange={handleChange('nickname')}
                        placeholder="Choose a nickname"
                    />
                )}

                <InputField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="name@example.com"
                />

                <InputField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="••••••••"
                />

                {isRegistering && (
                    <InputField
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        placeholder="••••••••"
                    />
                )}

                {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded border border-red-200 animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-whatsapp-green hover:bg-whatsapp-dark-green text-white font-semibold rounded-lg shadow-md transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        isRegistering ? 'Create Account' : 'Sign In'
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    type="button" // form submit 방지
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                        setFormData({ ...formData, confirmPassword: '', nickname: '' }); // 전환 시 필드 초기화
                    }}
                    className="text-sm text-whatsapp-dark-green hover:underline transition-colors font-medium"
                >
                    {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
};

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export { LocalAuth };