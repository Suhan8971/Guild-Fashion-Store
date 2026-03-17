import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        Privacy Policy
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                    <p>
                        Welcome to <strong className="text-guild-black">Guild Fashion Store</strong>. Your privacy is critically important to us. This Privacy Policy outlines the types of personal information that is received and collected by our store and how it is used.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">1. Information We Collect</h2>
                    <p>
                        We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, and payment information.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">2. How We Use Collected Information</h2>
                    <p>
                        Guild Fashion Store may collect and use Users&apos; personal information for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>To improve customer service:</strong> Information you provide helps us respond to your customer service requests and support needs more efficiently.</li>
                        <li><strong>To personalize user experience:</strong> We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
                        <li><strong>To process payments:</strong> We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</li>
                        <li><strong>To send periodic emails:</strong> We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">3. How We Protect Your Information</h2>
                    <p>
                        We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">4. Sharing Your Personal Information</h2>
                    <p>
                        We do not sell, trade, or rent Users&apos; personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">5. Changes to This Privacy Policy</h2>
                    <p>
                        Guild Fashion Store has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">6. Contacting Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: <br />
                        <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
