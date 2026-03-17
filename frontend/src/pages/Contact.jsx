import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    return (
        <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
            <div className="bg-guild-black flex items-center justify-center relative overflow-hidden py-12 px-6 rounded-2xl w-full max-w-md shadow-2xl border border-white/5">
                {/* Background Decorative Elements for Glassmorphism effect */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 rounded-2xl">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-sm transition-all z-20"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-guild-red opacity-10 blur-[100px]"></div>
                    <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] rounded-full bg-red-900 opacity-20 blur-[120px]"></div>
                    <div className="absolute bottom-[0%] right-[20%] w-[30%] h-[30%] rounded-full bg-gray-600 opacity-10 blur-[80px]"></div>
                </div>

                <div className="container mx-auto px-4 z-10">
                    <div className="max-w-md mx-auto relative">

                        {/* Header Details */}
                        <div className="text-center mb-8">

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                                Get in Touch
                            </h1>

                            <p className="text-gray-400 text-sm md:text-base">
                                Have a question or need assistance? Fill out the form below.
                            </p>
                        </div>

                        {/* Glassmorphism Form Container */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative">
                            {/* Close Button */}


                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

                                {/* Name Field */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Query Field */}
                                <div className="space-y-1">
                                    <label htmlFor="query" className="block text-sm font-medium text-gray-300">Your Message</label>
                                    <textarea
                                        id="query"
                                        name="query"
                                        required
                                        rows="3"
                                        value={formData.query}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent transition-all resize-none"
                                        placeholder="How can we help you today?"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-guild-red hover:bg-red-800 text-white font-semibold py-3 mt-2 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed transform-none hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}`}
                                >
                                    {loading ? 'Sending Message...' : 'Send Message'}
                                </button>

                            </form>
                        </div>

                        {/* Alternative Contact Info directly below the form */}
                        <div className="text-center mt-8 text-gray-500 text-sm">
                            <p>Prefer to email us directly? Reach out at <a href="mailto:fashionstoreguild@gmail.com" className="text-guild-red hover:underline">fashionstoreguild@gmail.com</a></p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default Contact;
