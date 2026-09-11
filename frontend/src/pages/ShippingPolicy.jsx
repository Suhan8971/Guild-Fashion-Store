import React from 'react';
import { motion } from 'framer-motion';
import BurntPaperLayout from '../components/BurntPaperLayout';

const ShippingPolicy = () => {
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <BurntPaperLayout
            title="Shipping Policy"
            subtitle="Fast, transparent, and secure dispatch for every apparel order across India."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
        >
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-10">

                {/* Introduction Callout */}
                <motion.div variants={fadeUp} className="bg-amber-950/5 p-6 rounded-2xl border border-amber-900/20 leading-relaxed text-stone-800 text-base sm:text-lg">
                    Thank you for choosing <strong className="text-amber-950 font-bold">Guild Fashion Store</strong>. We take immense pride in ensuring every package is meticulously inspected, carefully packaged, and dispatched through top-tier courier services.
                </motion.div>

                {/* Dispatch Roadmap Timeline */}
                <motion.div variants={fadeUp} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-serif tracking-tight flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                        Order Dispatch Roadmap
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        {/* Step 1 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-200/60 px-2.5 py-1 rounded-md">Step 01</span>
                                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-950 text-base">Order Placed</h3>
                                <p className="text-xs text-amber-900/80 mt-1">Instant confirmation & verification sent via SMS & Email.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-200/60 px-2.5 py-1 rounded-md">Step 02</span>
                                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-950 text-base">Quality Check</h3>
                                <p className="text-xs text-amber-900/80 mt-1">Pre-shipment inspection proof logged for flawless quality.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-200/60 px-2.5 py-1 rounded-md">Step 03</span>
                                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-950 text-base">Express Dispatch</h3>
                                <p className="text-xs text-amber-900/80 mt-1">Processed within 1-3 business days & tracking assigned.</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs flex flex-col justify-between space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-200/60 px-2.5 py-1 rounded-md">Step 04</span>
                                <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-950 text-base">Safe Delivery</h3>
                                <p className="text-xs text-amber-900/80 mt-1">Doorstep handover with live OTP/Sign verification.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Policy Clauses Grid */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Clause 1 */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center font-bold">1</div>
                            <h3 className="text-lg font-bold text-amber-950">Shipment Processing Time</h3>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            All orders are processed within <strong>1-3 business days</strong>. Orders are not shipped or delivered on Sundays or national holidays. During peak festive seasons, kindly allow 1 additional day for transit.
                        </p>
                    </div>

                    {/* Clause 2 */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center font-bold">2</div>
                            <h3 className="text-lg font-bold text-amber-950">Rates &amp; Live Tracking</h3>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Shipping charges are calculated transparently at checkout based on weight and location. You will receive a Shipment Confirmation email with active tracking numbers within 24 hours of dispatch.
                        </p>
                    </div>

                    {/* Clause 3 */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center font-bold">3</div>
                            <h3 className="text-lg font-bold text-amber-950">Customs, Duties &amp; Taxes</h3>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Guild Fashion Store is not responsible for extra local state entry taxes or tariffs applied to your order. All mandatory GST charges are clearly itemized on your official tax invoice.
                        </p>
                    </div>

                    {/* Clause 4 */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center font-bold">4</div>
                            <h3 className="text-lg font-bold text-amber-950">Pre-Shipment Proof &amp; Damages</h3>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Every garment undergoes mandatory Pre-Shipment Proof photography. If your package arrives damaged, please retain all original packaging materials and contact us immediately for assistance.
                        </p>
                    </div>

                </motion.div>

                {/* Support Contact Box */}
                <motion.div variants={fadeUp} className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-700/40">
                    <div>
                        <h3 className="text-xl font-black text-amber-400 font-serif">Have questions regarding your shipment?</h3>
                        <p className="text-xs sm:text-sm text-stone-300 mt-1">Our support team in Kinnigoli is ready to assist you anytime.</p>
                    </div>
                    <a
                        href="mailto:fashionstoreguild@gmail.com"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Contact Support</span>
                    </a>
                </motion.div>

            </motion.div>
        </BurntPaperLayout>
    );
};

export default ShippingPolicy;
