import React from 'react';
import { motion } from 'framer-motion';
import BurntPaperLayout from '../components/BurntPaperLayout';

const TermsOfService = () => {
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
            title="Terms of Service"
            subtitle="The legal guidelines and conditions governing your use of Guild Fashion Store."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            }
        >
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">

                {/* Preamble */}
                <motion.div variants={fadeUp} className="bg-amber-950/5 p-6 rounded-2xl border border-amber-900/20 leading-relaxed text-stone-800 text-base sm:text-lg">
                    Welcome to <strong className="text-amber-950 font-bold">Guild Fashion Store</strong>. By accessing this platform, browsing our catalog, or completing a purchase, you agree to be bound by these Terms of Service.
                </motion.div>

                {/* Section Cards */}
                <motion.div variants={fadeUp} className="space-y-6">

                    {/* Section 1 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">1</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Intellectual Property &amp; License</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Unless otherwise stated, Guild Fashion Store and its founders hold full intellectual property rights for all product designs, branding, logos, graphics, and digital media displayed on this website. Content may be accessed solely for personal, non-commercial shopping purposes.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">2</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">User Accounts &amp; Conduct</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            When creating an account, you agree to provide truthful and accurate information. You are responsible for safeguarding your login credentials. Guild Fashion Store reserves the right to terminate accounts involved in fraudulent activity or policy violations.
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">3</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Purchases, Pricing &amp; Stock Availability</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            All apparel pricing is displayed in Indian Rupees (INR) inclusive of applicable taxes unless stated otherwise. Prices and stock availability are subject to change without prior notice. We reserve the right to decline or cancel orders affected by technical pricing errors.
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">4</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Limitation of Liability</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Guild Fashion Store and its team shall not be held liable for indirect, incidental, or consequential damages resulting from the use or inability to use our services, beyond the purchase price of the item in question.
                        </p>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 shadow-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 font-extrabold flex items-center justify-center text-sm">5</span>
                            <h2 className="text-xl font-bold text-amber-950 font-serif">Governing Law</h2>
                        </div>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the jurisdiction of courts in Mangalore, Karnataka.
                        </p>
                    </div>

                </motion.div>

                {/* Contact Box */}
                <motion.div variants={fadeUp} className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-700/40">
                    <div>
                        <h3 className="text-xl font-black text-amber-400 font-serif">Questions about Terms of Service?</h3>
                        <p className="text-xs sm:text-sm text-stone-300 mt-1">Our support team is happy to answer any legal or policy questions.</p>
                    </div>
                    <a
                        href="mailto:fashionstoreguild@gmail.com"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0"
                    >
                        <span>Contact Legal Team</span>
                    </a>
                </motion.div>

            </motion.div>
        </BurntPaperLayout>
    );
};

export default TermsOfService;
