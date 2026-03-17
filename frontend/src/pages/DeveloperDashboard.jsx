import { useEffect, useState } from 'react';
import api from '../services/api';

const DeveloperDashboard = () => {
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        total_products: 0,
        low_stock_products: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats/');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Developer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                    <p className="text-3xl font-bold text-indigo-600">${stats.total_sales}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Products</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.total_products}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Low Stock</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.low_stock_products}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
                <h2 className="text-xl font-semibold mb-4">System Health</h2>
                <div className="flex items-center space-x-2 text-green-600">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>All Systems Operational</span>
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboard;
