import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const BurntPaperLayout = ({ title, subtitle, icon, children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0a09] text-stone-900 py-10 px-3 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-amber-800 selection:text-white">
            
            {/* Embedded Keyframe Animations for Floating Embers & Charred Glow */}
            <style>{`
                @keyframes emberRise {
                    0% { transform: translateY(0) scale(0.8) rotate(0deg); opacity: 0.2; }
                    50% { opacity: 0.8; }
                    100% { transform: translateY(-120px) scale(1.2) rotate(45deg); opacity: 0; }
                }
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.4; filter: blur(8px); }
                    50% { opacity: 0.8; filter: blur(14px); }
                }
                @keyframes paperBurnEdge {
                    0%, 100% { border-color: rgba(180, 83, 9, 0.4); box-shadow: inset 0 0 40px rgba(67, 20, 7, 0.35), 0 0 20px rgba(245, 158, 11, 0.15); }
                    50% { border-color: rgba(245, 158, 11, 0.6); box-shadow: inset 0 0 55px rgba(67, 20, 7, 0.5), 0 0 30px rgba(245, 158, 11, 0.3); }
                }
            `}</style>

            {/* Ambient Ember Sparks Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl"></div>

                {/* Floating Ember Particles */}
                <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-amber-500 blur-[1px]" style={{ animation: 'emberRise 6s infinite ease-out 0s' }}></div>
                <div className="absolute top-1/3 right-16 w-1.5 h-1.5 rounded-full bg-orange-400 blur-[1px]" style={{ animation: 'emberRise 7s infinite ease-out 2s' }}></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-red-500 blur-[1px]" style={{ animation: 'emberRise 8s infinite ease-out 1s' }}></div>
                <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px]" style={{ animation: 'emberRise 5s infinite ease-out 3s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-6">

                {/* Navigation Header Row */}
                <div className="flex items-center justify-between pt-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-200 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-amber-700/40 hover:border-amber-500/60 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition-all group"
                        >
                            <svg className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Shop</span>
                        </Link>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-400 hover:text-amber-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <span>Previous Page</span>
                    </motion.button>
                </div>

                {/* Burnt Parchment Main Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-b from-[#fefae0] via-[#f7ebd8] to-[#f4e3c9] text-stone-900 shadow-2xl border-2 border-amber-900/40"
                    style={{ animation: 'paperBurnEdge 6s infinite ease-in-out' }}
                >
                    {/* Singed Paper Charred Edges Backdrop Gradients */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_60px_rgba(67,20,7,0.45),_inset_0_0_20px_rgba(180,83,9,0.3)]"></div>
                    
                    {/* Top Charred Scorched Border Highlight */}
                    <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-amber-900/60 to-transparent"></div>

                    {/* Burnt Corner Glowing Ember Accents */}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-amber-600/30 blur-[2px]"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-600/30 blur-[2px]"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-amber-700/30 blur-[2px]"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-red-700/30 blur-[2px]"></div>

                    {/* Wax Seal Official Guild Emblem Badge Header */}
                    <div className="flex flex-col items-center justify-center space-y-4 pb-8 mb-8 border-b-2 border-amber-900/20 relative">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 140 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-950 via-red-950 to-stone-900 text-amber-400 flex items-center justify-center shadow-xl border-4 border-amber-700/50 relative group cursor-default"
                        >
                            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md group-hover:blur-lg transition-all"></div>
                            {icon || (
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 relative z-10 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            )}
                        </motion.div>

                        <div className="text-center space-y-2 max-w-2xl">
                            <span className="inline-block bg-amber-950/10 text-amber-950 text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest border border-amber-900/20 shadow-xs">
                                Guild Store Official Policy
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-tight uppercase drop-shadow-sm font-serif">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-amber-900/80 text-sm sm:text-base font-medium leading-relaxed font-sans">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="relative z-10">
                        {children}
                    </div>

                    {/* Burnt Parchment Footer Stamp */}
                    <div className="mt-12 pt-6 border-t border-amber-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-900/70 font-semibold font-sans">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                            <span>Verified Document &bull; Guild Fashion Store Kinnigoli</span>
                        </div>
                        <p>&copy; {new Date().getFullYear()} Guild Fashion Store. All Rights Reserved.</p>
                    </div>

                </motion.div>

            </div>
        </div>
    );
};

export default BurntPaperLayout;
