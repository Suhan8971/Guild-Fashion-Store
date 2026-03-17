import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const GoogleLoginButton = ({ setUser, setError }) => {
    const navigate = useNavigate();
    const { fetchCart } = useCart();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // tokenResponse contains access_token
                const res = await api.post('/auth/google/', {
                    access_token: tokenResponse.access_token,
                });

                const { key, ...userData } = res.data; // dj-rest-auth returns 'key' as token usually, sometimes 'token'

                // Let's check what Login.jsx expects. It expects 'token'.
                // dj-rest-auth returns 'key' by default. Login.jsx uses 'token'. 
                // I should standardize. If backend returns 'key', I should map it to 'token'.
                // If I am not sure, I can inspect response or just handle both.

                const authToken = key || res.data.token;

                if (!authToken) {
                    throw new Error("No token received from backend");
                }

                localStorage.setItem('token', authToken);
                // We might need to fetch user details if not returned fully. 
                // dj-rest-auth usually returns key. If we want user details we might need 'UserDetailsSerializer'.
                // But let's assume it returns user data too or we fetch it.

                // If the response doesn't have user data, we might need to fetch it:
                if (!userData.user && !userData.email) {
                    // fetch user
                    const userRes = await api.get('/auth/user/');
                    localStorage.setItem('user', JSON.stringify(userRes.data));
                    setUser(userRes.data);
                } else {
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                }

                await fetchCart();
                navigate('/');
            } catch (err) {
                console.error('Google login error:', err);
                setError('Google login failed. Please try again.');
            }
        },
        onError: () => {
            setError('Google Login Failed');
        },
    });

    return (
        <button
            onClick={() => login()}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-300 mb-4"
        >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-3"
            />
            Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;
