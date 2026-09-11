import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BurntPaperLayout from '../components/BurntPaperLayout';

const ReturnsRefunds = () => {
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
            title="Returns & Refunds"
            subtitle="Hassle-free 7-day return policy to ensure complete peace of mind with your fashion purchases."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H3m0 0l3-3m-3 3l3 3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
            }
        >
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-10">

                {/* Introduction Box */}
                <motion.div variants={fadeUp} className="bg-amber-950/5 p-6 rounded-2xl border border-amber-900/20 leading-relaxed text-stone-800 text-base sm:text-lg">
                    At <strong className="text-amber-950 font-bold">Guild Fashion Store</strong>, customer happiness is our topmost priority. If your garment does not fit perfectly or meet your expectations, we offer a seamless 7-day return policy.
                </motion.div>

                {/* 4-Step Return Workflow Visual */}
                <motion.div variants={fadeUp} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-serif tracking-tight flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                            4-Step Simple Return Process
                        </h2>
                        <Link
                            to="/orders"
                            className="inline-flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-3.5 py-1.5 rounded-full transition-all border border-amber-900/30 w-fit"
                        >
                            <span>Go to Order History</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l7-7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                        {/* Step 1 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">1</div>
                            <h3 className="font-bold text-amber-950 text-base">Check 7-Day Window</h3>
                            <p className="text-xs text-amber-900/80">Ensure item is unused, unwashed, with tags intact within 7 calendar days.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">2</div>
                            <h3 className="font-bold text-amber-950 text-base">Click Request Return</h3>
                            <p className="text-xs text-amber-900/80">Go to your account Order History &amp; submit a return request online.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">3</div>
                            <h3 className="font-bold text-amber-950 text-base">Pack &amp; Pickup</h3>
                            <p className="text-xs text-amber-900/80">Pack item securely in original packaging for courier reverse pickup.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white/70 p-5 rounded-2xl border border-amber-900/20 shadow-xs space-y-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">4</div>
                            <h3 className="font-bold text-amber-950 text-base">Receive Refund</h3>
                            <p className="text-xs text-amber-900/80">Inspected upon arrival &amp; refund credited to original payment source.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Policy Clauses Grid */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Return Eligibility */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Return Eligibility</span>
                        </h3>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Garments must be in pristine original condition, unwashed, unworn, and with all original brand tags firmly attached. We recommend reviewing Pre-Shipment Proof photos on your Order Details page.
                        </p>
                    </div>

                    {/* Refund Method */}
                    <div className="bg-white/80 p-6 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Refund Method &amp; Timeline</span>
                        </h3>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Once received and inspected, approved refunds are credited back to your original payment method (Razorpay / Credit Card / UPI). Banking timelines typically take 3 to 7 business days.
                        </p>
                    </div>

                </motion.div>

                {/* Non-Returnable Items Section */}
                <motion.div variants={fadeUp} className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 space-y-4">
                    <h3 className="text-xl font-bold text-amber-950 font-serif flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Non-Returnable Items</span>
                    </h3>
                    <p className="text-sm text-stone-700">For health, hygiene, and safety reasons, the following items cannot be returned:</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        <span className="bg-red-50 text-red-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200">Innerwear &amp; Socks</span>
                        <span className="bg-red-50 text-red-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200">Customized Tailored Apparel</span>
                        <span className="bg-red-50 text-red-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200">Final Clearance Sale Items</span>
                        <span className="bg-red-50 text-red-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200">Items missing original tags</span>
                    </div>
                </motion.div>

                {/* Return Shipping Note */}
                <motion.div variants={fadeUp} className="bg-amber-950/5 p-6 rounded-2xl border border-amber-900/20 text-sm text-stone-800 leading-relaxed">
                    <strong>Note on Return Shipping:</strong> You will be responsible for paying return shipping fees unless the return is due to an error on our part (e.g. wrong item sent). Return shipping fees are deducted from the final refund amount.
                </motion.div>

            </motion.div>
        </BurntPaperLayout>
    );
};

export default ReturnsRefunds;
