import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Optional future: Admin Sidebar here */}
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
}
