import React from "react";
import Navbar from "../components/landing/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <div className="pt-16"> {/* optional padding for fixed navbar */}
                <Outlet /> {/* nested routes render here */}
            </div>
        </>
    );
}
