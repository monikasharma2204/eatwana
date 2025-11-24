import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useNavigate } from "react-router-dom";
import { loginSuccess } from '../../app/auth/adminSlice';
import { useDispatch } from "react-redux"
// AlertSnackbar Component
const AlertSnackbar = ({ open, message, severity, duration, onClose, position }) => {
    if (!open) return null;

    const severityColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div
            className={`fixed ${position.vertical === 'top' ? 'top-4' : 'bottom-4'} ${position.horizontal === 'right' ? 'right-4' : 'left-4'} z-50 animate-slide-in`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
        >
            <div className={`${severityColors[severity]} text-white px-6 py-4 rounded-lg shadow-lg max-w-md flex items-center gap-3`}>
                <span className="flex-1">{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200 font-bold">
                    ×
                </button>
            </div>
        </div>
    );
};

export default function AdminLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, open: false }));
        }, 4000);
    };

    const handleClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showSnackbar('Please fill in all fields', 'warning');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post('/api/v1/admin/auth/login', {
                email,
                password
            });
            console.log(response)
            dispatch(loginSuccess(response.data));
            if (response.status == 200) {
                showSnackbar('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    navigate('/admin/dashboard')
                }, 1500);
            }
        } catch (error) {
            showSnackbar('Invalid credentials! Please try again.', 'error');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleClose}
                position={{ vertical: 'top', horizontal: 'right' }}
            />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Logo/Branding */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Sign in to access the dashboard
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm text-blue-500 hover:text-blue-600 transition"
                                disabled={loading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Info
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            <strong>Demo Credentials:</strong><br />
                            Email: admin@example.com<br />
                            Password: password123
                        </p>
                    </div> */}
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}