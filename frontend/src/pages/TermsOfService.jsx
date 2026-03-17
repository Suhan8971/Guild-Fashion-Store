import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-guild-cream py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8 mt-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-guild-black hover:text-gray-600 transition-colors mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-guild-black tracking-tight uppercase border-b-2 border-gray-100 pb-6">
                        Terms of Service
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                    <p>
                        Welcome to <strong className="text-guild-black">Guild Fashion Store</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Guild Fashion Store if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">1. License</h2>
                    <p>
                        Unless otherwise stated, Guild Fashion Store and/or its licensors own the intellectual property rights for all material on Guild Fashion Store. All intellectual property rights are reserved. You may access this from Guild Fashion Store for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">2. User Accounts</h2>
                    <p>
                        To access certain features of the website, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and maintain the security of your password and identification. Guild Fashion Store holds the right to terminate accounts that violate our policies or community standards.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">3. Purchases and Payment</h2>
                    <p>
                        All purchases made through our website are subject to product availability. We reserve the right to refuse or cancel any order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, or an error in your order.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">4. Modifications to the Service and Prices</h2>
                    <p>
                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">5. Limitation of Liability</h2>
                    <p>
                        In no event shall Guild Fashion Store, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. Guild Fashion Store, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">Contact Us</h2>
                    <p>
                        If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at: <br />
                        <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
