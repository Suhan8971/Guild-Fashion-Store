import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BurntPaperLayout from '../components/BurntPaperLayout';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(0); // Open first FAQ by default
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Store & Location', 'Shipping & Delivery', 'Quality & Proof', 'Returns & Refunds', 'Payments'];

    const faqData = [
        {
            category: "Store & Location",
            question: "Where is Guild Fashion Store physically located?",
            answer: "We are located at 1st Floor, Star Plaza Building, Opposite Sarvajanika Ganapathi Katte, Kinnigoli, Karnataka, India (Pin Code: 574150). You can easily find us on Google Maps!"
        },
        {
            category: "Quality & Proof",
            question: "What is the Pre-Shipment Proof system?",
            answer: "To guarantee absolute quality and condition transparency, our packaging team photographs your exact ordered apparel right before sealing the package. You can view these high-resolution proof photos directly inside your account's 'Order Details' page!"
        },
        {
            category: "Shipping & Delivery",
            question: "How long does order processing and shipping take?",
            answer: "All domestic orders are processed within 1-3 business days. Courier delivery generally takes 3 to 7 business days depending on your location across India. You will receive active tracking updates via SMS and email."
        },
        {
            category: "Returns & Refunds",
            question: "What is your return policy and how do I request one?",
            answer: "We offer a 7-day hassle-free return policy for unused, unwashed garments with original tags intact. Simply navigate to 'Order History' in your account, select the item, and click 'Request Return' to start."
        },
        {
            category: "Payments",
            question: "What online payment methods do you accept?",
            answer: "We accept all major Credit Cards, Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Razorpay secure checkout. All payment data is processed using 256-bit SSL encryption."
        },
        {
            category: "Shipping & Delivery",
            question: "How do I track my active order status?",
            answer: "Once logged into your account, visit the 'Order History' section. You can view real-time courier tracking numbers, live location dispatch status, and Pre-Shipment Proof photos."
        },
        {
            category: "Store & Location",
            question: "What are your Kinnigoli store opening hours?",
            answer: "Our physical showroom in Kinnigoli is open every day from 9:30 AM to 8:30 PM. Feel free to visit us for personalized styling advice and custom fitting!"
        },
        {
            category: "Returns & Refunds",
            question: "Are there any items exempt from returns?",
            answer: "For hygiene and health safety, innerwear, socks, custom-tailored apparel, and final clearance sale items are exempt from returns unless received damaged or incorrect."
        }
    ];

    // Filter FAQs based on active category and search query
    const filteredFaqs = faqData.filter(faq => {
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <BurntPaperLayout
            title="Frequently Asked Questions"
            subtitle="Find quick answers to common questions about our clothing collections, shipping, quality proofs, and returns."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
        >
            <div className="space-y-8">

                {/* Search Bar & Category Filter Bar */}
                <div className="space-y-4">
                    {/* Live Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions (e.g. shipping, returns, proof, location)..."
                            className="w-full bg-white/90 border-2 border-amber-900/30 text-amber-950 placeholder-amber-900/50 rounded-2xl px-5 py-3.5 pl-12 text-sm sm:text-base focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/30 transition-all shadow-md"
                        />
                        <svg className="w-5 h-5 text-amber-800 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-1 rounded-md hover:bg-amber-300 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                                    activeCategory === cat
                                        ? 'bg-amber-950 text-amber-300 shadow-md border border-amber-700/50 scale-[1.02]'
                                        : 'bg-white/70 text-amber-950 hover:bg-amber-100 border border-amber-900/20'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accordion Questions List */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white/90 border-2 border-amber-900/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                <button
                                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 focus:outline-none bg-white hover:bg-amber-50/50 transition-colors group cursor-pointer"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-950/10 text-amber-950 border border-amber-900/20 shrink-0">
                                            {faq.category}
                                        </span>
                                        <h3 className="text-base sm:text-lg font-bold text-amber-950 group-hover:text-amber-800 transition-colors font-serif">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <span className="w-8 h-8 rounded-full bg-amber-950/10 text-amber-950 flex items-center justify-center font-bold text-lg shrink-0 transition-transform duration-300">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 sm:p-6 bg-amber-950/5 border-t border-amber-900/15 text-stone-800 leading-relaxed text-sm sm:text-base">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white/70 rounded-2xl border border-amber-900/20 p-8 space-y-3">
                            <p className="text-lg font-bold text-amber-950 font-serif">No questions found matching &quot;{searchQuery}&quot;</p>
                            <p className="text-xs text-amber-900/70">Try searching for keywords like &quot;shipping&quot;, &quot;returns&quot;, or &quot;location&quot;.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                className="inline-block text-xs font-bold text-amber-950 bg-amber-200 px-4 py-2 rounded-full hover:bg-amber-300 transition-colors mt-2"
                            >
                                Reset Search Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Box */}
                <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-700/40">
                    <div>
                        <h3 className="text-xl font-black text-amber-400 font-serif">Still have questions?</h3>
                        <p className="text-xs sm:text-sm text-stone-300 mt-1">Our support team at Kinnigoli is always here to assist you.</p>
                    </div>
                    <a
                        href="mailto:fashionstoreguild@gmail.com"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0"
                    >
                        <span>Send an Email</span>
                    </a>
                </div>

            </div>
        </BurntPaperLayout>
    );
};

export default FAQs;
