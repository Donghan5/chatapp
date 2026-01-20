import React, { useState } from 'react';
import LandingPage from './src/landing/index';
import Login from './src/login/login';
import Dashboard from './src/dashboard/index';
import { User } from '../../packages/common-types/src/user';

type ViewState = 'landing' | 'login' | 'dashboard' | 'logout' | 'chat';

export default function App() {
    const [currentView, setCurrentView] = useState<ViewState>('landing');

    const [user, setUser] = useState<User | null>(null);

    const handleStart = () => {
        setCurrentView('login');
    };

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('jwtToken');
        setCurrentView('login');
    };


    if (user && currentView === 'dashboard') {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <>
            <LandingPage onStart={handleStart} />
            {currentView === 'login' && (
                <Login onSuccess={handleLoginSuccess} />
            )}
        </>
    );
}