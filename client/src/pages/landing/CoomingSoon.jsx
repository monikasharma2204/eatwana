import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function ComingSoon() {
    const [isVisible, setIsVisible] = useState(false);
    const [floatingItems, setFloatingItems] = useState([]);

    useEffect(() => {
        setIsVisible(true);
        const items = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 12 + Math.random() * 8,
            icon: i % 3 === 0 ? '🍛' : i % 3 === 1 ? '🍱' : '🥘'
        }));
        setFloatingItems(items);
    }, []);

    const handleCall = () => {
        window.location.href = 'tel:+916204809991';
    };

    const handleWhatsApp = () => {
        window.open('https://wa.me/916204809991', '_blank');
    };

    return (
        <div className="h-screen w-full bg-linear-to-br from-[#125a69] via-[#0d4450] to-[#125a69] relative overflow-hidden flex items-center justify-center">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingItems.map((item) => (
                    <div
                        key={item.id}
                        className="absolute text-3xl opacity-15 animate-float pointer-events-none"
                        style={{
                            left: `${item.left}%`,
                            animationDelay: `${item.delay}s`,
                            animationDuration: `${item.duration}s`,
                            bottom: '-10%'
                        }}
                    >
                        {item.icon}
                    </div>
                ))}
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#e7582e] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-10 w-64 h-64 bg-[#f27636] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#e7582e] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl">
                {/* Logo with white background */}
                <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-white rounded-3xl shadow-2xl">
                            <img
                                src="/logo.webp"
                                alt="Eatwana Logo"
                                className="w-40 h-40 md:w-52 md:h-52 object-contain"
                            />
                        </div>
                    </div>

                    <div className="inline-block bg-gradient-to-r from-[#e7582e] to-[#f27636] px-6 py-2 rounded-full mb-6">
                        <p className="text-white font-semibold text-sm md:text-base tracking-wide">
                            Cloud Kitchen & Tiffin Service
                        </p>
                    </div>
                </div>

                {/* Coming soon section */}
                <div className={`text-center mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                        <span className="text-4xl">🍽️</span>
                        Coming Soon
                        <span className="text-4xl">🍽️</span>
                    </h2>
                    <p className="text-md md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        Delicious homemade meals delivered fresh to your doorstep. Stay hungry, we're almost ready!
                    </p>
                </div>

                {/* Features */}
                <div className={`grid grid-cols-3 gap-3 md:gap-6 mb-8 w-full max-w-xl transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-3xl md:text-4xl mb-1">🍛</div>
                        <p className="text-white text-xs md:text-sm font-medium">Fresh Daily</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-3xl md:text-4xl mb-1">🚚</div>
                        <p className="text-white text-xs md:text-sm font-medium">Fast Delivery</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-3xl md:text-4xl mb-1">💯</div>
                        <p className="text-white text-xs md:text-sm font-medium">Top Quality</p>
                    </div>
                </div>

                {/* Contact section */}
                <div className={`text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <p className="text-white text-base md:text-lg mb-4 font-medium">Get in Touch Now!</p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-3">
                        <button
                            onClick={handleCall}
                            className="group relative bg-gradient-to-r from-[#e7582e] to-[#f27636] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-[#e7582e]/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            <Phone className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
                            <span className="relative z-10">Call Now</span>
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="group relative bg-white text-[#125a69] px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#e7582e] to-[#f27636] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:text-white transition-colors" />
                            <span className="relative z-10 group-hover:text-white transition-colors">WhatsApp</span>
                        </button>
                    </div>

                    <a href="tel:+916204809991" className="text-gray-300 hover:text-[#f27636] transition-colors text-base md:text-lg font-medium inline-block">
                        +91 6204 809 991
                    </a>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}