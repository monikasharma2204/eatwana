import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertSnackbar from '../../ui/AlertSnackbar';
import axiosClient from '../../services/axiosClient';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setError, startLoading } from '../../app/auth/userSlice';
// import { BlinkingDots } from '../../ui/Loader';


export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // ✅ Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !mobile || !password || !confirmPassword) {
            showSnackbar("Please fill all required fields", "warning");
            return;
        }

        if (password !== confirmPassword) {
            showSnackbar("Passwords do not match!", "error");
            return;
        }

        try {
            // 🟡 Start Loading
            dispatch(startLoading());

            const response = await axiosClient.post("/api/v1/auth/signup", {
                name,
                email,
                phone: mobile,
                password,
            });

            if (response.status === 201) {
                const { user, token, message } = response.data;

                // ✅ Success
                dispatch(loginSuccess({ user, token }));
                showSnackbar(message || "Signup successful!", "success");

                setName("");
                setEmail("");
                setMobile("");
                setPassword("");
                setConfirmPassword("");

                setTimeout(() => navigate("/"), 1500);
            }
        } catch (error) {
            console.error("Signup error:", error);
            dispatch(setError(error.response?.data?.message || "Signup failed"));
            showSnackbar(error.response?.data?.message || "Signup failed", "error");
        }
    };


    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />

            <div className="min-h-screen flex">
                {/* Left Side - Image Section */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50,100 Q75,50 100,100 T150,100" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />
                            <path d="M200,150 Q225,100 250,150 T300,150" stroke="white" strokeWidth="3" fill="none" opacity="0.3" />
                            <circle cx="80" cy="250" r="40" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                            <rect x="280" y="80" width="60" height="60" stroke="white" strokeWidth="2" fill="none" opacity="0.3" />
                        </svg>
                    </div>

                    {/* Lightning Bolts */}
                    <svg className="absolute top-8 left-12 w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-2 8 10-12h-8z" />
                    </svg>
                    <svg className="absolute top-1/3 right-16 w-10 h-10 text-white rotate-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-2 8 10-12h-8z" />
                    </svg>
                    <svg className="absolute bottom-32 left-1/4 w-6 h-6 text-white -rotate-45" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-2 8 10-12h-8z" />
                    </svg>

                    {/* Food Images Container */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                        {/* Top Logo */}
                        <div className="absolute top-8 left-8 text-white text-2xl font-bold flex items-center gap-2">
                            <div className="w-30 h-30 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <img src="/logo.png" alt="Logo" className="w-30 h-30" />
                            </div>
                        </div>

                        {/* Food Bowls */}
                        <div className="flex flex-col gap-8 items-center">
                            {/* Top Bowl */}
                            <div className="w-80 h-80 rounded-full shadow-2xl flex items-center justify-center transform -rotate-3">
                                <div className="w-72 h-72   overflow-hidden shadow-inner">
                                    <img src='/picture/d4.png' />
                                </div>
                            </div>

                            {/* Bottom Row Bowls */}
                            <div className="flex gap-8">
                                <div className="w-56 h-56 bg-gradient-to-br  rounded-full shadow-2xl flex items-center justify-center transform rotate-6">
                                    <img src='/picture/d1.png' />
                                </div>
                                <div className="w-56 h-56 bg-gradient-to-br rounded-full shadow-2xl flex items-center justify-center transform -rotate-50">
                                    <img src="/picture/d2.png" className="rotate-6" alt="Rotated" />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Decorative Wave */}
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                        <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                            <path d="M 0,100 Q 50,50 100,100 T 200,100 L 200,200 L 0,200 Z" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-50 p-8 relative overflow-y-auto">
                    {/* Lightning Bolt Decorations */}
                    <svg className="absolute top-12 right-24 w-12 h-12 text-third opacity-60" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-2 8 10-12h-8z" />
                    </svg>
                    <svg className="absolute bottom-24 left-12 w-8 h-8 text-primary opacity-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-2 8 10-12h-8z" />
                    </svg>

                    {/* Decorative Image Overlay */}
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                        <div className="w-full h-full bg-gradient-to-bl from-gray-300 to-transparent rounded-bl-full"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-48 h-96 opacity-5">
                        <div className="w-full h-full bg-gradient-to-tl from-gray-400 to-transparent"></div>
                    </div>

                    {/* Signup Card */}
                    <div className="w-full max-w-md z-10 my-8">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-third mb-2">
                                CREATE ACCOUNT
                            </h1>
                            <p className="text-gray-600">Join us for a delicious journey</p>
                        </div>

                        <div className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-100 bg-opacity-80 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-100 bg-opacity-80 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                            </div>

                            {/* Mobile Number Input */}
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-100 bg-opacity-80 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-100 bg-opacity-80 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-100 bg-opacity-80 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
                                />
                            </div>

                            {/* Terms and Conditions */}
                            {/* <div className="flex items-center gap-2 px-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 accent-primary cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                    I agree to the{' '}
                                    <button className="text-secondary hover:text-primary hover:underline transition">
                                        Terms & Conditions
                                    </button>
                                </label>
                            </div> */}

                            {/* Signup Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 rounded-full text-white font-semibold text-lg
    flex items-center justify-center
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"} 
    shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
                            >
                                <div className="transition-opacity duration-300">
                                    {loading ? <div className='py-2'><BlinkingDots size="md" color="theme" /></div> : "Sign Up"}
                                </div>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">Or sign up with</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Social Signup Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center gap-3 hover:border-primary hover:shadow-md transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Google</span>
                                </button>

                            </div>

                            {/* Login Link */}
                            <p className="text-center text-gray-600 mt-6">
                                Already have an account?{' '}
                                <Link to="/auth/login" className="font-semibold text-secondary hover:text-primary hover:underline transition">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}