import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useModal } from '../context/ModalContext';

const ResetPassword = () => {
    // Expected to be accessed via /reset-password/:uid/:token
    const { uid, token } = useParams();

    const [passwords, setPasswords] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { showModal } = useModal();

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (passwords.new_password !== passwords.confirm_password) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // dj-rest-auth is mounted at /auth/ at the project level, not /api/auth/
            const resetConfirmUrl = api.defaults.baseURL.replace('/api', '') + '/auth/password/reset/confirm/';
            await api.post(resetConfirmUrl, {
                uid,
                token,
                new_password1: passwords.new_password, // dj-rest-auth requires new_password1
                new_password2: passwords.confirm_password // dj-rest-auth uses new_password2 usually
            });
            showModal({
                title: 'Password Reset',
                message: 'Your password has been successfully reset. You can now log in.',
                type: 'success',
                confirmText: 'Go to Login',
                onConfirm: () => navigate('/login')
            });
        } catch (err) {
            console.error('Password reset confirm error:', err);
            let errMsg = 'Failed to reset password. The link may have expired.';
            if (err.response?.data) {
                if (err.response.data.detail) errMsg = err.response.data.detail;
                else if (typeof err.response.data === 'object') {
                    // Try to extract first error value
                    const firstKey = Object.keys(err.response.data)[0];
                    if (Array.isArray(err.response.data[firstKey])) {
                        errMsg = err.response.data[firstKey][0];
                    }
                }
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-guild-red">Reset Password</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="new_password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red pr-10"
                            value={passwords.new_password}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-guild-red pr-10"
                            value={passwords.confirm_password}
                            onChange={handleChange}
                            required
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !passwords.new_password}
                    className="w-full bg-guild-red text-white py-2 rounded-lg hover:bg-red-800 transition duration-300 font-bold disabled:opacity-50"
                >
                    {loading ? 'Resetting...' : 'Set New Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
