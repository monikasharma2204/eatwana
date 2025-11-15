import React from "react";
import { Outlet } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Optional future: Admin Sidebar here */}
            <div className="flex-1 p-6">
                <AdminProtectedRoute>
                    <Outlet />
                </AdminProtectedRoute>
            </div>
        </div>
    );
}
