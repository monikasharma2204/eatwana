// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginSuccess, logout } from "../app/auth/userSlice";
import axiosClient from "../services/axiosClient";
import { RippleLoader } from "../ui/Loader";
// import { BlinkingDots } from "../ui/Loader";

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false); // local state to wait for validation

    useEffect(() => {
        const validateUser = async () => {
            try {
                // ✅ If no token in Redux, immediately logout
                if (!token) {
                    dispatch(logout());
                    setLoading(false);
                    return;
                }

                // ✅ Validate token with backend (optional but best practice)
                const response = await axiosClient.get("/api/v1/customer/validate");

                if (response.status === 200 && response.data.user) {
                    // User is valid → update Redux if missing
                    if (!user) {
                        dispatch(loginSuccess({ user: response.data.user, token }));
                    }
                    setLoading(false);
                } else {
                    dispatch(logout());
                    setLoading(false);
                }
            } catch (error) {
                console.error("Token validation failed:", error);
                dispatch(logout());
                setLoading(false);
            }
        };

        validateUser();
    }, [dispatch, token]);

    // 🌀 While validation is in progress
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <RippleLoader size={60} color="#e7582e" />
            </div>
        );
    }

    // ❌ If not logged in → redirect
    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    // ✅ Otherwise → render protected content
    return children;
};

export default ProtectedRoute;
