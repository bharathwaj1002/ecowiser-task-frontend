"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://ecowiser-task.duckdns.org/api/signup/', {
                email,
                password,
                confirmPassword,
            });
            console.log('Signup successful:', response.data);
            router.push('/login');
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response.data.error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold my-6">Sign Up</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignup}>
                <div>
                    <label className="block">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border rounded-lg w-full p-2 my-2 text-black"
                    />
                </div>
                <div>
                    <label className="block">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border rounded-lg w-full p-2 my-2 text-black"
                    />
                </div>
                <div>
                    <label className="block">Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border rounded-lg w-full p-2 my-2 text-black"
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
                    Sign Up
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <a href="/login" className="text-blue-600">Login here</a>
            </p>
        </div>
    );
}