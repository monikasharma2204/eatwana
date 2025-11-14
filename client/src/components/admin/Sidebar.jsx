import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Bell, ChevronDown, ChevronRight,
    LayoutDashboard, UtensilsCrossed, Users, ShoppingBag,
    Settings, BarChart3, Package, DollarSign, Search
} from 'lucide-react';

const Sidebar = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [activeItem, setActiveItem] = useState('dashboard');
    const [notifications] = useState(3);

    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMenu = (menuId) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard'
        },
        {
            id: 'dishes',
            label: 'Dishes',
            icon: UtensilsCrossed,
            subItems: [
                { label: 'All Dishes', path: '/admin/dishes/all' },
                { label: 'Add New Dish', path: '/admin/dishes/add' },
                { label: 'Sub Categories', path: '/admin/sub-categories' },
                { label: 'Add Sub Categories', path: '/admin/sub-categories/add' },
            ]
        },
        {
            id: 'menu',
            label: 'Menu',
            icon: ShoppingBag,
            // badge: 12,
            subItems: [
                { label: 'Menu', path: '/admin/menu' },
                { label: 'Create Menu', path: '/admin/menu/add' }
            ]
        },
        {
            id: 'tiffin',
            label: 'Tiffin',
            icon: Package,
            // badge: 12,
            subItems: [
                { label: 'Tiffin', path: '/admin/tiffin' },
                { label: 'Add Tiffin', path: '/admin/tiffin/add' }
            ]
        },
        {
            id: 'customers',
            label: 'Customers',
            icon: Users,
            path: '/customers'
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: Package,
            subItems: [
                { label: 'Stock Management', path: '/inventory/stock' },
                { label: 'Suppliers', path: '/inventory/suppliers' },
                { label: 'Purchase Orders', path: '/inventory/purchase' }
            ]
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            path: '/analytics'
        },
        {
            id: 'revenue',
            label: 'Revenue',
            icon: DollarSign,
            path: '/revenue'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings'
        }
    ];

    const MenuItem = ({ item }) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus[item.id];
        const isActive = activeItem === item.id;
        const Icon = item.icon;

        const handleClick = () => {
            if (hasSubItems) {
                toggleMenu(item.id);
            } else if (item.path) {
                setActiveItem(item.id);
                navigate(item.path);
                setIsSidebarOpen(false); // close on mobile
            }
        };

        const buttonClasses = `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30'
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 hover:text-orange-600'
            }`;

        return (
            <div className="mb-1">
                <button onClick={handleClick} className={buttonClasses}>
                    <div className="flex items-center gap-3 relative z-10">
                        <div
                            className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-orange-100'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2 relative z-10">
                        {item.badge && (
                            <span
                                className={`px-2 py-1 text-xs font-bold rounded-full ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-orange-100 text-orange-600'
                                    }`}
                            >
                                {item.badge}
                            </span>
                        )}
                        {hasSubItems && (
                            <div className="transition-transform duration-300">
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </div>
                        )}
                    </div>
                </button>

                {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-orange-200 pl-4">
                        {item.subItems.map((subItem, index) => (
                            <Link
                                key={index}
                                to={subItem.path}
                                onClick={() => {
                                    setActiveItem(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors" />
                                {subItem.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-rose-50/30 font-['Inter',sans-serif]">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out w-80 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 via-rose-500 to-purple-500" />

                <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-linear-to-br from-orange-500 via-rose-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <UtensilsCrossed className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Eatwana</h1>
                            <p className="text-xs text-gray-500 font-medium">Restaurant Admin</p>
                        </div>
                    </div>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search and Menu */}
                <div className="px-4 py-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 h-[calc(100vh-12rem)] custom-scrollbar">
                    <div className="space-y-1 pb-4">
                        {menuItems.map((item) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="lg:ml-80">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm flex items-center justify-between px-6">
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-orange-600 p-2 rounded-lg transition-all">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:block flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search dishes, orders, customers..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                    </div>

                    <button className="relative p-2.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                        <Bell className="w-6 h-6" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-orange-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                {notifications}
                            </span>
                        )}
                    </button>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
};

export default Sidebar;
