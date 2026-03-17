import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FAQs = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Where is Guild Fashion Store located?",
            answer: "We are physically located at 1st Floor, Star Plaza Building, Opposite Sarvajanika Ganapathi Katte, Kinnigoli, India (574150)."
        },
        {
            question: "How long does shipping take?",
            answer: "Domestic orders are typically processed within 1-3 business days. Delivery times vary based on your location but generally take between 3-7 business days after dispatch."
        },
        {
            question: "What is the Pre-Shipment Proof system?",
            answer: "To ensure absolute transparency and verify the perfect condition of your items, our team snaps photos of your products securely inside their packaging right before they're sealed and shipped. You can view these directly in your order's details dashboard!"
        },
        {
            question: "Do you accept returns?",
            answer: "Yes, we accept returns within 7 days of receiving your item, provided it is unused, unwashed, and in its original packaging with all tags attached. Please see our Returns & Refunds Policy for full terms."
        },
        {
            question: "How do I check my order status?",
            answer: "Simply log in to your account and click on 'Order History'. You'll see the current processing status of all past and active orders."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We currently accept all major credit and debit cards, as well as secure checkout via Razorpay online. Cash on delivery may occasionally be available for specific local ranges."
        }
    ];

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
                        Frequently Asked Questions
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg">
                    <p className="text-center text-justify pb-4">
                        Can&apos;t find the answer you&apos;re looking for? Reach out to our customer support team directly at <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>.
                    </p>

                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md bg-gray-50">
                                <button
                                    className="w-full p-4 md:p-6 text-left flex justify-between items-center focus:outline-none bg-white"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h3 className="text-lg font-semibold text-guild-black pr-4">{faq.question}</h3>
                                    <span className="text-guild-red text-2xl font-light transform transition-transform duration-300">
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
                                            <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 text-justify text-gray-700">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQs;
