import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import AuthTabs from '../components/AuthTabs';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchCart, syncGuestCart } = useCart();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login/', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            
            // Sync any items added as a guest to the server cart
            await syncGuestCart();

            // Redirect back to intended destination (e.g. /checkout) if available
            const redirectTo = location.state?.from || '/';
            navigate(redirectTo, { state: location.state });
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md my-6 sm:my-8">
            <AuthTabs activeTab="login" />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <GoogleLoginButton setUser={setUser} setError={setError} />

            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs sm:text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-gray-700 text-sm font-medium">Password</label>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-xs text-gray-500 hover:text-guild-red transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-guild-red text-white py-2.5 rounded-lg hover:bg-red-800 transition duration-300 font-bold text-sm sm:text-base shadow-sm"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
