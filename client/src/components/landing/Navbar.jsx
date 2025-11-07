import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Menu', href: '#menu' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#home" className="flex items-center group">
                            <div className="relative flex items-center space-x-2">
                                <img
                                    src="/logotext.png"
                                    alt="Eatwana Logo"
                                    className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-gray-700 hover:text-[#e7582e] font-medium text-base transition-colors duration-300 group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#e7582e] to-[#f27636] group-hover:w-full transition-all duration-300"></span>
                            </a>
                        ))}
                    </div>

                    {/* Auth Button - Desktop */}
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-[#125a69] font-medium">
                                    <User className="w-5 h-5" />
                                    <span>John Doe</span>
                                </div>
                                <button
                                    onClick={toggleLogin}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white bg-[#125a69] hover:bg-[#0d4450] transform hover:scale-105 transition duration-300 shadow-md hover:shadow-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                className="relative px-6 py-2.5 rounded-lg text-white font-semibold overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#e7582e] to-[#f27636] transition-all duration-300 group-hover:scale-105"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#f27636] to-[#e7582e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <Link to="/auth/login" className="relative flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>Login / Signup</span>
                                </Link>
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-lg text-[#125a69] hover:bg-gray-100 transition-colors duration-300"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-3 bg-white border-t border-gray-100">
                    {navLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-2 rounded-lg text-gray-700 hover:text-[#e7582e] hover:bg-gray-50 font-medium transition-all duration-300 transform hover:translate-x-1"
                            style={{
                                animation: isMenuOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                            }}
                        >
                            {link.name}
                        </a>
                    ))}

                    {/* Mobile Auth Button */}
                    <div className="pt-2">
                        {isLoggedIn ? (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 px-4 py-2 text-[#125a69] font-medium">
                                    <User className="w-5 h-5" />
                                    <span>John Doe</span>
                                </div>
                                <button
                                    onClick={toggleLogin}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-white bg-[#125a69] hover:bg-[#0d4450] font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={toggleLogin}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-white font-semibold bg-gradient-to-r from-[#e7582e] to-[#f27636] hover:from-[#f27636] hover:to-[#e7582e] transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                                <User className="w-4 h-4" />
                                <span>Login / Signup</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </nav>
    );
}