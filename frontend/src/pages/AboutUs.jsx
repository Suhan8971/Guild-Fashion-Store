import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import suhanImg from '../Images/Suhan 1.png';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const slideLeft = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const slideRight = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const pulseSvg = {
        hover: { scale: 1.15, rotate: 5, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-guild-cream/20 to-white pb-24 pt-6 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">

                {/* Hero Section with Far-Left Back to Shop Button & Perfectly Centered Animated Title */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="pt-2 space-y-6"
                >
                    {/* Header Row: Far-Left Back to Shop & 100% Centered Animated Title */}
                    <div className="relative flex flex-col md:flex-row items-center justify-center w-full pb-6 border-b border-gray-200/60 min-h-[70px]">
                        {/* Far Left Back to Shop Button */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full md:w-auto md:absolute md:left-0 top-1/2 md:-translate-y-1/2 flex justify-start mb-4 md:mb-0 z-20 shrink-0"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-guild-red bg-white hover:bg-red-50/60 border border-gray-200 hover:border-guild-red/30 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all group shrink-0"
                                title="Return to Shop Store"
                            >
                                <svg className="w-4 h-4 text-guild-red group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back to Shop</span>
                            </Link>
                        </motion.div>

                        {/* Perfectly Centered Animated Title with Text Animations */}
                        <div className="w-full text-center px-2 sm:px-4 md:px-36">
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.92, y: -15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="text-3xl sm:text-5xl lg:text-6xl font-black text-guild-black tracking-tight uppercase text-center inline-block"
                            >
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="inline-block mr-2 sm:mr-3"
                                >
                                    About
                                </motion.span>
                                
                                <motion.span
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.7, delay: 0.25, type: "spring", stiffness: 120 }}
                                    className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-guild-red via-red-600 to-guild-black drop-shadow-sm font-black pb-1"
                                >
                                    Guild Store
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                                        className="absolute bottom-0 left-0 w-full h-[3px] sm:h-[4px] bg-gradient-to-r from-guild-red via-red-500 to-transparent rounded-full origin-left"
                                    />
                                </motion.span>
                            </motion.h1>
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-center leading-relaxed font-medium"
                    >
                        Crafting trend-forward fashion, premium comfort, and an effortless shopping experience for the modern individual.
                    </motion.p>
                </motion.div>

                {/* Key Highlights Bar with Animated SVG Icons */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 text-center"
                >
                    {/* Stat 1 */}
                    <motion.div whileHover="hover" variants={pulseSvg} className="p-4 border-r border-gray-100 last:border-0 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-guild-red flex items-center justify-center mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-guild-black">100%</p>
                        <p className="text-xs font-extrabold text-gray-500 uppercase mt-1 tracking-wider">Curated Quality</p>
                    </motion.div>

                    {/* Stat 2 */}
                    <motion.div whileHover="hover" variants={pulseSvg} className="p-4 md:border-r border-gray-100 last:border-0 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-guild-black">Trending</p>
                        <p className="text-xs font-extrabold text-gray-500 uppercase mt-1 tracking-wider">Modern Collections</p>
                    </motion.div>

                    {/* Stat 3 */}
                    <motion.div whileHover="hover" variants={pulseSvg} className="p-4 border-r border-gray-100 last:border-0 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-guild-black">Flagship</p>
                        <p className="text-xs font-extrabold text-gray-500 uppercase mt-1 tracking-wider">Fashion Studio</p>
                    </motion.div>

                    {/* Stat 4 */}
                    <motion.div whileHover="hover" variants={pulseSvg} className="p-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-guild-black">Seamless</p>
                        <p className="text-xs font-extrabold text-gray-500 uppercase mt-1 tracking-wider">Online &amp; Offline</p>
                    </motion.div>
                </motion.div>

                {/* Section 1: Store Story & Brand Identity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg"
                    >
                        <div className="inline-flex items-center gap-2 bg-guild-black text-white text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-sm">
                            <svg className="w-4 h-4 text-guild-red" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            <span>Our Essence</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-guild-black tracking-tight leading-tight">
                            Bringing Global Trends to Your Everyday Wardrobe
                        </h2>
                        <p>
                            <strong className="text-guild-black font-bold">Guild Fashion Store</strong> is a premier clothing destination situated in Kinnigoli, near Mangalore. We specialize in carefully curated collections that fuse contemporary fashion with effortless comfort, durability, and accessible pricing.
                        </p>
                        <p>
                            Our store offers a versatile range of apparel, including precision-tailored shirts, casual T-shirts, comfortable bottoms, and stylish shorts. Each piece is selected with attention to design, fabric fit, and contemporary aesthetic so our customers can express themselves with confidence.
                        </p>

                        {/* Interactive Feature SVG Chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                                <svg className="w-5 h-5 text-guild-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-bold text-gray-800">Premium Fabrics</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                                <svg className="w-5 h-5 text-guild-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-bold text-gray-800">Precision Fit</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                                <svg className="w-5 h-5 text-guild-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-bold text-gray-800">Modern Luxury</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="relative group"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-guild-red/30 to-guild-black/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                                alt="Guild Fashion Store Showroom"
                                className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                                <div>
                                    <span className="bg-guild-red text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                                        Flagship Experience
                                    </span>
                                    <h3 className="text-xl font-bold mt-2">Curated Fashion Destination</h3>
                                    <p className="text-xs text-gray-300 mt-1">Coastal Karnataka</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Section 2: Leadership & Core Team */}
                <div className="space-y-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                        className="text-center space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 bg-neutral-100 text-guild-black text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-lg border border-gray-200">
                            <svg className="w-4 h-4 text-guild-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Leadership Team</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-guild-black tracking-tight">
                            Meet the Minds Behind Guild
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                            The visionaries, creative strategists, and tech architects bringing Guild Fashion Store to life.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 lg:gap-12"
                    >
                        {/* 1. Founder & CEO Card */}
                        <motion.div variants={fadeUp} className="group">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative">
                                <div className="relative h-80 overflow-hidden bg-gray-100">
                                    <img
                                        src="/Namith.PNG"
                                        alt="Namith Salian - Founder & CEO"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-guild-black text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-guild-red animate-pulse"></span>
                                            Founder &amp; CEO
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-guild-black">Namith Salian</h3>
                                                <p className="text-xs font-extrabold text-guild-red uppercase tracking-wider mt-0.5">Founder &amp; Chief Executive</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-red-50 text-guild-red flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-3 font-medium">
                                            Founded Guild Fashion Store with a vision to make trend-forward, premium clothing easily accessible in Kinnigoli. He oversees brand strategy, curation, and retail expansion.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Lead Developer Card */}
                        <motion.div variants={fadeUp} className="group">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative">
                                <div className="relative h-80 overflow-hidden bg-gray-100">
                                    <img
                                        src={suhanImg}
                                        alt="Suhan K Amin - Lead Developer"
                                        className="w-full h-full object-cover object-top scale-[1.3] group-hover:scale-[1.35] transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-guild-black text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                            Lead Developer
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-guild-black">Suhan K Amin</h3>
                                                <p className="text-xs font-extrabold text-guild-red uppercase tracking-wider mt-0.5">Lead Web &amp; Systems Architect</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-3 font-medium">
                                            Architects and maintains the entire digital presence of Guild Fashion Store, engineering a fast, secure, and intuitive web shopping experience for every customer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Section 3: Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-guild-red/20 rounded-full blur-3xl pointer-events-none"></div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative z-10 flex flex-col justify-between space-y-4 hover:border-guild-red/30 transition-colors"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-guild-red text-white flex items-center justify-center font-extrabold text-sm mb-5 shadow-lg shadow-red-900/40">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Mission</h3>
                            <p className="text-gray-300 leading-relaxed text-base font-normal">
                                To provide stylish, trend-aligned, and high-quality clothing that empowers individuals to express themselves with confidence and comfort every single day.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative z-10 flex flex-col justify-between space-y-4 hover:border-white/30 transition-colors"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white text-guild-black flex items-center justify-center font-extrabold text-sm mb-5 shadow-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
                            <p className="text-gray-300 leading-relaxed text-base font-normal">
                                To become the most trusted fashion brand in coastal Karnataka by continuously delivering innovative designs, premium craftsmanship, and unparalleled customer delight.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Section 4: Store Location Video & Interactive Showcase */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-5 items-stretch">
                        <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                            <div className="inline-flex items-center gap-2 text-guild-red text-xs font-bold uppercase tracking-widest">
                                <span className="w-2.5 h-2.5 rounded-full bg-guild-red animate-ping"></span>
                                Store Location &amp; Experience
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-black text-guild-black tracking-tight">Visit Guild Fashion Studio</h3>

                            <div className="space-y-2 text-gray-600 font-medium text-base">
                                <p className="font-bold text-guild-black text-lg">Star Plaza Building, 1st Floor</p>
                                <p>Opposite Sarvajanika Ganapathi Katte</p>
                                <p>Kinnigoli &ndash; 574150, Karnataka, India</p>
                            </div>

                            <div className="pt-2">
                                <a
                                    href="https://maps.google.com/?q=Guild+Fashion+Store+Kinnigoli"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 bg-guild-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-sm group"
                                >
                                    <span>Get Directions on Google Maps</span>
                                    <svg className="w-4 h-4 text-guild-red group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Animated Location Video Showcase Container */}
                        <div className="lg:col-span-2 min-h-[340px] lg:min-h-full relative overflow-hidden bg-black flex items-center justify-center group">
                            {/* Ambient Video Stream with Overlay */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                                poster="/guild-loc.webp"
                            >
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-front-pose-41564-large.mp4" type="video/mp4" />
                                Your browser does not support HTML5 video.
                            </video>

                            {/* Dark Gradient Backdrop & Lighting */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none"></div>

                            {/* Animated Location Marker Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    <span>Live Location Reel</span>
                                </div>
                            </div>

                            {/* Interactive Pulse Center Icon */}
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-guild-red/30 animate-ping absolute"></div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-guild-red to-red-600 text-white flex items-center justify-center shadow-xl border border-white/30">
                                        <svg className="w-6 h-6 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Info Bar */}
                            <div className="absolute bottom-6 left-6 right-6 text-white z-10 flex justify-between items-end">
                                <div>
                                    <h4 className="text-lg font-bold text-white drop-shadow">Guild Kinnigoli Studio</h4>
                                    <p className="text-xs text-gray-300">Experience premium fashion in person</p>
                                </div>
                                <span className="bg-guild-red text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md">
                                    Open Today
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AboutUs;
