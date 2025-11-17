import React, { useState } from 'react';
import LandingPage from './services/landing/index';
import Login from './services/login/login';
import Dashboard from './services/dashboard/index';
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

    if (currentView === 'login') {
        return <Login onSuccess={handleLoginSuccess} />;
    }

    return <LandingPage onStart={handleStart} />;
}