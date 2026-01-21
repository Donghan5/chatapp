import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './src/pages/LandingPage';
import { LoginPage } from './src/pages/LoginPage';
import DashboardPage from './src/pages/DashboardPage';
import { User } from '@chatapp/common-types';

export default function App() {
    return (
        <Routes>
            {/* 기본 경로(/)로 오면 LandingPage를 보여줍니다 */}
            <Route path="/" element={<LandingPage />} />
            
            {/* /login 경로로 오면 LoginPage를 보여줍니다 */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* /dashboard 경로로 오면 DashboardPage를 보여줍니다 */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 없는 페이지로 가면 랜딩 페이지로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}