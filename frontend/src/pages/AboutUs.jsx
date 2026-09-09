import React, { useEffect } from 'react';
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-guild-cream/30 to-white pb-20 pt-6 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-20">

                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-center space-y-5 pt-4"
                >
                    <div className="inline-flex items-center gap-2 bg-guild-red/10 border border-guild-red/20 px-4 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-guild-red animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-guild-red">Est. Kinnigoli, Mangalore</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-guild-black tracking-tight uppercase">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-guild-red via-red-800 to-guild-black">Guild Store</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        Crafting trend-forward fashion, premium comfort, and an effortless shopping experience for the modern individual.
                    </p>
                </motion.div>

                {/* Key Highlights Bar */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center"
                >
                    <div className="p-3 border-r border-gray-100 last:border-0">
                        <p className="text-2xl sm:text-3xl font-extrabold text-guild-black">100%</p>
                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">Curated Quality</p>
                    </div>
                    <div className="p-3 md:border-r border-gray-100 last:border-0">
                        <p className="text-2xl sm:text-3xl font-extrabold text-guild-black">Trending</p>
                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">Modern Collections</p>
                    </div>
                    <div className="p-3 border-r border-gray-100 last:border-0">
                        <p className="text-2xl sm:text-3xl font-extrabold text-guild-black">Kinnigoli</p>
                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">Flagship Store</p>
                    </div>
                    <div className="p-3">
                        <p className="text-2xl sm:text-3xl font-extrabold text-guild-black">Seamless</p>
                        <p className="text-xs font-bold text-gray-500 uppercase mt-1">Online & Offline</p>
                    </div>
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
                        <div className="inline-block bg-neutral-100 text-guild-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                            Our Essence
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-guild-black tracking-tight leading-tight">
                            Bringing Global Trends to Your Everyday Wardrobe
                        </h2>
                        <p>
                            <strong className="text-guild-black font-bold">Guild Fashion Store</strong> is a premier clothing destination situated in Kinnigoli, near Mangalore. We specialize in carefully curated collections that fuse contemporary fashion with effortless comfort, durability, and accessible pricing.
                        </p>
                        <p>
                            Our store offers a versatile range of apparel, including precision-tailored shirts, casual T-shirts, comfortable bottoms, and stylish shorts. Each piece is selected with attention to design, fabric fit, and contemporary aesthetic so our customers can express themselves with confidence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="relative group"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-r from-guild-red/20 to-guild-black/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                                alt="Guild Fashion Store Showroom"
                                className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="bg-guild-red text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                                    Flagship Experience
                                </span>
                                <h3 className="text-xl font-bold mt-2">Curated Fashion Destination</h3>
                                <p className="text-xs text-gray-200 mt-1">Kinnigoli, Coastal Karnataka</p>
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
                        <div className="inline-block bg-neutral-100 text-guild-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                            Leadership Team
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-guild-black tracking-tight">
                            Meet the Minds Behind Guild
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
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
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                                <div className="relative h-80 overflow-hidden bg-gray-100">
                                    <img
                                        src="/Namith.PNG"
                                        alt="Namith Salian - Founder & CEO"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-guild-black text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-widest shadow-md">
                                            Founder &amp; CEO
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-guild-black">Namith Salian</h3>
                                        <p className="text-xs font-semibold text-guild-red uppercase tracking-wider mt-0.5">Founder &amp; Chief Executive</p>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-3 font-medium">
                                            Founded Guild Fashion Store with a vision to make trend-forward, premium clothing easily accessible in Kinnigoli. He oversees brand strategy, curation, and retail expansion.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Lead Developer Card */}
                        <motion.div variants={fadeUp} className="group">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                                <div className="relative h-80 overflow-hidden bg-gray-100">
                                    <img
                                        src={suhanImg}
                                        alt="Suhan K Amin - Lead Developer"
                                        className="w-full h-full object-cover object-top scale-[1.3] group-hover:scale-[1.35] transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-guild-black text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-widest shadow-md">
                                            Lead Developer
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-guild-black">Suhan K Amin</h3>
                                        <p className="text-xs font-semibold text-guild-red uppercase tracking-wider mt-0.5">Lead Web &amp; Systems Architect</p>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-3 font-medium">
                                            Architects and maintains the entire digital presence of Guild Fashion Store, engineering a fast, secure, and intuitive web shopping experience for every customer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Section 3: Mission, Vision & Promise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-guild-red/20 rounded-full blur-3xl pointer-events-none"></div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative z-10 flex flex-col justify-between space-y-4"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-guild-red flex items-center justify-center font-extrabold text-white text-sm mb-4">
                                01
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
                        className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative z-10 flex flex-col justify-between space-y-4"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-white text-guild-black flex items-center justify-center font-extrabold text-sm mb-4">
                                02
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
                            <p className="text-gray-300 leading-relaxed text-base font-normal">
                                To become the most trusted fashion brand in Kinnigoli and coastal Karnataka by continuously delivering innovative designs, premium craftsmanship, and unparalleled customer delight.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Section 4: Store Location & Contact */}
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Visit Us In Person
                            </div>
                            <h3 className="text-3xl font-extrabold text-guild-black tracking-tight">Guild Fashion Store Flagship</h3>

                            <div className="space-y-2 text-gray-600 font-medium text-base">
                                <p className="font-bold text-guild-black text-lg">Star Plaza Building, 1st Floor</p>
                                <p>Opposite Sarvajanika Ganapathi Katte</p>
                                <p>Kinnigoli &ndash; 574150, Karnataka, India</p>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="https://maps.google.com/?q=Guild+Fashion+Store+Kinnigoli"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-guild-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-sm"
                                >
                                    Get Directions on Google Maps
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-2 min-h-[300px] lg:min-h-full relative overflow-hidden bg-gray-900">
                            <img
                                src="/guild-loc.webp"
                                alt="Guild Store Location Map"
                                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/30">
                                    Storefront View
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
