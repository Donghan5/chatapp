import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './src/pages/LandingPage';
import { LoginPage } from './src/pages/LoginPage';
import DashboardPage from './src/pages/DashboardPage';
import { SignUpPage } from './src/pages/SignUpPage';

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}