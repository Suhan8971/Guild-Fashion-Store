import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SuhanAdminLogin = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Super Admin Session State
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [users, setUsers] = useState([]);

    // Form States for Management
    const [showForm, setShowForm] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' });

    const SUPER_ADMIN_EMAIL = 'suhankaminofficial@gmail.com';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (username !== SUPER_ADMIN_EMAIL) {
            setError('Access Denied: Restricted to Super Administrator only.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/login/', { username, password });
            const userData = res.data;

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            setIsSuperAdmin(true);
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError('Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/superadmin/users/');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load user data. Verify permissions.');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editUserId) {
                await api.patch(`/superadmin/users/${editUserId}/`, formData);
            } else {
                await api.post('/superadmin/users/', formData);
            }
            setShowForm(false);
            setEditUserId(null);
            setFormData({ email: '', password: '', role: 'admin' });
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to save user.');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to revoke access and delete this account?")) {
            try {
                await api.delete(`/superadmin/users/${userId}/`);
                fetchUsers();
            } catch (err) {
                console.error(err);
                setError('Failed to disable account.');
            }
        }
    };

    const openEdit = (user) => {
        setEditUserId(user.id);
        setFormData({ email: user.email, password: user.plain_password || '', role: user.role });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsSuperAdmin(false);
        setUsername('');
        setPassword('');
    };

    if (isSuperAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow">
                        <div>
                            <h1 className="text-3xl font-extrabold text-guild-black">Super Admin Control Panel</h1>
                            <p className="text-gray-500 mt-1">Manage all Admin and Developer accounts.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-guild-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            Sign Out
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                            <button onClick={() => setError('')} className="float-right font-bold">&times;</button>
                        </div>
                    )}

                    {showForm ? (
                        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
                            <h2 className="text-xl font-bold mb-4 border-b pb-2">{editUserId ? 'Edit Account' : 'Create New Account'}</h2>
                            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-guild-red focus:ring-guild-red sm:text-sm p-2 border"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password (Overrides instantly)</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-guild-red focus:ring-guild-red sm:text-sm p-2 border"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                {!editUserId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-guild-red focus:ring-guild-red sm:text-sm p-2 border"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="admin">Admin (Store Owner)</option>
                                            <option value="developer">Developer</option>
                                        </select>
                                    </div>
                                )}
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="bg-guild-red text-white px-6 py-2 rounded hover:bg-red-800 transition">
                                        {editUserId ? 'Save Changes' : 'Create Account'}
                                    </button>
                                    <button type="button" onClick={() => { setShowForm(false); setEditUserId(null); }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <button
                                onClick={() => { setFormData({ email: '', password: '', role: 'admin' }); setShowForm(true); }}
                                className="bg-guild-red text-white px-4 py-2 rounded hover:bg-red-800 transition shadow-sm font-medium"
                            >
                                + Add New User
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plain Text Password</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.filter(u => u.email !== SUPER_ADMIN_EMAIL).map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'developer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono bg-gray-50">
                                            {user.plain_password || <span className="text-gray-400 italic">Encrypted Only</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit / Reset</button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-bold">Revoke</button>
                                        </td>
                                    </tr>
                                ))}
                                {users.filter(u => u.email !== SUPER_ADMIN_EMAIL).length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No additional admin or developer accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Default Login View
    return (
        <div className="min-h-screen flex items-center justify-center bg-guild-black px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-guild-black">
                        Super Admin Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Top-Level Authority Gateway
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-guild-red focus:border-guild-red focus:z-10 sm:text-sm"
                                placeholder="Super Admin Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-guild-red focus:border-guild-red focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-guild-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guild-black transition-colors"
                        >
                            {loading ? 'Verifying...' : 'Authorize'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuhanAdminLogin;
