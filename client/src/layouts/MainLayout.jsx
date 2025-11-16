import React from "react";
import Navbar from "../components/landing/Navbar";
import { Outlet } from "react-router-dom";
import FooterSection from "../components/landing/FooterSection";
import { MessageCircle, Phone } from "lucide-react";

export default function MainLayout() {
    return (
        <>
            <Navbar />
            <div className="pt-16"> {/* optional padding for fixed navbar */}
                <Outlet /> {/* nested routes render here */}
            </div>
            <FooterSection />
            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/919708277467"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
            >
                <MessageCircle className="w-7 h-7" />
            </a>

            {/* Floating Call Button */}
            <a
                href="tel:+919708277467"
                className="fixed bottom-24 right-6 bg-third text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 z-50"
            >
                <Phone className="w-7 h-7" />
            </a>

        </>
    );
}
