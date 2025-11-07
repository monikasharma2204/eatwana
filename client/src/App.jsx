import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./pages/landing/Home";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/SignUp";
import ForgotPassword from "./pages/landing/ForgotPassword";
import Loader from "./ui/Loader";
import Profile from "./pages/landing/Profile";
import CoomingSoon from "./pages/landing/CoomingSoon";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// Utils
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== AUTH ROUTES ==================== */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/loader" element={<Loader />} />
          <Route path="/" element={<CoomingSoon />} />
        </Route>

        {/* ==================== MAIN ROUTES ==================== */}
        <Route element={<MainLayout />}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        {/* <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route> */}
      </Routes>
    </Router>
  );
}
