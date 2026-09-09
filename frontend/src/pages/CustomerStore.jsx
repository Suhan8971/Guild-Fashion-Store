import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const CustomerStore = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const lastUpdatedRef = useRef(null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const checkUpdates = async () => {
        try {
            const res = await api.get('/products/last_updated/');
            const serverUpdated = res.data.last_updated;

            if (serverUpdated !== lastUpdatedRef.current) {
                lastUpdatedRef.current = serverUpdated;
                // Trigger fetch if timestamp changed
                fetchData();
            }
        } catch (err) {
            // console.error(err); // Fail silently for polling
        }
    };

    const fetchData = async () => {
        // Only show loading on initial load (when products are empty)
        if (products.length === 0) setLoading(true);
        try {
            // Fetch Categories
            const catRes = await api.get('/categories/');
            setCategories(catRes.data.filter(cat => cat.slug !== 'testcat' && cat.name.toLowerCase() !== 'testcat'));

            // Fetch Products
            let endpoint = '/products/';
            const params = new URLSearchParams();

            if (categoryFilter) {
                params.append('category', categoryFilter);
            }
            if (debouncedSearch) {
                params.append('search', debouncedSearch);
            }

            const queryString = params.toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;

            const prodRes = await api.get(url);
            setProducts(prodRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch
        const intervalId = setInterval(checkUpdates, 1000); // Poll timestamp every second
        return () => clearInterval(intervalId);
    }, [categoryFilter, debouncedSearch]); // Re-run if filter or search changes

    if (loading) return <div className="text-center py-10">Loading store...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Sidebar - Visible on Desktop (>=1024px) */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Categories</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className={`block px-3 py-2 rounded-md transition-colors ${!categoryFilter ? 'bg-red-50 text-guild-red font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Products
                            </Link>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <Link
                                    to={`/?category=${cat.slug}`}
                                    className={`block px-3 py-2 rounded-md transition-colors ${categoryFilter === cat.slug ? 'bg-red-50 text-guild-red font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Slide-out Category Drawer for Mobile/Tablet (<1024px) */}
            <div className={`fixed inset-0 z-50 lg:hidden ${isDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Semi-transparent Backdrop */}
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* Off-canvas Panel */}
                <div
                    className={`absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white/90 backdrop-blur-md shadow-2xl border-r border-white/20 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-guild-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            Categories
                        </h2>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100/50"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={`block px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${!categoryFilter ? 'bg-red-50 text-guild-red shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/?category=${cat.slug}`}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className={`block px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${categoryFilter === cat.slug ? 'bg-red-50 text-guild-red shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Floating Categories Trigger Button for Mobile/Tablet (<1024px) */}
            <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 bg-gradient-to-r from-guild-red to-red-700 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-sm tracking-wide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Categories
            </button>

            {/* Product Grid */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-guild-black via-guild-red to-guild-black drop-shadow-lg animate-gradient-x tracking-tight">
                        {categoryFilter ? `${categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}` : 'New Arrivals'}
                    </h1>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-guild-red focus:border-transparent shadow-sm transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-500 text-lg">No products found in this category.</p>
                            <Link to="/" className="text-guild-red hover:underline mt-2 inline-block">View all products</Link>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                                <div className="relative pt-[100%] bg-gray-100">
                                    <img
                                        className={`absolute top-0 left-0 w-full h-full object-cover ${product.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="bg-white bg-opacity-90 text-guild-red font-bold px-4 py-2 rounded-lg shadow-lg rotate-12 text-lg transform border-2 border-guild-red">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category_name}</p>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="bg-guild-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerStore;
