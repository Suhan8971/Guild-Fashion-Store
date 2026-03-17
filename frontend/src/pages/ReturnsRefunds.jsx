import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ReturnsRefunds = () => {
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
                        Returns & Refunds
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                    <p>
                        At <strong className="text-guild-black">Guild Fashion Store</strong>, your complete satisfaction is our goal. If you are not entirely satisfied with your purchase, we&apos;re here to help.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">1. Returns</h2>
                    <p>
                        You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. Your item must be in the original packaging, including all original tags attached.
                    </p>
                    <p>
                        We highly recommend that you review the Pre-Shipment Proof photos on your Order Details page before initiating a claim regarding defects.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">2. Refunds</h2>
                    <p>
                        Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                    </p>
                    <p>
                        If your return is approved, we will initiate a refund to your original method of payment (e.g., credit card, Razorpay). You will receive the credit within a certain amount of days, depending on your card issuer&apos;s policies.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">3. Non-Returnable Items</h2>
                    <p>
                        Several types of goods are exempt from being returned due to hygiene and safety reasons. Examples include innerwear, socks, and customized apparel. Sale items are also generally final sale, unless specified otherwise.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">4. Shipping for Returns</h2>
                    <p>
                        You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund. If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">5. How to Initiate a Return</h2>
                    <p>
                        You can easily initiate a return right from your account dashboard. Navigate to &quot;Order History&quot;, select the specific order, and click the &quot;Request Return&quot; button. Follow the on-screen instructions to select the return reason and submit your request.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">Contact Us</h2>
                    <p>
                        If you have any questions on how to return your item to us, contact us at: <br />
                        <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ReturnsRefunds;
