import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingCart,
    DollarSign,
    Package,
    Calendar,
    MessageSquare,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    IndianRupee,
    Truck,
    ChefHat
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axiosClient from '../../services/axiosClient';


// Mock Snackbar
const showSnackbar = (message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`);
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className="rounded-xl shadow-md border border-third/20 p-6 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <div className={`${color} h-1 rounded-full mt-3`}></div>
    </div>
);

// Order Status Badge
const OrderStatusBadge = ({ status, count }) => {
    const statusConfig = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
        order_confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
        preparing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Preparing' },
        dispatch: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Dispatch' },
        on_the_way: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'On The Way' },
        delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <div className={`${config.bg} ${config.text} px-4 py-3 rounded-lg flex items-center justify-between shadow-sm`}>
            <span className="font-semibold text-sm">{config.label}</span>
            <span className="font-bold text-lg">{count}</span>
        </div>
    );
};

// Monthly Orders Graph
const MonthlyOrdersGraph = ({ data }) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = data.map(item => ({
        month: monthNames[item.month - 1],
        orders: item.orders
    }));

    return (
        <div className="w-full rounded-xl bg-white shadow-md border border-third/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Orders Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e7582e',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#e7582e"
                        strokeWidth={3}
                        dot={{ fill: '#e7582e', r: 5 }}
                        activeDot={{ r: 7 }}
                        fill="rgba(231,88,46,0.2)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// Last 7 Days Revenue Graph
const Last7DaysRevenueGraph = ({ data }) => {
    const chartData = data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: item.revenue
    }));

    return (
        <div className="w-full rounded-xl bg-white shadow-md border border-third/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Past 7 Days Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e7582e',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => `₹${value}`}
                    />
                    <Bar dataKey="revenue" fill="#e7582e" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Dashboard Pie Chart
const DashboardPieChart = ({ data }) => {
    const COLORS = ['#e7582e', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];

    const chartData = Object.entries(data)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: value
        }));

    return (
        <div className="w-full rounded-xl bg-white shadow-md border border-third/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Orders by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// Recent Enquiries Table
const RecentEnquiriesTable = ({ enquiries }) => {
    if (enquiries.length === 0) {
        return (
            <div className="w-full rounded-xl bg-white shadow-md border border-third/20 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Enquiries</h3>
                <p className="text-gray-500 text-center py-8">📭 No recent enquiries</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl bg-white shadow-md border border-third/20 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Enquiries
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Message</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map((enquiry) => (
                            <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{enquiry.name}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{enquiry.email}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {enquiry.message.length > 50
                                        ? `${enquiry.message.substring(0, 50)}...`
                                        : enquiry.message}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {new Date(enquiry.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/dashboard/get');
            setDashboardData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Error while loading dashboard!');
            showSnackbar('Error while loading dashboard!', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-800 font-semibold text-xl">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { users, orders, subscriptions, items, enquiries, graphs } = dashboardData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Overview & Analytics</p>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={users.totalUsers}
                        color="bg-primary"
                        gradient="from-primary to-secondary"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Total Orders"
                        value={orders.totalOrders}
                        color="bg-secondary"
                        gradient="from-secondary to-third"
                    />
                    <StatCard
                        icon={IndianRupee}
                        label="Today's Revenue"
                        value={`₹${orders.todaysRevenue.toLocaleString()}`}
                        color="bg-green-500"
                        gradient="from-green-400 to-green-600"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Revenue"
                        value={`₹${orders.totalRevenue.toLocaleString()}`}
                        color="bg-blue-500"
                        gradient="from-blue-400 to-blue-600"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Active Subscriptions"
                        value={subscriptions.activeSubscriptions}
                        color="bg-purple-500"
                        gradient="from-purple-400 to-purple-600"
                    />
                    <StatCard
                        icon={Package}
                        label="Total Dishes"
                        value={items.totalDishes}
                        color="bg-orange-500"
                        gradient="from-orange-400 to-orange-600"
                    />
                    <StatCard
                        icon={ChefHat}
                        label="Total Tiffins"
                        value={items.totalTiffins}
                        color="bg-pink-500"
                        gradient="from-pink-400 to-pink-600"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Total Enquiries"
                        value={enquiries.totalEnquiries}
                        color="bg-indigo-500"
                        gradient="from-indigo-400 to-indigo-600"
                    />
                </div>

                {/* Orders Breakdown */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders Status Distribution</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {Object.entries(orders.ordersByStatus).map(([status, count]) => (
                            <OrderStatusBadge key={status} status={status} count={count} />
                        ))}
                    </div>
                </div>

                {/* Graphs Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <MonthlyOrdersGraph data={orders.monthlyOrders} />
                    <Last7DaysRevenueGraph data={graphs.last7daysRevenue} />
                </div>

                {/* Pie Chart */}
                <div className="mb-8">
                    <DashboardPieChart data={orders.ordersByStatus} />
                </div>

                {/* Recent Enquiries */}
                <RecentEnquiriesTable enquiries={enquiries.recent} />
            </div>
        </div>
    );
};

export default AdminDashboardPage;