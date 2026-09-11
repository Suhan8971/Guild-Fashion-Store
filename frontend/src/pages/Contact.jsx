import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contactAPI } from '../services/api';
import { useModal } from '../context/ModalContext';

const Contact = () => {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        query: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await contactAPI.submitQuery(formData);

            showModal({
                title: 'Message Sent!',
                message: 'Thank you for contacting us. Our team will get back to you shortly.',
                type: 'success'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                query: ''
            });
        } catch (error) {
            console.error("Failed to submit query:", error);
            showModal({
                title: 'Submission Failed',
                message: 'We encountered an error while sending your message. Please try again later.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Stagger container for form inputs
    const formStagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const fieldVariant = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
            <div className="bg-guild-black flex items-center justify-center relative overflow-hidden py-10 px-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/5">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 rounded-2xl pointer-events-none">
                    <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-guild-red opacity-15 blur-[100px]"></div>
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] rounded-full bg-red-900 opacity-20 blur-[120px]"></div>
                    <div className="absolute bottom-[0%] right-[20%] w-[30%] h-[30%] rounded-full bg-gray-600 opacity-10 blur-[80px]"></div>
                </div>

                <div className="container mx-auto px-4 z-10">
                    <div className="max-w-md mx-auto relative">

                        {/* Back to Shop Option before Get in Touch */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-4"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10 transition-all group backdrop-blur-md"
                                title="Return to shop page"
                            >
                                <svg className="w-4 h-4 text-guild-red group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Shop</span>
                            </Link>
                        </motion.div>

                        {/* Header Details with Animations */}
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
                                Get in Touch
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-gray-400 text-sm md:text-base font-medium"
                            >
                                Have a question or need assistance? Fill out the form below.
                            </motion.p>
                        </motion.div>

                        {/* Glassmorphism Form Container with Motion */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative"
                        >
                            <motion.form
                                variants={formStagger}
                                initial="hidden"
                                animate="visible"
                                onSubmit={handleSubmit}
                                className="space-y-4 md:space-y-5"
                            >

                                {/* Full Name Field */}
                                <motion.div variants={fieldVariant} className="space-y-1.5">
                                    <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-200">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent focus:scale-[1.01] transition-all duration-300"
                                        placeholder="Namith Salian"
                                    />
                                </motion.div>

                                {/* Phone Field */}
                                <motion.div variants={fieldVariant} className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-200">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent focus:scale-[1.01] transition-all duration-300"
                                        placeholder="+91 98765 43210"
                                    />
                                </motion.div>

                                {/* Email Field */}
                                <motion.div variants={fieldVariant} className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent focus:scale-[1.01] transition-all duration-300"
                                        placeholder="namithsalian@example.com"
                                    />
                                </motion.div>

                                {/* Query Field */}
                                <motion.div variants={fieldVariant} className="space-y-1.5">
                                    <label htmlFor="query" className="block text-xs sm:text-sm font-semibold text-gray-200">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="query"
                                        name="query"
                                        required
                                        rows="3"
                                        value={formData.query}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent focus:scale-[1.01] transition-all duration-300 resize-none"
                                        placeholder="How can we help you today?"
                                    ></textarea>
                                </motion.div>

                                {/* Animated Submit Button */}
                                <motion.div variants={fieldVariant} className="pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(239,68,68,0.5)" }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-gradient-to-r from-guild-red via-red-600 to-guild-red text-white font-bold py-3 rounded-xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Sending Message...' : 'Send Message'}
                                    </motion.button>
                                </motion.div>

                            </motion.form>
                        </motion.div>

                        {/* Alternative Contact Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-center mt-8 text-gray-400 text-sm font-medium"
                        >
                            <p>Prefer to email us directly? Reach out at <a href="mailto:fashionstoreguild@gmail.com" className="text-guild-red font-bold hover:underline">fashionstoreguild@gmail.com</a></p>
                        </motion.div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contact;
