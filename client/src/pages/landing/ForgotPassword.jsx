import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Orange with Food Illustrations */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 text-white text-2xl font-bold flex items-center gap-2">
                    <div className="w-30 h-30 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <img src="/logo.png" alt="Logo" className="w-30 h-30" />
                    </div>
                </div>


                {/* Lightning Bolts */}
                <svg className="absolute top-1/4 right-20 w-12 h-12 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>

                <svg className="absolute bottom-32 left-20 w-10 h-10 text-white opacity-60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>

                {/* Main Food Illustrations */}
                <div className="relative z-10">
                    {/* Top Circle - Salad Bowl */}
                    <div className="bg-gray-900 rounded-full w-72 h-72 flex items-center justify-center mb-8 shadow-2xl border-8 border-gray-800">
                        <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
                            <ellipse cx="64" cy="70" rx="45" ry="15" fill="#f0f0f0" />
                            <path d="M19 70v8c0 8.284 20.147 15 45 15s45-6.716 45-15v-8" fill="#e0e0e0" />
                            <circle cx="50" cy="55" r="12" fill="#4ade80" />
                            <circle cx="78" cy="52" r="12" fill="#22c55e" />
                            <circle cx="64" cy="65" r="10" fill="#86efac" />
                            <ellipse cx="40" cy="62" rx="10" ry="8" fill="#ef4444" />
                            <ellipse cx="85" cy="60" rx="8" ry="10" fill="#fbbf24" />
                        </svg>
                    </div>

                    {/* Bottom Circles */}
                    <div className="flex gap-8 justify-center">
                        {/* Left Circle - Wrap */}
                        <div className="bg-white rounded-full w-48 h-48 flex items-center justify-center shadow-2xl border-8 border-gray-800">
                            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                                <ellipse cx="50" cy="50" rx="35" ry="30" fill="#d4a574" />
                                <path d="M20 45c0-5 5-10 15-12 5-1 10 0 15 2" stroke="#8b6f47" strokeWidth="2" fill="none" />
                                <circle cx="45" cy="48" r="8" fill="#ef4444" />
                                <circle cx="38" cy="52" r="5" fill="#4ade80" />
                                <circle cx="52" cy="52" r="5" fill="#fbbf24" />
                                <path d="M30 50c5-8 15-10 25-5" stroke="#22c55e" strokeWidth="3" fill="none" />
                            </svg>
                        </div>

                        {/* Right Circle - Noodle Bowl */}
                        <div className="bg-white rounded-full w-48 h-48 flex items-center justify-center shadow-2xl border-8 border-gray-800">
                            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                                <ellipse cx="50" cy="55" rx="30" ry="12" fill="#f0f0f0" />
                                <path d="M20 55v6c0 6.627 13.431 12 30 12s30-5.373 30-12v-6" fill="#e0e0e0" />
                                <path d="M35 45c2-3 5-5 8-6 3-1 7 0 10 2" stroke="#fbbf24" strokeWidth="3" fill="none" />
                                <path d="M40 42c3-2 6-3 9-3 3 0 6 1 8 3" stroke="#f27636" strokeWidth="3" fill="none" />
                                <path d="M45 48c2-2 4-3 7-3s5 1 6 3" stroke="#e7582e" strokeWidth="2" fill="none" />
                                <rect x="45" y="35" width="10" height="15" rx="2" fill="#8b4513" />
                                <rect x="47" y="33" width="6" height="3" rx="1" fill="#654321" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Decorative Wave */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 200 200" fill="white">
                        <path d="M0,100 Q50,50 100,100 T200,100 L200,200 L0,200 Z" />
                    </svg>
                </div>
            </div>

            {/* Right Side - Forgot Password Form */}
            <div className="w-full lg:w-1/2 bg-[#f5f0eb] flex items-center justify-center p-8 relative">
                <svg className="absolute top-8 right-8 w-12 h-12 text-third opacity-70" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                </svg>

                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-third mb-2">FORGOT PASSWORD?</h1>
                    <p className="text-gray-600 mb-8">Don't worry! Enter your email and we'll send you a reset link.</p>

                    {isSubmitted ? (
                        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-green-800">Check your email!</p>
                                    <p className="text-sm text-green-700">We've sent a password reset link to your email.</p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-third focus:outline-none text-gray-800 placeholder-gray-400 transition-colors"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        Send Reset Link
                    </button>

                    <div className="mt-8 text-center">
                        <svg className="inline-block w-8 h-8 text-primary mb-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                        </svg>
                        <p className="text-gray-600">
                            Remember your password?{' '}
                            <Link to="/auth/login" className="text-primary font-semibold hover:text-secondary transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="text-primary font-semibold hover:text-secondary transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}