import React, { useState } from 'react';
import LandingPage from './src/pages/LandingPage';
import { LoginPage } from './src/pages/LoginPage';
import DashboardPage from './src/pages/DashboardPage';
import { User } from '@chatapp/common-types';

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
        return <DashboardPage user={user} onLogout={handleLogout} />;
    }

    return (
        <>
            <LandingPage onStart={handleStart} />
            {currentView === 'login' && (
                <LoginPage onSuccess={handleLoginSuccess} />
            )}
        </>
    );
}