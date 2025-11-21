import React from "react";
import { Link } from "react-router-dom";
import { Home, Phone, Info, Menu as MenuIcon, Utensils, User, ShoppingCart } from "lucide-react";

export default function Sitemap() {
    const sitemapSections = [
        {
            title: "Main Pages",
            icon: <Home className="w-6 h-6 text-red-500" />,
            links: [
                { label: "Home", to: "/" },
                { label: "Menu", to: "/menu" },
                { label: "Tiffin Service", to: "/tiffin" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
            ],
        },
        {
            title: "User Account",
            icon: <User className="w-6 h-6 text-blue-500" />,
            links: [
                { label: "Login", to: "/auth/login" },
                { label: "Signup", to: "/auth/signup" },
                { label: "Profile", to: "/profile" },
                { label: "Cart", to: "/cart" },
            ],
        },
        {
            title: "Dynamic Pages",
            icon: <MenuIcon className="w-6 h-6 text-green-500" />,
            links: [
                { label: "Tiffin Details", to: "/tiffin/:id", dynamic: true },
                { label: "Dish Details", to: "/dish/:id", dynamic: true },
                { label: "Invoice View", to: "/invoice/:id", dynamic: true },
            ],
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Website Sitemap</h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Explore all important pages of the Eatwana platform from one place.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid md:grid-template-3 gap-8">

                    {sitemapSections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                {section.icon}
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {section.title}
                                </h2>
                            </div>

                            <ul className="space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        {link.dynamic ? (
                                            <span className="text-gray-500 text-sm">
                                                {link.label}: <code className="bg-gray-100 px-2 py-1 rounded">{link.to}</code>
                                            </span>
                                        ) : (
                                            <Link
                                                to={link.to}
                                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                                            >
                                                → {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* Footer Section */}
                <div className="text-center mt-16 text-gray-500 text-sm">
                    © {new Date().getFullYear()} Eatwana — All Rights Reserved.
                </div>

            </div>
        </div>
    );
}
