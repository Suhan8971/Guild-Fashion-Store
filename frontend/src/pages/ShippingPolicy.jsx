import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ShippingPolicy = () => {
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
                        Shipping Policy
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                    <p>
                        Thank you for visiting and shopping at <strong className="text-guild-black">Guild Fashion Store</strong>. Following are the terms and conditions that constitute our Shipping Policy.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">1. Domestic Shipping Policy</h2>
                    <h3 className="text-xl font-semibold text-gray-800 mt-4">Shipment processing time</h3>
                    <p>
                        All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">Shipping rates & delivery estimates</h3>
                    <p>
                        Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur specifically during major holidays or local events.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">2. Shipment Confirmation & Order Tracking</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours. You can track your order directly from the &apos;Order History&apos; section of your account.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">3. Customs, Duties, and Taxes</h2>
                    <p>
                        Guild Fashion Store is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">4. Damages</h2>
                    <p>
                        Guild Fashion Store works exclusively with trusted logistics partners. We maintain a mandatory Pre-Shipment Proof system where our team documents the flawless condition of your items before dispatch. If you received your order damaged during transit, please save all packaging materials and damaged goods before filing a claim and contact us immediately so we can assist you.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">Contact Us</h2>
                    <p>
                        If you have any further questions about your order&apos;s shipping status, do not hesitate to contact us at: <br />
                        <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
