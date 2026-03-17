import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useModal } from '../context/ModalContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { showModal } = useModal();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register/', formData);
            showModal({
                title: 'Registration Successful',
                message: 'Your account has been created! Please login.',
                type: 'success',
                confirmText: 'Login',
                onConfirm: () => navigate('/login')
            });
        } catch (err) {
            console.error('Registration error:', err);
            // Display clean error from backend if available
            let errMsg = 'Registration failed. Please try again.';
            if (err.response?.data) {
                if (err.response.data.error) {
                    errMsg = err.response.data.error;
                } else if (err.response.data.email) {
                    errMsg = err.response.data.email[0];
                } else if (err.response.data.username) {
                    errMsg = err.response.data.username[0];
                } else {
                    errMsg = JSON.stringify(err.response.data);
                }
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-guild-red">Register</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <GoogleLoginButton setUser={setUser} setError={setError} />

            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        name="username"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        onChange={handleChange}
                        value={formData.username}
                        required
                        placeholder="Choose a username"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        onChange={handleChange}
                        value={formData.email}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        placeholder="Create a password"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirm_password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        onChange={handleChange}
                        value={formData.confirm_password}
                        required
                        placeholder="Confirm your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-guild-red text-white py-2 rounded-lg hover:bg-red-800 transition duration-300 font-bold disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
