import React from 'react';
import { Utensils, ChefHat, Sparkles, Dumbbell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MenuSection = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const menuCards = [
        {
            id: 1,
            title: "Tiffin Menu",
            description: "Daily home-style meals perfect for students and working professionals. Healthy, hygienic, and affordable.",
            icon: Utensils,
            gradient: "from-primary/10 to-secondary/10",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            linkLabel: "View tiffin menu details"
        },
        {
            id: 2,
            title: "Restaurant Dishes",
            description: "Traditional restaurant favorites including rice, roti, sabji, combo plates, snacks, and more.",
            icon: ChefHat,
            gradient: "from-secondary/10 to-primary/10",
            iconBg: "bg-secondary/10",
            iconColor: "text-secondary",
            linkLabel: "View restaurant dishes details"
        },
        {
            id: 3,
            title: "Special Orders",
            description: "Premium catering for parties, bulk orders, and custom personalized meals for your special occasions.",
            icon: Sparkles,
            gradient: "from-third/10 to-primary/10",
            iconBg: "bg-third/10",
            iconColor: "text-third",
            linkLabel: "View special orders details"
        },
        {
            id: 4,
            title: "Gym Menu",
            description: "High-protein, nutrition-focused meals designed for fitness enthusiasts. Calorie-counted and macro-balanced.",
            icon: Dumbbell,
            gradient: "from-primary/10 to-third/10",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            linkLabel: "View gym menu details"
        }
    ];

    return (
        <section
            id="menu-section"
            aria-labelledby="menu-heading"
            className="py-16 px-4 lg:px-20 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <header className="text-center mb-16 animate-fade-in">
                    <h2 id="menu-heading" className="text-3xl md:text-4xl font-bold text-third mb-4">
                        Our Menu
                    </h2>
                    <p className="text-md text-gray-600 max-w-xl mx-auto">
                        Discover our diverse range of delicious offerings, crafted with care to satisfy every craving
                    </p>
                </header>

                {/* Menu Cards Grid */}
                <ul
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 list-none p-0"
                    role="list"
                    aria-label="Menu categories"
                >
                    {menuCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <li key={card.id}>
                                <article
                                    className={`group bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border border-third/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer h-full`}
                                >
                                    {/* Icon Container */}
                                    <div
                                        className={`${card.iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                                        aria-hidden="true"
                                    >
                                        <IconComponent className={`w-8 h-8 ${card.iconColor}`} strokeWidth={2} />
                                    </div>

                                    {/* Card Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {card.description}
                                    </p>

                                    {/* Hover Indicator */}
                                    <Link
                                        to="/menu"
                                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                        aria-label={card.linkLabel}
                                        className="mt-5 flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        View Details
                                        <svg
                                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </article>
                            </li>
                        );
                    })}
                </ul>

                {/* CTA Button */}
                <nav aria-label="Menu navigation" className="text-center">
                    <button
                        onClick={() => handleNavigate("/menu")}
                        aria-label="Explore all menu items"
                        className="bg-primary hover:bg-secondary text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                    >
                        Explore All Menu
                    </button>
                </nav>
            </div>
        </section>
    );
};

export default MenuSection;