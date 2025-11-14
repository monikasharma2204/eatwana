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
                <div className="flex flex-col gap-8 items-center">
                    {/* Top Bowl */}
                    <div className="w-80 h-80 rounded-full shadow-2xl flex items-center justify-center transform -rotate-3">
                        <div className="w-72 h-72   overflow-hidden shadow-inner">
                            <img src='/picture/d4.png' />
                        </div>
                    </div>

                    {/* Bottom Row Bowls */}
                    <div className="flex gap-8">
                        <div className="w-56 h-56 bg-linear-to-br  rounded-full shadow-2xl flex items-center justify-center transform rotate-6">
                            <img src='/picture/d1.png' />
                        </div>
                        <div className="w-56 h-56 bg-linear-to-br rounded-full shadow-2xl flex items-center justify-center transform -rotate-50">
                            <img src="/picture/d2.png" className="rotate-6" alt="Rotated" />
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