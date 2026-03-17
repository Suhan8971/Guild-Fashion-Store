import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { showModal } = useModal();
    const [product, setProduct] = useState(null);
    const [matchingOutfits, setMatchingOutfits] = useState([]);
    const [showMatching, setShowMatching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}/`);
                setProduct(response.data);

                // Fetch matching outfits
                try {
                    const matchRes = await api.get(`/matching-outfits/match/?product_id=${id}`);
                    setMatchingOutfits(matchRes.data);
                } catch (matchErr) {
                    console.log("No matching outfits found or error fetching them", matchErr);
                }

            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const toggleMatching = async () => {
        setShowMatching(!showMatching);
        // Note: We already tried to fetch matches in useEffect, but we could do it here on demand too.
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!product) return <div className="text-center py-10">Product not found.</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img src={product.image || 'https://via.placeholder.com/500'} alt={product.name} className="h-full w-full object-cover object-center" />
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-2xl text-guild-red font-semibold mb-6">₹ {product.price}</p>
                    <div className="prose prose-sm text-gray-500 mb-6">
                        <p>{product.description}</p>
                    </div>

                    {/* Action Area based on Stock */}
                    {product.stock > 0 ? (
                        <>
                            {/* Size Selector */}
                            {product.sizes && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.split(',').map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedSize === size
                                                    ? 'bg-guild-red text-white border-guild-red'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {size.trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <div className="flex items-center border border-gray-300 rounded-md w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                                        className="w-full text-center border-none focus:ring-0 p-2"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={() => {
                                        if (product.sizes && !selectedSize) {
                                            showModal({
                                                title: 'Size Required',
                                                message: 'Please select a size before adding to cart.',
                                                type: 'warning'
                                            });
                                            return;
                                        }
                                        addToCart(product, quantity, selectedSize);
                                    }}
                                    className="flex-1 bg-guild-red text-white px-4 py-2 text-sm md:px-8 md:py-3 md:text-base rounded-lg font-medium hover:bg-red-800 transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={toggleMatching}
                                    className="flex-1 bg-white text-guild-red border border-guild-red px-4 py-2 text-sm md:px-8 md:py-3 md:text-base rounded-lg font-medium hover:bg-red-50 transition-colors"
                                >
                                    {showMatching
                                        ? 'Hide Matching Outfits'
                                        : `Show Matching ${product.category_name?.toLowerCase().includes('shirt') ? 'Bottom'
                                            : product.category_name?.toLowerCase().includes('bottom') || product.category_name?.toLowerCase().includes('short') || product.category_name?.toLowerCase().includes('lower') ? 'Shirt'
                                                : 'Outfits'
                                        }`
                                    }
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-guild-red rounded">
                            <h3 className="text-xl font-bold text-guild-red">Out of stock</h3>
                            <p className="text-gray-700">will be available soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Matching Outfit Modal */}
            {showMatching && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all animate-bounce-in-down">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center bg-guild-black px-6 py-4 border-b border-guild-red border-opacity-20">
                            <h2 className="text-xl font-bold text-guild-white">Completes the Look</h2>
                            <button onClick={toggleMatching} className="text-guild-white hover:text-gray-300 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 bg-guild-cream relative max-h-[70vh] overflow-y-auto">
                            {matchingOutfits.length === 0 ? (
                                <p className="text-gray-500 text-center">No matching items found for this product.</p>
                            ) : (
                                <div className="space-y-6 pb-6">
                                    {matchingOutfits.slice(0, 3).map((match) => (
                                        <div key={match.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                <img
                                                    src={match.image ? (match.image.startsWith('http') ? match.image : `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${match.image}`) : 'https://via.placeholder.com/150'}
                                                    alt={match.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-bold text-guild-black truncate">
                                                    {match.name}
                                                </p>
                                                <p className="text-guild-red font-bold">
                                                    ₹{match.price}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                    {match.description}
                                                </p>
                                            </div>
                                            <div>
                                                <a
                                                    href={`/product/${match.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-guild-red hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guild-red transition-colors"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    ))}

                                    {matchingOutfits.length > 3 && (
                                        <div className="pt-2 flex justify-center sticky bottom-0 bg-guild-cream bg-opacity-90">
                                            <button
                                                onClick={() => {
                                                    toggleMatching();
                                                    navigate(`/product/${product.id}/matches`);
                                                }}
                                                className="inline-flex items-center px-6 py-3 border-2 border-guild-red text-sm font-bold rounded-full shadow-sm text-guild-red bg-transparent hover:bg-guild-red hover:text-white transition-all w-full justify-center"
                                            >
                                                Show remaining {matchingOutfits.length - 3} matches
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-guild-cream px-6 py-4 flex justify-end border-t border-gray-200">
                            <button
                                onClick={toggleMatching}
                                className="text-guild-black hover:text-gray-700 font-medium text-sm underline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
