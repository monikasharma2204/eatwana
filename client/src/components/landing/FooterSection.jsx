import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterSection() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const importantLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Menu', href: '/menu' },
        { name: 'Tiffin Services', href: '/tiffin' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Sitemap', href: '/sitemap' },
        { name: 'Admin Login', href: '/admin/auth/login' }
    ];

    const contactInfo = [
        { icon: Phone, text: '+91 97082 77467', href: 'tel:+919708277467' },
        { icon: Mail, text: 'eatwana@gmail.com', href: 'mailto:eatwana@gmail.com' },
        { icon: MessageCircle, text: 'WhatsApp: +91 97082 77467', href: 'https://wa.me/919708277467' },
    ];

    return (
        <footer className="bg-gradient-to-br from-[#125a69] to-[#0a3d47] text-white">
            <div className="max-w-7xl mx-auto px-4 py-12 lg:px-20 lg:py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Logo Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center space-x-2 w-32">
                            <img src='/logo.webp' className='bg-white rounded-2xl p-4' />
                        </div>

                        <p className="text-white/80 text-sm leading-relaxed">
                            Delivering healthy, homely & hygienic meals to students and working professionals.
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-3 pt-2">

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/profile.php?id=61583099625282"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={scrollToTop}
                                className="w-9 h-9 bg-white/10 hover:bg-[#e7582e] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/eatwana/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={scrollToTop}
                                className="w-9 h-9 bg-white/10 hover:bg-[#e7582e] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 ..." />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Important Links */}
                    <div className="lg:col-span-1">
                        <h4 className="text-lg font-semibold mb-4 text-[#f27636]">Quick Links</h4>
                        <nav aria-label="Footer navigation">
                            <ul className="space-y-2.5">
                                {importantLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.href}
                                            onClick={scrollToTop}
                                            className="text-white/80 hover:text-[#e7582e] text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold mb-4 text-[#f27636]">Get In Touch</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contactInfo.map((contact, index) => {
                                const Icon = contact.icon;
                                return (
                                    <a
                                        key={index}
                                        href={contact.href}
                                        onClick={scrollToTop}
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

                        {/* Newsletter */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h5 className="text-sm font-semibold mb-3">Subscribe to Our Newsletter</h5>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#e7582e] transition-colors duration-300"
                                />
                                <button
                                    className="px-6 py-2 bg-gradient-to-r from-[#e7582e] to-[#f27636] rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    onClick={scrollToTop}
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/70 text-sm">
                        © 2025 Eatwana Cloud Kitchen & Tiffin Service. All rights reserved.
                    </p>

                    <a
                        href='https://tejasvi.vercel.app/'
                        target='_blank'
                        rel="noopener noreferrer"
                        onClick={scrollToTop}
                        className="text-white/60 text-xs mt-2"
                    >
                        Designed & Developed by <span className="text-[#f27636] font-semibold hover:text-[#e7582e] transition-colors duration-300">Tejasvi Kumar</span>
                    </a>
                </div>

            </div>
        </footer>
    );
}
