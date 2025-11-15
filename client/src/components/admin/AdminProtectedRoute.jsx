// src/components/AdminProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginSuccess, logoutAdmin } from "../../app/auth/adminSlice";
import axiosClient from "../../services/axiosClient";
import { RippleLoader } from "../../ui/Loader";

const AdminProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();

    // ⛔ FIXED: now using correct reducer names
    const { admin, token, isAuthenticated } = useSelector((state) => state.admin);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateAdmin = async () => {
            try {
                // ⚡ If no token at all → logout
                if (!token) {
                    dispatch(logoutAdmin());
                    setLoading(false);
                    return;
                }

                // ⚡ Validate token with backend (recommended)
                const res = await axiosClient.get("/api/v1/admin/auth/validate");

                if (res.status == 200 && res.data.admin) {
                    // If Redux doesn't have admin object, restore it
                    if (!admin) {
                        dispatch(
                            loginSuccess({
                                admin: res.data.admin,
                                token,
                            })
                        );
                    }
                    setLoading(false);
                } else {
                    dispatch(logoutAdmin());
                    setLoading(false);
                }
            } catch (err) {
                console.error("Validation failed:", err);
                dispatch(logoutAdmin());
                setLoading(false);
            }
        };

        validateAdmin();
    }, [dispatch, token]);

    // Show loader while checking token
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <RippleLoader size={60} color="#e7582e" />
            </div>
        );
    }

    // ❌ Not authenticated → redirect to login
    if (!isAuthenticated || !token || !admin) {
        return <Navigate to="/admin/auth/login" replace />;
    }

    // ✅ Authenticated → allow access
    return children;
};

export default AdminProtectedRoute;
