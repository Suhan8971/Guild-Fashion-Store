import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const slideRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-guild-white via-guild-cream to-gray-100 pb-12 pt-4 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-16 mt-2">

                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-guild-black tracking-tight uppercase">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">Us</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover the story behind your most trusted fashion destination in Kinnigoli.
                    </p>
                </motion.div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify"
                    >
                        <p>
                            <strong className="text-guild-black font-semibold">Guild Fashion Store</strong> is a modern fashion outlet located in Kinnigoli, near Mangalore, dedicated to bringing stylish and trend-matching clothing to our customers. We specialize in carefully curated collections that reflect current fashion trends while maintaining comfort, quality, and affordability.
                        </p>
                        <p>
                            Our store offers a versatile range of apparel including stylish shirts, trendy T-shirts, comfortable bottoms, and fashionable shorts. Each piece is selected with attention to design, fit, and contemporary style so that our customers can confidently express themselves through fashion.
                        </p>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl transform rotate-2 group-hover:rotate-3 transition duration-500 ease-in-out opacity-50"></div>
                        <img
                            src="/Namith.PNG"
                            alt="Fashion Store"
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="order-2 lg:order-1 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-l from-gray-300 to-gray-400 rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition duration-500 ease-in-out opacity-50"></div>
                        <img
                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop"
                            alt="Modern Fashion"
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="order-1 lg:order-2 space-y-6 text-gray-700 leading-relaxed text-lg text-justify"
                    >
                        <p>
                            Founded by <strong className="text-guild-black">Namith Salian</strong>, CEO &amp; Founder, Guild Fashion Store was created with a vision to make trend-forward clothing easily accessible to the local community. What began as a passion for fashion and styling has grown into a trusted destination for everyday and occasion wear in Kinnigoli.
                        </p>
                        <p>
                            We believe fashion should be approachable, expressive, and suited to real lifestyles. At Guild, we focus on matching designs with current trends while ensuring customers enjoy both style and comfort in every purchase.
                        </p>
                    </motion.div>
                </div>

                {/* Market Head Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="space-y-6 text-gray-700 leading-relaxed text-lg order-2 lg:order-1 text-justify"
                    >
                        <p>
                            Meet <strong className="text-guild-black">Pranay Amin</strong>, our distinguished Market Head. Pranay is the driving force behind our dynamic market presence and customer outreach strategies. His expertise lies in understanding the evolving fashion landscape and ensuring that Guild Fashion Store strongly resonates with our community.
                        </p>
                        <p>
                            From curating impactful marketing campaigns to building strong relationships with our clientele, he plays a pivotal role in expanding the store&apos;s footprint. Pranay ensures that our collections not only meet but exceed the expectations of our diverse customer base.
                        </p>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="relative group order-1 lg:order-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl transform rotate-2 group-hover:rotate-3 transition duration-500 ease-in-out opacity-50"></div>
                        <img
                            src="/Market-Head.PNG"
                            alt="Pranay Amin - Market Head"
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </motion.div>
                </div>

                {/* Developer Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="order-2 lg:order-1 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-l from-gray-300 to-gray-400 rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition duration-500 ease-in-out opacity-50"></div>
                        <img
                            src="/Developer.jpg"
                            alt="Suhan K Amin - Developer"
                            className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="order-1 lg:order-2 space-y-6 text-gray-700 leading-relaxed text-lg"
                    >
                        <p>
                            Behind our seamless online experience is <strong className="text-guild-black">Suhan K Amin</strong>, our dedicated Lead Developer. Suhan architects and maintains the entire digital presence of Guild Fashion Store, ensuring that our shopping platform is as refined and stylish as our physical collections.
                        </p>
                        <p>
                            With a passion for building robust, user-centric web applications, he bridges the gap between technology and fashion. From smooth navigation to secure interactions, Suhan&apos;s technical expertise guarantees an effortless and premium experience for every user exploring our brand.
                        </p>
                    </motion.div>
                </div>

                {/* Mission & Vision Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-gray-50/50 p-6 md:p-10 rounded-3xl overflow-hidden">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideLeft}
                        className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 transform group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <h3 className="text-2xl font-bold text-guild-black mb-4 relative z-10 flex items-center">
                            <span className="bg-guild-black text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm">01</span>
                            Our Mission
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                            To provide stylish, trend-aligned, and quality clothing that helps people feel confident and comfortable in their everyday lives.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={slideRight}
                        className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 transform group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <h3 className="text-2xl font-bold text-guild-black mb-4 relative z-10 flex items-center">
                            <span className="bg-guild-black text-white w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm">02</span>
                            Our Vision
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                            To become the most trusted fashion destination in Kinnigoli and surrounding regions by consistently delivering modern designs and excellent customer experience.
                        </p>
                    </motion.div>
                </div>

                {/* Store Location */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    className="mt-16 bg-guild-black text-white rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                        <div className="md:col-span-3 p-10 md:p-14 flex flex-col justify-center">
                            <h3 className="text-3xl font-bold mb-6 tracking-wide">Visit Our Store</h3>
                            <div className="space-y-4 text-gray-300 text-lg">
                                <p className="font-semibold text-white text-xl">Guild Fashion Store</p>
                                <p>1st Floor, Star Plaza Building</p>
                                <p>Opposite Sarvajanika Ganapathi Katte</p>
                                <p>Kinnigoli &ndash; 574150</p>
                                <p>Near Mangalore, India</p>
                            </div>
                            <div className="mt-10">
                                <a
                                    href="https://maps.google.com/?q=Guild+Fashion+Store+Kinnigoli"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-white text-guild-black font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-gray-800 h-64 md:h-auto relative">
                            <img
                                src="/guild-loc.webp"
                                alt="Store Location"
                                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AboutUs;

