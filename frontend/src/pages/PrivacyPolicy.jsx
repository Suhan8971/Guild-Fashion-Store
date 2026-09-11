import React from 'react';
import { motion } from 'framer-motion';
import BurntPaperLayout from '../components/BurntPaperLayout';

const PrivacyPolicy = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <BurntPaperLayout
            title="Privacy Policy"
            subtitle="How Guild Fashion Store collects, protects, and handles your personal information with uncompromising security."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            }
        >
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">

                {/* Preamble */}
                <motion.div variants={fadeUp} className="bg-amber-950/5 p-6 rounded-2xl border border-amber-900/20 leading-relaxed text-stone-800 text-base sm:text-lg">
                    Welcome to <strong className="text-amber-950 font-bold">Guild Fashion Store</strong>. Your privacy and trust are critically important to us. This Privacy Policy outlines the categories of personal data collected when you browse or make purchases from our store and explains the protocols protecting your data.
                </motion.div>

                {/* Section Cards */}
                <motion.div variants={fadeUp} className="space-y-6">

                    {/* Section 1 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">1</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Information We Collect</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            We collect personal information when you register an account, place orders, participate in promotional events, or contact customer service. Data collected includes your full name, shipping address, email address, phone number, and transaction records.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">2</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">How We Use Collected Information</h2>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-700">
                            <li className="bg-amber-950/5 p-3 rounded-xl border border-amber-900/10 flex items-start gap-2">
                                <span className="text-amber-700 font-bold">&bull;</span>
                                <span><strong>Order Fulfillments:</strong> Processing purchases, delivering apparel, and generating invoices.</span>
                            </li>
                            <li className="bg-amber-950/5 p-3 rounded-xl border border-amber-900/10 flex items-start gap-2">
                                <span className="text-amber-700 font-bold">&bull;</span>
                                <span><strong>Customer Support:</strong> Responding to order queries, size inquiries, and return requests.</span>
                            </li>
                            <li className="bg-amber-950/5 p-3 rounded-xl border border-amber-900/10 flex items-start gap-2">
                                <span className="text-amber-700 font-bold">&bull;</span>
                                <span><strong>Security &amp; Fraud Prevention:</strong> Protecting transactions against unauthorized access.</span>
                            </li>
                            <li className="bg-amber-950/5 p-3 rounded-xl border border-amber-900/10 flex items-start gap-2">
                                <span className="text-amber-700 font-bold">&bull;</span>
                                <span><strong>Updates &amp; Offers:</strong> Sending tracking notifications and exclusive fashion recommendations.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">3</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">How We Protect Your Information</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            We employ SSL/TLS encryption for all data transfers. Payment details are processed through encrypted, PCI-DSS compliant gateways (such as Razorpay). We never store raw payment credentials or card details on our servers.
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">4</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Sharing Your Personal Information</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            We strictly do <strong>not</strong> sell, rent, or trade your personal information. Data is shared exclusively with necessary operational partners (e.g. logistics providers for delivery and payment gateways for checkout).
                        </p>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">5</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Updates to This Policy</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Guild Fashion Store reserves the right to update this Privacy Policy as our services evolve. Any revisions will be reflected on this page with an updated timestamp.
                        </p>
                    </div>

                </motion.div>

                {/* Contact Box */}
                <motion.div variants={fadeUp} className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-700/40">
                    <div>
                        <h3 className="text-xl font-black text-amber-400 font-serif">Privacy Concerns or Data Requests?</h3>
                        <p className="text-xs sm:text-sm text-stone-300 mt-1">Contact our Data Protection desk anytime.</p>
                    </div>
                    <a
                        href="mailto:fashionstoreguild@gmail.com"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0"
                    >
                        <span>Email Privacy Team</span>
                    </a>
                </motion.div>

            </motion.div>
        </BurntPaperLayout>
    );
};

export default PrivacyPolicy;
