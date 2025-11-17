import React from 'react';
import { Truck, Shield, Wallet, Calendar, Users, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCards = () => {
    const navigate = useNavigate()
    const features = [
        {
            icon: Truck,
            title: "Fast Delivery",
            description: "Get your meals delivered hot and fresh within 30 minutes to your doorstep"
        },
        {
            icon: Shield,
            title: "Hygienic Food",
            description: "100% hygienic preparation with regular quality checks and certified kitchen standards"
        },
        {
            icon: Wallet,
            title: "Affordable Plans",
            description: "Budget-friendly tiffin and meal plans starting from just ₹99 per day"
        },
        {
            icon: Calendar,
            title: "Daily Fresh Menu",
            description: "New variety every day with rotating menus to keep your meals exciting and nutritious"
        },
        {
            icon: Users,
            title: "Student-Friendly Pricing",
            description: "Special discounts and flexible plans designed for students and working professionals"
        },
        {
            icon: ChefHat,
            title: "Professional Chefs",
            description: "Experienced culinary experts preparing authentic homestyle meals with love"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold text-third mb-4">
                        Why Choose Us?
                    </h2>
                    <p className="text-md text-gray-600 max-w-xl mx-auto">
                        Experience the perfect blend of quality, affordability, and convenience with our cloud kitchen services
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-third/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in items-center justify-center flex flex-col"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon Container */}
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-third mb-3 group-hover:text-primary transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm text-center">
                                    {feature.description}
                                </p>

                                {/* Decorative element */}
                                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-full transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <button onClick={() => {
                        navigate("/menu")
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }} className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        Get Started Today
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
};

export default FeatureCards;