import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SizeGuide = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-guild-cream py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8 mt-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl">

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
                        Size Guide
                    </h1>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6 text-gray-700 leading-relaxed text-lg text-justify">
                    <p className="text-center max-w-2xl mx-auto">
                        Finding the perfect fit is essential to looking your best. <strong className="text-guild-black">Guild Fashion Store</strong> uses standard industry sizing, but fits can vary slightly by style or brand. Use the charts below as a general guide.
                    </p>

                    <h2 className="text-2xl font-bold text-guild-black mt-12 mb-4 border-b pb-2">Men&apos;s Shirts & Tops</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-guild-black">
                                    <th className="p-3 border">Size</th>
                                    <th className="p-3 border">Chest (Inches)</th>
                                    <th className="p-3 border">Waist (Inches)</th>
                                    <th className="p-3 border">Neck (Inches)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border font-semibold">Small (S)</td>
                                    <td className="p-3 border">34 - 36</td>
                                    <td className="p-3 border">28 - 30</td>
                                    <td className="p-3 border">14 - 14.5</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-3 border font-semibold">Medium (M)</td>
                                    <td className="p-3 border">38 - 40</td>
                                    <td className="p-3 border">32 - 34</td>
                                    <td className="p-3 border">15 - 15.5</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border font-semibold">Large (L)</td>
                                    <td className="p-3 border">42 - 44</td>
                                    <td className="p-3 border">36 - 38</td>
                                    <td className="p-3 border">16 - 16.5</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-3 border font-semibold">X-Large (XL)</td>
                                    <td className="p-3 border">46 - 48</td>
                                    <td className="p-3 border">40 - 42</td>
                                    <td className="p-3 border">17 - 17.5</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-2xl font-bold text-guild-black mt-12 mb-4 border-b pb-2">Men&apos;s Bottoms & Pants</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-guild-black">
                                    <th className="p-3 border">Size</th>
                                    <th className="p-3 border">Waist (Inches)</th>
                                    <th className="p-3 border">Inseam (Inches)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-3 border font-semibold">Small (S)</td>
                                    <td className="p-3 border">28 - 30</td>
                                    <td className="p-3 border">30</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-3 border font-semibold">Medium (M)</td>
                                    <td className="p-3 border">32 - 34</td>
                                    <td className="p-3 border">31</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border font-semibold">Large (L)</td>
                                    <td className="p-3 border">36 - 38</td>
                                    <td className="p-3 border">32</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-3 border font-semibold">X-Large (XL)</td>
                                    <td className="p-3 border">40 - 42</td>
                                    <td className="p-3 border">33</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-bold text-guild-black mb-2">How to Measure</h3>
                        <ul className="list-disc pl-6 space-y-2 text-md">
                            <li><strong>Chest:</strong> Measure under arms and around the fullest part of your chest with measuring tape parallel to the floor.</li>
                            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
                            <li><strong>Neck:</strong> Measure around the base of your neck, inserting placing one finger between the tape and your neck for comfort.</li>
                            <li><strong>Inseam:</strong> Measure from your crotch down to the desired pant break at the shoe.</li>
                        </ul>
                    </div>

                    <h2 className="text-2xl font-bold text-guild-black mt-8">Still unsure?</h2>
                    <p>
                        We&apos;re here to help you find the perfect fit. Reach out to our styling team with your measurements or drop by our Kinnigoli store! <br />
                        <a href="mailto:fashionstoreguild@gmail.com" className="text-blue-600 hover:underline">fashionstoreguild@gmail.com</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SizeGuide;
