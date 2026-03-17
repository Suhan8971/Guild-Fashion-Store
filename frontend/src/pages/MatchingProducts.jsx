import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MatchingProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [matchingOutfits, setMatchingOutfits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the main product to display its name in the header
                const productRes = await api.get(`/products/${id}/`);
                setProduct(productRes.data);

                // Fetch matching outfits
                const matchRes = await api.get(`/matching-outfits/match/?product_id=${id}`);
                setMatchingOutfits(matchRes.data);
            } catch (error) {
                console.error("Error fetching matching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-10 mt-20">Loading...</div>;

    // Fallback if product not found but somehow we navigated here
    const title = product ? `All Matches for ${product.name}` : 'Matching Products';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-7xl mx-auto mt-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-500 hover:text-guild-red transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Product
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

            {matchingOutfits.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-lg">No matching items found for this product.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-guild-red hover:bg-red-800"
                    >
                        Go Back
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {matchingOutfits.map((match) => (
                        <div key={match.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg">
                            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 relative">
                                <img
                                    src={match.image ? (match.image.startsWith('http') ? match.image : `${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${match.image}`) : 'https://via.placeholder.com/300'}
                                    alt={match.name}
                                    className={`h-48 w-full object-cover object-center ${match.stock <= 0 ? 'opacity-60 grayscale' : ''}`}
                                />
                                {match.stock <= 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="bg-white bg-opacity-90 text-guild-red font-bold px-4 py-2 rounded-lg shadow-lg rotate-12 text-lg transform border-2 border-guild-red">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1" title={match.name}>
                                    {match.name}
                                </h3>
                                <p className="text-guild-red font-bold text-xl mb-2">
                                    ₹{match.price}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2 flex-grow mb-4" title={match.description}>
                                    {match.description}
                                </p>
                                <a
                                    href={`/product/${match.id}`}
                                    className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-guild-red hover:bg-red-800 transition-colors mt-auto"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchingProducts;
