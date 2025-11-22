import { useState } from 'react';
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/auth/userSlice';

export default function Navbar() {
    const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart.cart);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navLinks = [
        { name: 'Home', href: '/', type: 'route' },
        { name: 'Menu', href: '/menu', type: 'route' },
        { name: 'Tiffin', href: '/tiffin', type: 'route' },
        { name: 'About Us', href: '/about', type: 'route' },
        { name: 'Contact', href: '/contact', type: 'route' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleNavClick = (link) => {
        setIsMenuOpen(false);
        navigate(link.href);
    };

    return (
        <header>
            <nav
                className="fixed top-0 left-0 right-0 z-50 bg-linear-to-br from-orange-50 via-white to-cyan-50 shadow-md"
                aria-label="Main Navigation"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* LOGO */}
                        <Link
                            to="/"
                            className="flex items-center gap-1 group"
                            title="Eatwana — Fresh & Healthy Meals"
                        >
                            <img
                                src="/EatwanaBowl.webp"
                                alt="Eatwana food bowl logo"
                                loading="lazy"
                                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                            <img
                                src="/logotext.webp"
                                alt="Eatwana brand text"
                                loading="lazy"
                                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        {/* DESKTOP MENU */}
                        <ul className="hidden md:flex md:items-center md:space-x-8">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => handleNavClick(link)}
                                        title={link.name}
                                        className="relative text-gray-700 hover:text-primary 
                                        font-medium text-base group transition-colors duration-300"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 
                                        bg-gradient-to-r from-primary to-[#f27636] 
                                        group-hover:w-full transition-all duration-300"></span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* DESKTOP AUTH */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user.token ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-third"
                                        title="Profile"
                                    >
                                        <User className="w-5 h-5" />
                                    </Link>

                                    <Link
                                        to="/cart"
                                        className="relative text-third"
                                        title="Shopping Cart"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {cart?.length > 0 && (
                                            <span className="absolute -top-2 -right-2 
                                            bg-red-500 text-white text-xs w-4 h-4 flex 
                                            items-center justify-center rounded-full">
                                                {cart.length}
                                            </span>
                                        )}
                                    </Link>

                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="flex items-center px-4 py-2 rounded-lg 
                                        bg-third text-white hover:bg-[#0d4450] transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/auth/login"
                                    title="Login or Create an Account"
                                    className="relative px-6 py-2.5 rounded-lg text-white font-semibold 
                                    bg-gradient-to-r from-primary to-[#f27636]"
                                >
                                    <div className="relative flex items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>Login / Signup</span>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 rounded-lg text-third hover:bg-gray-100"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    id="mobile-menu"
                    className={`md:hidden overflow-hidden transition-all duration-300 
                    ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <ul className="px-4 pt-2 pb-4 space-y-3 bg-white border-t">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <button
                                    onClick={() => handleNavClick(link)}
                                    className="block w-full text-left px-4 py-2 rounded-lg
                                    text-gray-700 hover:text-primary hover:bg-gray-50"
                                    title={link.name}
                                >
                                    {link.name}
                                </button>
                            </li>
                        ))}

                        {/* MOBILE AUTH */}
                        <li className="pt-2">
                            {user.token ? (

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center justify-start gap-4'>
                                        <Link
                                            to="/profile"
                                            className="text-third"
                                            title="Profile"
                                        >
                                            <User className="w-5 h-5" />
                                        </Link>

                                        <Link
                                            to="/cart"
                                            className="relative text-third"
                                            title="Shopping Cart"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {cart?.length > 0 && (
                                                <span className="absolute -top-2 -right-2 
                                            bg-red-500 text-white text-xs w-4 h-4 flex 
                                            items-center justify-center rounded-full">
                                                    {cart.length}
                                                </span>
                                            )}
                                        </Link>

                                    </div>
                                    <button
                                        onClick={() => dispatch(logout())}
                                        className="flex items-center px-4 py-2 rounded-lg 
                                        bg-third text-white hover:bg-[#0d4450] transition"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/auth/login"
                                    className="block px-6 py-2.5 rounded-lg bg-gradient-to-r 
                                    from-primary to-[#f27636] text-white font-semibold text-center"
                                >
                                    <User className="inline w-4 h-4 mr-2" />
                                    Login / Signup
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
