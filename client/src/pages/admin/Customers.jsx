import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, UserX, UserCheck, Edit2, Users } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { RippleLoader } from '../../ui/Loader';

// Mock data - replace with actual API data
const mockUsers = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 234-567-8901',
        address: '123 Main St, New York, NY',
        profilePic: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
        role: 'user',
        planType: 'monthly',
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-11-10'
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1 234-567-8902',
        address: '456 Oak Ave, Los Angeles, CA',
        profilePic: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
        role: 'admin',
        planType: 'yearly',
        isActive: true,
        createdAt: '2024-02-20',
        updatedAt: '2024-11-12'
    },
    {
        id: 3,
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        phone: '+1 234-567-8903',
        address: '789 Pine Rd, Chicago, IL',
        profilePic: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899&color=fff',
        role: 'delivery',
        planType: 'daily',
        isActive: true,
        createdAt: '2024-03-10',
        updatedAt: '2024-11-14'
    },
    {
        id: 4,
        name: 'James Brown',
        email: 'james.b@example.com',
        phone: '+1 234-567-8904',
        address: '321 Elm St, Houston, TX',
        profilePic: 'https://ui-avatars.com/api/?name=James+Brown&background=f59e0b&color=fff',
        role: 'user',
        planType: 'weekly',
        isActive: false,
        createdAt: '2024-04-05',
        updatedAt: '2024-10-20'
    },
    {
        id: 5,
        name: 'Olivia Martinez',
        email: 'olivia.m@example.com',
        phone: '+1 234-567-8905',
        address: '654 Maple Dr, Phoenix, AZ',
        profilePic: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=8b5cf6&color=fff',
        role: 'user',
        planType: 'monthly',
        isActive: true,
        createdAt: '2024-05-18',
        updatedAt: '2024-11-13'
    },
    {
        id: 6,
        name: 'David Lee',
        email: 'david.lee@example.com',
        phone: '+1 234-567-8906',
        address: '987 Cedar Ln, Philadelphia, PA',
        profilePic: 'https://ui-avatars.com/api/?name=David+Lee&background=3b82f6&color=fff',
        role: 'delivery',
        planType: 'none',
        isActive: true,
        createdAt: '2024-06-22',
        updatedAt: '2024-11-11'
    },
    {
        id: 7,
        name: 'Sophia Anderson',
        email: 'sophia.a@example.com',
        phone: '+1 234-567-8907',
        address: '147 Birch Blvd, San Antonio, TX',
        profilePic: 'https://ui-avatars.com/api/?name=Sophia+Anderson&background=ef4444&color=fff',
        role: 'user',
        planType: 'yearly',
        isActive: true,
        createdAt: '2024-07-30',
        updatedAt: '2024-11-15'
    },
    {
        id: 8,
        name: 'Daniel Garcia',
        email: 'daniel.g@example.com',
        phone: '+1 234-567-8908',
        address: '258 Willow Way, San Diego, CA',
        profilePic: 'https://ui-avatars.com/api/?name=Daniel+Garcia&background=14b8a6&color=fff',
        role: 'admin',
        planType: 'yearly',
        isActive: true,
        createdAt: '2024-08-12',
        updatedAt: '2024-11-14'
    }
];

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState(mockUsers);
    const itemsPerPage = 5;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setLoading(true)
                const response = await axiosClient.get("/api/v1/auth/get/all")
                setUsers(response.data.users)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        fetchAllUsers()
    }, [])
    // Filter and search logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm);

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesPlan = planFilter === 'all' || user.planType === planFilter;
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && user.isActive) ||
                (statusFilter === 'inactive' && !user.isActive);

            return matchesSearch && matchesRole && matchesPlan && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, planFilter, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handleToggleStatus = (userId) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user
        ));
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'bg-primary/10 text-primary';
            case 'delivery': return 'bg-green-100 text-green-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getPlanBadgeClass = (plan) => {
        if (plan === 'none') return 'bg-gray-100 text-gray-600';
        return 'bg-purple-100 text-purple-700';
    };

    const getStatusBadgeClass = (isActive) => {
        return isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };
    if (loading) {
        return (
            <>
                <div className='flex items-center justify-center h-screen '>
                    <RippleLoader size={60} color='#e7582e' />
                </div>
            </>
        )
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                            <p className="text-third mt-1">View and manage all registered customers</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-third/20 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search Bar */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-third w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-full shadow-sm px-12 py-3 border border-third/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                        </div>

                        {/* Role Filter */}
                        {/* <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="rounded-full px-4 py-3 border border-third/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="delivery">Delivery</option>
                        </select> */}

                        {/* Plan Filter */}
                        {/* <select
                            value={planFilter}
                            onChange={(e) => setPlanFilter(e.target.value)}
                            className="rounded-full px-4 py-3 border border-third/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-white"
                        >
                            <option value="all">All Plans</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="none">None</option>
                        </select> */}
                    </div>

                    {/* Status Filter */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Status
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === 'active'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setStatusFilter('inactive')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${statusFilter === 'inactive'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Inactive
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-third/20 overflow-hidden">
                    {paginatedUsers.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-24 h-24 bg-third/10 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-12 h-12 text-third" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
                            <p className="text-third">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-third/20">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                                            {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-third/10">
                                        {paginatedUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-third/5 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={user.profilePic}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                                                        />
                                                        <span className="font-medium text-gray-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="text-gray-900">{user.email}</div>
                                                        <div className="text-third">{user.phone}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{user.address}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPlanBadgeClass(user.planType)}`}>
                                                        {user.planType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(user.isActive)}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition" title="View">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition" title="Edit">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id)}
                                                            className={`p-2 rounded-md text-white transition ${user.isActive
                                                                ? 'bg-red-500 hover:bg-red-600'
                                                                : 'bg-green-500 hover:bg-green-600'
                                                                }`}
                                                            title={user.isActive ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden divide-y divide-third/10">
                                {paginatedUsers.map((user) => (
                                    <div key={user.id} className="p-6 hover:bg-third/5 transition">
                                        <div className="flex items-start gap-4 mb-4">
                                            <img
                                                src={user.profilePic}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1">{user.name}</h3>
                                                <p className="text-sm text-gray-700 mb-1">{user.email}</p>
                                                <p className="text-sm text-third">{user.phone}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div>
                                                <span className="text-xs text-third block mb-1">Role</span>
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-third block mb-1">Plan</span>
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPlanBadgeClass(user.planType)}`}>
                                                    {user.planType}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-third block mb-1">Status</span>
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(user.isActive)}`}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-third block mb-1">Joined</span>
                                                <span className="text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-700 mb-4">
                                            <span className="text-third">Address: </span>{user.address}
                                        </div>

                                        {/* <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition text-sm font-medium">
                                                View
                                            </button>
                                            <button className="flex-1 px-3 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition text-sm font-medium">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user.id)}
                                                className={`flex-1 px-3 py-2 rounded-md text-white transition text-sm font-medium ${user.isActive
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div> */}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t border-third/20 px-6 py-4 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-third">
                                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} customers
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="rounded-full border border-third/20 px-4 py-2 hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            <div className="hidden sm:flex gap-2">
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentPage(index + 1)}
                                                        className={`w-10 h-10 rounded-full border transition ${currentPage === index + 1
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'border-third/20 hover:bg-primary hover:text-white'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="sm:hidden text-sm font-medium">
                                                Page {currentPage} of {totalPages}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="rounded-full border border-third/20 px-4 py-2 hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl p-4 border border-third/20">
                        <div className="text-third text-sm mb-1">Total Customers</div>
                        <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-third/20">
                        <div className="text-third text-sm mb-1">Active Users</div>
                        <div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-third/20">
                        <div className="text-third text-sm mb-1">Premium Plans</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {users.filter(u => ['monthly', 'yearly'].includes(u.planType)).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-third/20">
                        <div className="text-third text-sm mb-1">Delivery Staff</div>
                        <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'delivery').length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;