import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BurntPaperLayout from '../components/BurntPaperLayout';

const SizeGuide = () => {
    const [unit, setUnit] = useState('in'); // 'in' or 'cm'
    const [activeTab, setActiveTab] = useState('shirts'); // 'shirts', 'tshirts', 'pants', 'jackets'

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Conversion helper: 1 inch = 2.54 cm
    const convert = (valInches) => {
        if (unit === 'in') return valInches;
        if (typeof valInches === 'string' && valInches.includes('-')) {
            const [min, max] = valInches.split('-').map(n => parseFloat(n.trim()));
            return `${Math.round(min * 2.54)} - ${Math.round(max * 2.54)} cm`;
        }
        const num = parseFloat(valInches);
        return isNaN(num) ? valInches : `${Math.round(num * 2.54)} cm`;
    };

    // Table Data Sets
    const shirtsData = [
        { size: 'S', label: 'Small', chest: '34 - 36', waist: '28 - 30', neck: '14 - 14.5', shoulder: '17' },
        { size: 'M', label: 'Medium', chest: '38 - 40', waist: '32 - 34', neck: '15 - 15.5', shoulder: '18' },
        { size: 'L', label: 'Large', chest: '42 - 44', waist: '36 - 38', neck: '16 - 16.5', shoulder: '19' },
        { size: 'XL', label: 'X-Large', chest: '46 - 48', waist: '40 - 42', neck: '17 - 17.5', shoulder: '20' },
        { size: 'XXL', label: '2X-Large', chest: '50 - 52', waist: '44 - 46', neck: '18 - 18.5', shoulder: '21' },
    ];

    const tshirtsData = [
        { size: 'S', label: 'Small', chest: '36 - 38', length: '27', sleeve: '8' },
        { size: 'M', label: 'Medium', chest: '40 - 42', length: '28', sleeve: '8.5' },
        { size: 'L', label: 'Large', chest: '44 - 46', length: '29', sleeve: '9' },
        { size: 'XL', label: 'X-Large', chest: '48 - 50', length: '30', sleeve: '9.5' },
        { size: 'XXL', label: '2X-Large', chest: '52 - 54', length: '31', sleeve: '10' },
    ];

    const pantsData = [
        { size: '28', label: 'Small (28)', waist: '28 - 29', hip: '34 - 35', inseam: '30' },
        { size: '30', label: 'Small (30)', waist: '30 - 31', hip: '36 - 37', inseam: '30' },
        { size: '32', label: 'Medium (32)', waist: '32 - 33', hip: '38 - 39', inseam: '31' },
        { size: '34', label: 'Medium (34)', waist: '34 - 35', hip: '40 - 41', inseam: '31' },
        { size: '36', label: 'Large (36)', waist: '36 - 37', hip: '42 - 43', inseam: '32' },
        { size: '38', label: 'X-Large (38)', waist: '38 - 39', hip: '44 - 45', inseam: '32' },
    ];

    const jacketsData = [
        { size: 'S', label: 'Small', chest: '38 - 40', shoulder: '18', sleeve: '24.5' },
        { size: 'M', label: 'Medium', chest: '42 - 44', shoulder: '19', sleeve: '25' },
        { size: 'L', label: 'Large', chest: '46 - 48', shoulder: '20', sleeve: '25.5' },
        { size: 'XL', label: 'X-Large', chest: '50 - 52', shoulder: '21', sleeve: '26' },
    ];

    return (
        <BurntPaperLayout
            title="Size Guide & Charts"
            subtitle="Accurate sizing tables and measurement guidelines to ensure the perfect fit every single time."
            icon={
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            }
        >
            <div className="space-y-8">

                {/* Top Toolbar: Category Tabs & Unit Switcher */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-950/10 p-3 rounded-2xl border border-amber-900/20">

                    {/* Category Selector Tabs */}
                    <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('shirts')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                                activeTab === 'shirts'
                                    ? 'bg-amber-950 text-amber-300 shadow-md border border-amber-700/50'
                                    : 'text-amber-900 hover:bg-amber-900/10'
                            }`}
                        >
                            Shirts &amp; Formal Tops
                        </button>

                        <button
                            onClick={() => setActiveTab('tshirts')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                                activeTab === 'tshirts'
                                    ? 'bg-amber-950 text-amber-300 shadow-md border border-amber-700/50'
                                    : 'text-amber-900 hover:bg-amber-900/10'
                            }`}
                        >
                            T-Shirts &amp; Polos
                        </button>

                        <button
                            onClick={() => setActiveTab('pants')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                                activeTab === 'pants'
                                    ? 'bg-amber-950 text-amber-300 shadow-md border border-amber-700/50'
                                    : 'text-amber-900 hover:bg-amber-900/10'
                            }`}
                        >
                            Bottoms &amp; Trousers
                        </button>

                        <button
                            onClick={() => setActiveTab('jackets')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                                activeTab === 'jackets'
                                    ? 'bg-amber-950 text-amber-300 shadow-md border border-amber-700/50'
                                    : 'text-amber-900 hover:bg-amber-900/10'
                            }`}
                        >
                            Outerwear &amp; Jackets
                        </button>
                    </div>

                    {/* Unit Switcher Button Group */}
                    <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-amber-900/20 shadow-xs shrink-0">
                        <span className="text-[10px] font-black uppercase text-amber-900/70 px-2">Unit:</span>
                        <button
                            onClick={() => setUnit('in')}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                unit === 'in' ? 'bg-amber-900 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
                            }`}
                        >
                            IN (Inches)
                        </button>
                        <button
                            onClick={() => setUnit('cm')}
                            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                unit === 'cm' ? 'bg-amber-900 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
                            }`}
                        >
                            CM (Centimeters)
                        </button>
                    </div>
                </div>

                {/* Dynamic Table Card */}
                <motion.div
                    key={activeTab + unit}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 rounded-2xl border-2 border-amber-900/20 overflow-hidden shadow-lg"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-300 text-xs sm:text-sm uppercase tracking-wider font-serif">
                                    <th className="p-4 border-b border-amber-800">Size Tag</th>
                                    {activeTab === 'shirts' && (
                                        <>
                                            <th className="p-4 border-b border-amber-800">Chest ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Waist ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Neck ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Shoulder ({unit.toUpperCase()})</th>
                                        </>
                                    )}
                                    {activeTab === 'tshirts' && (
                                        <>
                                            <th className="p-4 border-b border-amber-800">Chest ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Body Length ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Sleeve ({unit.toUpperCase()})</th>
                                        </>
                                    )}
                                    {activeTab === 'pants' && (
                                        <>
                                            <th className="p-4 border-b border-amber-800">Waist ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Hip ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Inseam ({unit.toUpperCase()})</th>
                                        </>
                                    )}
                                    {activeTab === 'jackets' && (
                                        <>
                                            <th className="p-4 border-b border-amber-800">Chest ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Shoulder ({unit.toUpperCase()})</th>
                                            <th className="p-4 border-b border-amber-800">Sleeve Length ({unit.toUpperCase()})</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-900/10 text-sm font-medium text-stone-800">
                                {activeTab === 'shirts' && shirtsData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-100/60 transition-colors">
                                        <td className="p-4 font-black text-amber-950 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs">{row.size}</span>
                                            <span>{row.label}</span>
                                        </td>
                                        <td className="p-4">{convert(row.chest)}</td>
                                        <td className="p-4">{convert(row.waist)}</td>
                                        <td className="p-4">{convert(row.neck)}</td>
                                        <td className="p-4">{convert(row.shoulder)}</td>
                                    </tr>
                                ))}

                                {activeTab === 'tshirts' && tshirtsData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-100/60 transition-colors">
                                        <td className="p-4 font-black text-amber-950 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs">{row.size}</span>
                                            <span>{row.label}</span>
                                        </td>
                                        <td className="p-4">{convert(row.chest)}</td>
                                        <td className="p-4">{convert(row.length)}</td>
                                        <td className="p-4">{convert(row.sleeve)}</td>
                                    </tr>
                                ))}

                                {activeTab === 'pants' && pantsData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-100/60 transition-colors">
                                        <td className="p-4 font-black text-amber-950 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs">{row.size}</span>
                                            <span>{row.label}</span>
                                        </td>
                                        <td className="p-4">{convert(row.waist)}</td>
                                        <td className="p-4">{convert(row.hip)}</td>
                                        <td className="p-4">{convert(row.inseam)}</td>
                                    </tr>
                                ))}

                                {activeTab === 'jackets' && jacketsData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-amber-100/60 transition-colors">
                                        <td className="p-4 font-black text-amber-950 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs">{row.size}</span>
                                            <span>{row.label}</span>
                                        </td>
                                        <td className="p-4">{convert(row.chest)}</td>
                                        <td className="p-4">{convert(row.shoulder)}</td>
                                        <td className="p-4">{convert(row.sleeve)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* How to Measure Step-by-Step Visual Guide */}
                <motion.div variants={fadeUp} className="bg-white/80 p-6 sm:p-8 rounded-2xl border border-amber-900/20 space-y-6">
                    <h3 className="text-2xl font-black text-amber-950 font-serif flex items-center gap-2">
                        <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zM4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
                        </svg>
                        <span>How to Take Measurements</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-800">
                        {/* Chest */}
                        <div className="bg-amber-950/5 p-4 rounded-xl border border-amber-900/10 space-y-1">
                            <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                1. Chest
                            </h4>
                            <p className="text-stone-700 leading-relaxed">Wrap measuring tape around the fullest part of your chest, under the arms, keeping tape parallel to the ground.</p>
                        </div>

                        {/* Waist */}
                        <div className="bg-amber-950/5 p-4 rounded-xl border border-amber-900/10 space-y-1">
                            <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                2. Natural Waist
                            </h4>
                            <p className="text-stone-700 leading-relaxed">Measure around your natural waistline (narrowest area above belly button), keeping tape comfortably snug.</p>
                        </div>

                        {/* Neck */}
                        <div className="bg-amber-950/5 p-4 rounded-xl border border-amber-900/10 space-y-1">
                            <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                3. Neck (Collar Size)
                            </h4>
                            <p className="text-stone-700 leading-relaxed">Measure around the base of your neck where your shirt collar rests. Insert one finger for comfort allowance.</p>
                        </div>

                        {/* Inseam */}
                        <div className="bg-amber-950/5 p-4 rounded-xl border border-amber-900/10 space-y-1">
                            <h4 className="font-bold text-amber-950 text-base flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                4. Pant Inseam
                            </h4>
                            <p className="text-stone-700 leading-relaxed">Measure along the inside of your leg from the crotch down to the top of your shoes for exact break.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Sizing Assistance Banner */}
                <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-700/40">
                    <div>
                        <h3 className="text-xl font-black text-amber-400 font-serif">Need Personal Sizing Assistance?</h3>
                        <p className="text-xs sm:text-sm text-stone-300 mt-1">Visit our Kinnigoli studio or email our styling team with your body measurements.</p>
                    </div>
                    <a
                        href="mailto:fashionstoreguild@gmail.com"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm shrink-0"
                    >
                        <span>Ask a Stylist</span>
                    </a>
                </div>

            </div>
        </BurntPaperLayout>
    );
};

export default SizeGuide;
