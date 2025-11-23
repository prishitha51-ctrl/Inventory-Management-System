import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const AuthWrapper = ({ setIsAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        navigate('/dashboard', { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {isLogin ? (
                <Login onLoginSuccess={handleLoginSuccess} onToggle={() => setIsLogin(false)} />
            ) : (
                <Register onRegisterSuccess={() => setIsLogin(true)} onToggle={() => setIsLogin(true)} />
            )}
        </div>
    );
};

export default AuthWrapper;