import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterSection() {
    const importantLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/#about' },
        { name: 'Menu', href: '/menu' },
        { name: 'Tiffin Services', href: '/tiffin' },
        { name: 'Contact Us', href: '/#contact' }
    ];

    const contactInfo = [
        { icon: Phone, text: '+91 97082 77467', href: 'tel:+919708277467' },
        {
            icon: Mail, text: 'eatwana@gmail.com', href: 'mailto:eatwana@gmail.com'
        },
        { icon: MessageCircle, text: 'WhatsApp: +91 97082 77467', href: 'https://wa.me/919708277467' },
        // { icon: MapPin, text: 'Serving across major cities', href: '#locations' }
    ];

    return (
        <footer className="bg-gradient-to-br from-[#125a69] to-[#0a3d47] text-white">
            <div className="max-w-7xl mx-auto px-4 py-12 lg:px-20 lg:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Logo + Tagline Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center space-x-2 w-32">
                            <img src='/logo.png' className='bg-white rounded-2xl p-4' />
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Delivering healthy, homely & hygienic meals to students and working professionals.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <a
                                href="https://www.facebook.com/profile.php?id=61583099625282"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/10 hover:bg-[#e7582e] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/eatwana/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-white/10 hover:bg-[#e7582e] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >

                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            {/* <a
                                href="#"
                                className="w-9 h-9 bg-white/10 hover:bg-[#e7582e] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a> */}
                        </div>
                    </div>

                    {/* Important Links Section */}
                    <div className="lg:col-span-1">
                        <h4 className="text-lg font-semibold mb-4 text-[#f27636]">Quick Links</h4>
                        <nav aria-label="Footer navigation">
                            <ul className="space-y-2.5">
                                {importantLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.href}
                                            className="text-white/80 hover:text-[#e7582e] text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Contact Details Section */}
                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold mb-4 text-[#f27636]">Get In Touch</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contactInfo.map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <a
                                        key={index}
                                        href={contact.href}
                                        className="flex items-start space-x-3 text-white/80 hover:text-[#e7582e] transition-all duration-300 group"
                                    >
                                        <div className="mt-0.5 p-2 bg-white/10 rounded-lg group-hover:bg-[#e7582e] transition-colors duration-300">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm leading-relaxed">{contact.text}</span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Newsletter Section */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h5 className="text-sm font-semibold mb-3">Subscribe to Our Newsletter</h5>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#e7582e] transition-colors duration-300"
                                    aria-label="Email for newsletter"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-[#e7582e] to-[#f27636] rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Credits Section */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/70 text-sm">
                        © 2025 Cloud Kitchen & Tiffin Service. All rights reserved.
                    </p>
                    <p className="text-white/60 text-xs mt-2">
                        Designed & Developed by <span className="text-[#f27636] font-semibold hover:text-[#e7582e] transition-colors duration-300">Tejasvi Kumar</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}