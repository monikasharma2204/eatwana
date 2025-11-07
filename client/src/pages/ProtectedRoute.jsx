// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    // If user is not logged in, redirect to login page
    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    // Otherwise, render the protected page
    return children;
};

export default ProtectedRoute;
