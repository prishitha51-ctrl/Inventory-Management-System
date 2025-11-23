import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegisterSuccess, onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(onRegisterSuccess, 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed.';
            setError(msg);
        }
    };

    return (
        <form onSubmit={handleRegister} className="p-10 bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-green-700">📝 Create New Account</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
                    placeholder='Choose a username'
                    required
                />
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-500"
                    placeholder='Create a strong password'
                    required
                />
            </div>
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">{error}</p>}
            {success && <p className="text-green-700 bg-green-50 p-3 rounded-lg mb-6 text-sm text-center border border-green-200">{success}</p>}
            <button 
                type="submit" 
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-[1.01]"
            >
                Register
            </button>
            <p className="text-center text-sm mt-6 text-gray-600">
                Already have an account? <button type="button" onClick={onToggle} className="text-indigo-600 font-bold hover:text-indigo-800 transition duration-150 ease-in-out">Login now</button>
            </p>
        </form>
    );
};

export default Register;
