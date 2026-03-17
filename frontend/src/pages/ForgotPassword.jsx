import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useModal } from '../context/ModalContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { showModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // dj-rest-auth is mounted at /auth/ at the project level, not /api/auth/
            const resetUrl = api.defaults.baseURL.replace('/api', '') + '/auth/password/reset/';
            await api.post(resetUrl, { email });
            showModal({
                title: 'Check your Email',
                message: 'If an account exists for this email, we have sent password reset instructions.',
                type: 'success',
                confirmText: 'Back to Login',
                onConfirm: () => navigate('/login')
            });
        } catch (err) {
            console.error(err);
            // We still show success to prevent email scraping
            showModal({
                title: 'Check your Email',
                message: 'If an account exists for this email, we have sent password reset instructions.',
                type: 'success',
                confirmText: 'Back to Login',
                onConfirm: () => navigate('/login')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-guild-red">Forgot Password</h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
                Enter your email address to receive a secure password reset link.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-guild-red text-white py-2 rounded-lg hover:bg-red-800 transition duration-300 font-bold disabled:opacity-50 mb-4"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
