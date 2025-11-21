import React, { useState, useEffect } from 'react';
import { Clock, Shield, DollarSign, Truck, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const images = [
        { src: "/picture/pic1.webp", alt: "Freshly prepared homestyle meal with vegetables and rice" },
        { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop", alt: "Gourmet food platter with assorted dishes" },
        { src: "/picture/pic2.webp", alt: "Nutritious tiffin meal for working professionals" },
        { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop", alt: "Delicious pizza with fresh toppings" },
        { src: "picture/AboutImage.webp", alt: "Cloud kitchen preparing fresh daily meals" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setIsTransitioning(false);
            }, 500);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section
            id="home"
            aria-label="Hero section - Fresh homely meals delivered daily"
            className="relative min-h-screen bg-linear-to-br from-orange-50 via-white to-cyan-50 overflow-hidden"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-third opacity-5 rounded-full blur-3xl" aria-hidden="true"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <header className="space-y-8 animate-fade-in">
                        {/* Badge */}
                        <mark className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                            <span>Trusted by 10,000+ Customers</span>
                        </mark>

                        {/* Main Heading */}
                        <hgroup className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Fresh, Homely Meals
                                <span className="block text-primary mt-2">Delivered Daily</span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                                Premium cloud kitchen, restaurant quality food, and customizable tiffin services designed for busy
                                <strong className="font-semibold text-third"> students</strong> and
                                <strong className="font-semibold text-third"> working professionals</strong>
                            </p>
                        </hgroup>

                        {/* CTA Buttons */}
                        <nav aria-label="Primary actions" className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleNavigate("/menu")}
                                className="group bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                aria-label="Order food now"
                            >
                                Order Now
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>

                            <button
                                onClick={() => handleNavigate("/tiffin")}
                                className="bg-white border-2 border-third text-third px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-third hover:text-white transform hover:scale-105 transition-all duration-300"
                                aria-label="View our tiffin menu"
                            >
                                View Menu
                            </button>
                        </nav>
                    </header>

                    {/* Right Image Section */}
                    <figure className="relative lg:h-[600px] animate-slide-in">
                        {/* Main Image Container */}
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Image with fade transition */}
                            <picture className="relative w-full h-full">
                                <img
                                    src={images[currentImageIndex].src}
                                    alt={images[currentImageIndex].alt}
                                    loading="eager"
                                    className={`w-full h-full object-cover transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                                />
                            </picture>

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true"></div>

                            {/* Floating badge */}
                            <aside className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                                <span className="font-semibold text-gray-900">Fresh Daily</span>
                            </aside>

                            {/* Image indicators */}
                            <nav aria-label="Image carousel navigation" className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setIsTransitioning(true);
                                            setTimeout(() => {
                                                setCurrentImageIndex(index);
                                                setIsTransitioning(false);
                                            }, 500);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                        aria-label={`View image ${index + 1} of ${images.length}`}
                                        aria-current={index === currentImageIndex ? 'true' : 'false'}
                                    />
                                ))}
                            </nav>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 blur-xl" aria-hidden="true"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-third to-cyan-600 rounded-full opacity-20 blur-xl" aria-hidden="true"></div>

                        <figcaption className="sr-only">
                            Slideshow showcasing our delicious homestyle meals and tiffin services
                        </figcaption>
                    </figure>
                </div>
            </div>

            <style jsx>{`
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

                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }

                .animate-slide-in {
                    animation: slide-in 1s ease-out;
                }
            `}</style>
        </section>
    );
}