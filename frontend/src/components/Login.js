import React, { useState } from 'react';
import { login } from '../api/api';

const Login = ({ onLoginSuccess, onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await login({ username, password });
            localStorage.setItem('token', response.data.token);
            onLoginSuccess();
        } catch (err) {
            setError('Login failed. Check credentials (admin/password).');
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-10 bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">🔐 Inventory Login</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
                    placeholder='Enter your username'
                    required
                />
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-500"
                    placeholder='Enter your password'
                    required
                />
            </div>
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">{error}</p>}
            <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-[1.01]"
            >
                Sign In
            </button>
            <p className="text-center text-sm mt-6 text-gray-600">
                Don't have an account? <button type="button" onClick={onToggle} className="text-indigo-600 font-bold hover:text-indigo-800 transition duration-150 ease-in-out">Register here</button>
            </p>
        </form>
    );
};

export default Login;