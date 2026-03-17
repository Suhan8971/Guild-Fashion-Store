import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { RevenueTrendsChart, StateDistributionChart, CategorySalesChart, OrderStatusDoughnut } from '../components/AnalyticsCharts';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '', // Selling Price
        actual_price: '', // MRP
        cost_price: '', // Still kept in state/backend but hidden in UI
        description: '',
        stock: '',
        sizes: 'S,M,L,XL', // Default sizes
        variants: [], // { size, quantity, weight, price }
        category: '',
        image: null,
        // Matching Bottoms State
        hasMatchingBottom: false,
        matchingBottoms: [], // Array of bottom objects
        linkedExistingItems: [],
        addedLinks: [],
        removedLinks: [],
        selectedItemToLink: ''
    });

    // ...

    // Date Filters
    // Date Filters
    const [productFilters, setProductFilters] = useState({ start: '', end: '' });
    const [orderFilters, setOrderFilters] = useState({ start: '', end: '' });

    // Export State
    const [exportFormat, setExportFormat] = useState('');

    // Analytics State
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsRange, setAnalyticsRange] = useState('today');
    const [customAnalyticsDates, setCustomAnalyticsDates] = useState({ start: '', end: '' });

    const fetchAnalytics = async () => {
        try {
            let endpoint = `/analytics/?range=${analyticsRange}`;
            if (analyticsRange === 'custom' && customAnalyticsDates.start && customAnalyticsDates.end) {
                endpoint += `&start=${customAnalyticsDates.start}&end=${customAnalyticsDates.end}`;
            }
            const res = await api.get(endpoint);
            setAnalyticsData(res.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 'analytics') {
            fetchAnalytics();
        }
    }, [activeTab, analyticsRange, customAnalyticsDates]);

    const lastUpdatedRef = useRef(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            let endpoint = '/products/';
            if (searchTerm) {
                endpoint += `?search=${searchTerm}`;
            }
            const res = await api.get(endpoint);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchCategories();

        const intervalId = setInterval(async () => {
            try {
                const res = await api.get('/products/last_updated/');
                const serverUpdated = res.data.last_updated;

                if (serverUpdated !== lastUpdatedRef.current) {
                    lastUpdatedRef.current = serverUpdated;
                    fetchProducts();
                    fetchCategories();
                }
            } catch (err) { }
        }, 2000); // Check every 2 seconds
        return () => clearInterval(intervalId);
    }, [searchTerm]); // Re-create interval if search term changes so fetchProducts uses new term

    useEffect(() => {
        const totalStock = formData.variants.reduce((acc, v) => acc + (parseInt(v.quantity) || 0), 0);
        const sizesStr = formData.variants.map(v => v.size).filter(s => s).join(',');
        setFormData(prev => ({ ...prev, stock: totalStock, sizes: sizesStr }));
    }, [formData.variants]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    // Helper to get category name
    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id == id);
        return cat ? cat.name : '';
    };

    const getDefaultVariants = (catName) => {
        if (['Shirt', 'T-Shirt'].includes(catName)) {
            return ['S', 'M', 'L', 'XL', 'XXL'].map(size => ({
                size, quantity: 0, weight: 0.0, length: 0.0, width: 0.0, height: 0.0, price: ''
            }));
        } else if (['Bottom', 'Short', 'Lower'].includes(catName)) {
            const sizes = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];
            return sizes.map(size => ({
                size: size.toString(), quantity: 0, weight: 0.0, length: 0.0, width: 0.0, height: 0.0, price: ''
            }));
        }
        return [];
    };

    // Generate defaults when category changes
    useEffect(() => {
        if (isEditMode) return; // Don't overwrite on edit initialization (handled in openEditModal)

        const catName = getCategoryName(formData.category);
        const defaultVariants = getDefaultVariants(catName);

        if (defaultVariants.length > 0) {
            setFormData(prev => ({ ...prev, variants: defaultVariants }));
        }
    }, [formData.category, categories, isEditMode]);

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]: value
        };
        setFormData({ ...formData, variants: newVariants });
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', quantity: 0, weight: 0.0, length: 0.0, width: 0.0, height: 0.0, price: '' }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    // Matching Item Logic
    const getTargetCategoryForMatching = () => {
        const currentCat = getCategoryName(formData.category);
        if (['Shirt', 'T-Shirt'].includes(currentCat)) return 'Bottom';
        if (['Bottom', 'Short', 'Lower'].includes(currentCat)) return 'Shirt';
        return '';
    };

    const addMatchingBottom = () => {
        const targetCatName = getTargetCategoryForMatching();
        const targetCatObj = categories.find(c => c.name === targetCatName);
        const targetCatId = targetCatObj ? targetCatObj.id : '';

        setFormData(prev => ({
            ...prev,
            matchingBottoms: [
                ...prev.matchingBottoms,
                {
                    id: Date.now(),
                    name: '',
                    description: '',
                    price: '', // Selling Price
                    actual_price: '', // MRP
                    stock: '',
                    variants: getDefaultVariants(targetCatName, true),
                    category: targetCatId,
                    image: null
                }
            ]
        }));
    };

    const removeMatchingBottom = (id) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.filter(bottom => bottom.id !== id)
        }));
    };

    const handleMatchingBottomChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.map(bottom =>
                bottom.id === id ? { ...bottom, [field]: value } : bottom
            )
        }));
    };

    const handleMatchingVariantChange = (bottomId, variantIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.map(bottom => {
                if (bottom.id !== bottomId) return bottom;
                const newVariants = [...bottom.variants];
                // Use immutable update
                newVariants[variantIndex] = {
                    ...newVariants[variantIndex],
                    [field]: value
                };
                return { ...bottom, variants: newVariants };
            })
        }));
    };

    const addMatchingVariant = (bottomId) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.map(bottom => {
                if (bottom.id !== bottomId) return bottom;
                return {
                    ...bottom,
                    variants: [...bottom.variants, { size: '', quantity: 0, weight: 0.0, length: 0.0, width: 0.0, height: 0.0, price: '' }]
                };
            })
        }));
    };

    const removeMatchingVariant = (bottomId, variantIndex) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.map(bottom => {
                if (bottom.id !== bottomId) return bottom;
                return {
                    ...bottom,
                    variants: bottom.variants.filter((_, i) => i !== variantIndex)
                };
            })
        }));
    };



    const handleMatchingBottomFileChange = (id, file) => {
        setFormData(prev => ({
            ...prev,
            matchingBottoms: prev.matchingBottoms.map(bottom =>
                bottom.id === id ? { ...bottom, image: file } : bottom
            )
        }));
    };

    const toggleMatchingBottom = (e) => {
        const isAvailable = e.target.value === 'yes';
        const targetCatName = getTargetCategoryForMatching();
        const targetCatObj = categories.find(c => c.name === targetCatName);
        const targetCatId = targetCatObj ? targetCatObj.id : '';

        setFormData(prev => ({
            ...prev,
            hasMatchingBottom: isAvailable,
            matchingBottoms: isAvailable && prev.matchingBottoms.length === 0 ? [{
                id: Date.now(),
                name: '',
                description: '',
                price: '',
                stock: '',
                variants: getDefaultVariants(targetCatName, true),
                category: targetCatId,
                image: null
            }] : prev.matchingBottoms
        }));
    };

    const handleAddExistingLink = () => {
        if (!formData.selectedItemToLink) return;
        const selectedProd = products.find(p => p.id == formData.selectedItemToLink);
        if (!selectedProd) return;

        // Check if already in linkedExistingItems
        if (formData.linkedExistingItems.find(item => item.id == selectedProd.id)) return;

        const newItem = { id: selectedProd.id, name: selectedProd.name };

        setFormData(prev => ({
            ...prev,
            linkedExistingItems: [...prev.linkedExistingItems, newItem],
            addedLinks: [...prev.addedLinks, selectedProd.id],
            removedLinks: prev.removedLinks.filter(id => id != selectedProd.id),
            selectedItemToLink: '' // reset
        }));
    };

    const handleRemoveExistingLink = (idToRemove) => {
        setFormData(prev => ({
            ...prev,
            linkedExistingItems: prev.linkedExistingItems.filter(item => item.id != idToRemove),
            removedLinks: [...prev.removedLinks, idToRemove],
            addedLinks: prev.addedLinks.filter(id => id != idToRemove)
        }));
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({
            name: '', price: '', actual_price: '', cost_price: '', description: '', stock: '', sizes: 'S,M,L,XL', category: '', image: null,
            variants: [],
            hasMatchingBottom: false, matchingBottoms: [],
            linkedExistingItems: [], addedLinks: [], removedLinks: [], selectedItemToLink: ''
        });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setIsEditMode(true);
        setCurrentProduct(product);
        const linkedItems = [...(product.linked_bottoms || []), ...(product.linked_shirts || [])];
        setFormData({
            name: product.name,
            price: product.price,
            actual_price: product.actual_price || '',
            cost_price: product.cost_price,
            description: product.description,
            stock: product.stock,
            sizes: product.sizes || 'S,M,L,XL',
            variants: (product.variants && product.variants.length > 0)
                ? product.variants
                : getDefaultVariants(product.category_name), // Fallback to defaults
            category: product.category,
            image: null,
            hasMatchingBottom: false, matchingBottoms: [], // Editing matches skipped for verify/create focus
            linkedExistingItems: linkedItems, addedLinks: [], removedLinks: [], selectedItemToLink: ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Create Shirt
        const shirtData = new FormData();
        shirtData.append('name', formData.name);
        shirtData.append('price', formData.price);
        shirtData.append('actual_price', formData.actual_price || 0);
        shirtData.append('cost_price', 0); // Hidden from UI, defaulting to 0
        shirtData.append('description', formData.description);
        shirtData.append('stock', formData.stock);
        shirtData.append('sizes', formData.sizes);
        shirtData.append('category', formData.category);

        // Sanitize variants
        const sanitizedVariants = formData.variants.map(v => ({
            ...v,
            price: v.price === '' ? null : v.price,
            weight: v.weight === '' ? 0 : v.weight,
            length: v.length === '' ? 0 : v.length,
            width: v.width === '' ? 0 : v.width,
            height: v.height === '' ? 0 : v.height,
            quantity: v.quantity === '' ? 0 : v.quantity
        }));
        shirtData.append('variants', JSON.stringify(sanitizedVariants));

        if (formData.image) shirtData.append('image', formData.image);

        try {
            let shirtId;
            if (isEditMode) {
                await api.patch(`/products/${currentProduct.id}/`, shirtData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                shirtId = currentProduct.id;
            } else {
                const res = await api.post('/products/', shirtData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                shirtId = res.data.id;
            }

            // 2. Create Matching Bottoms (Loop)
            const selectedCategory = categories.find(c => c.id == formData.category);
            // Get Bottom and Short categories
            if (selectedCategory && selectedCategory.name === 'Shirt' && formData.hasMatchingBottom) {
                const bottomCategory = categories.find(c => c.name === 'Bottom');
                const shortCategory = categories.find(c => c.name === 'Short');

                if (bottomCategory || shortCategory) {
                    for (const bottom of formData.matchingBottoms) {
                        const bottomData = new FormData();
                        bottomData.append('name', bottom.name);
                        bottomData.append('price', bottom.price || formData.price);
                        bottomData.append('actual_price', bottom.actual_price || formData.actual_price || 0);
                        bottomData.append('cost_price', 0);
                        bottomData.append('description', bottom.description);
                        bottomData.append('stock', bottom.stock || formData.stock);

                        const sanitizedBottomVariants = (bottom.variants || []).map(v => ({
                            ...v,
                            price: v.price === '' ? null : v.price,
                            weight: v.weight === '' ? 0 : v.weight,
                            length: v.length === '' ? 0 : v.length,
                            width: v.width === '' ? 0 : v.width,
                            height: v.height === '' ? 0 : v.height,
                            quantity: v.quantity === '' ? 0 : v.quantity
                        }));
                        bottomData.append('variants', JSON.stringify(sanitizedBottomVariants));

                        // Determine Category: Use selected, or default to Bottom, then Short
                        let targetCategoryId = bottom.category;
                        if (!targetCategoryId) {
                            if (bottomCategory) targetCategoryId = bottomCategory.id;
                            else if (shortCategory) targetCategoryId = shortCategory.id;
                        }

                        if (!targetCategoryId) {
                            alert('No valid category (Bottom/Short) found for matching item.');
                            continue;
                        }

                        bottomData.append('category', targetCategoryId);
                        if (bottom.image && typeof bottom.image !== 'string') {
                            bottomData.append('image', bottom.image);
                        }

                        let bottomId;
                        if (bottom.id && bottom.id.toString().length < 13) { // Simple check if it's a real DB ID (not Date.now timestamp)
                            // Update existing bottom
                            await api.patch(`/products/${bottom.id}/`, bottomData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            bottomId = bottom.id;
                        } else {
                            // Create new bottom
                            const bottomRes = await api.post('/products/', bottomData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            bottomId = bottomRes.data.id;
                        }

                        // 3. Link them (Idempotent check would be good, but for now just ensure link exists)
                        // If it's an update, the link likely exists, but no harm ensuring it.
                        // However, to avoid duplicate errors, we might want to skip if it's an update.
                        // Or better, use a check.
                        try {
                            await api.post('/matching-outfits/', {
                                shirt: shirtId,
                                bottom: bottomId
                            });
                        } catch (linkErr) {
                            // Ignore unique constraint errors if already linked
                        }
                    }
                } else {
                    alert('Neither Bottom nor Short category found! Could not create matching items.');
                }
            }

            // 4. Process Existing Item Links
            const targetCategoryType = getCategoryName(formData.category);
            const isTop = ['Shirt', 'T-Shirt'].includes(targetCategoryType);

            // Handle Additions
            for (const linkId of formData.addedLinks) {
                try {
                    await api.post('/matching-outfits/link/', {
                        shirt_id: isTop ? shirtId : linkId,
                        bottom_id: isTop ? linkId : shirtId
                    });
                } catch (err) {
                    console.error('Error linking existing item:', err);
                }
            }

            // Handle Removals
            for (const linkId of formData.removedLinks) {
                try {
                    await api.post('/matching-outfits/unlink/', {
                        shirt_id: isTop ? shirtId : linkId,
                        bottom_id: isTop ? linkId : shirtId
                    });
                } catch (err) {
                    console.error('Error unlinking existing item:', err);
                }
            }

            setShowModal(false);
            fetchProducts();
            alert(isEditMode ? 'Product Updated!' : 'Product Created!');
        } catch (err) {
            console.error('Operation failed:', err);
            alert('Failed to save product. Check console for details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}/`);
                fetchProducts();
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };

    const isShirtCategorySelected = () => {
        const selected = categories.find(c => c.id == formData.category);
        return selected && selected.name === 'Shirt';
    };

    const isShirtOrTShirt = () => {
        const selected = categories.find(c => c.id == formData.category);
        return selected && (selected.name === 'Shirt' || selected.name === 'T-Shirt');
    };

    // Order State
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [proofFiles, setProofFiles] = useState({});
    const [uploadingItemId, setUploadingItemId] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/');
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const handleShipOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to ship this order with Shiprocket?')) return;
        try {
            const res = await api.post(`/orders/${orderId}/ship/`);
            alert(res.data.status || 'Order Shipped!');
            fetchOrders();
        } catch (err) {
            console.error('Shipping failed:', err);
            alert('Failed to ship order. Check console/backend logs.');
        }
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setProofFiles({});
        setIsOrderModalOpen(true);
    };

    const handleProofFileChange = (orderItemId, file) => {
        setProofFiles(prev => ({ ...prev, [orderItemId]: file }));
    };

    const handleUploadProof = async (orderItemId) => {
        const file = proofFiles[orderItemId];
        if (!file) {
            alert("Select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("order", selectedOrder.id);
        formData.append("order_item", orderItemId);
        formData.append("image", file);

        setUploadingItemId(orderItemId);
        try {
            await api.post('/shipment-proofs/', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Proof uploaded successfully.");
            setProofFiles(prev => {
                const updated = { ...prev };
                delete updated[orderItemId];
                return updated;
            });
            fetchOrders();
            const updatedOrderRes = await api.get(`/orders/${selectedOrder.id}/`);
            setSelectedOrder(updatedOrderRes.data);
        } catch (err) {
            console.error(err);
            alert("Failed to upload proof.");
        } finally {
            setUploadingItemId(null);
        }
    };

    const handleDeleteProof = async (proofId) => {
        if (!window.confirm("Delete this proof?")) return;
        try {
            await api.delete(`/shipment-proofs/${proofId}/`);
            fetchOrders();
            const updatedOrderRes = await api.get(`/orders/${selectedOrder.id}/`);
            setSelectedOrder(updatedOrderRes.data);
        } catch (err) {
            console.error(err);
            alert("Failed to delete proof.");
        }
    };

    const handleMarkAsPacked = async (orderId) => {
        const order = selectedOrder;
        const missing = order.items.some(item => !item.shipment_proofs || item.shipment_proofs.length === 0);
        if (missing) {
            alert("Please upload at least one proof for all items before packing.");
            return;
        }

        try {
            await api.patch(`/orders/${orderId}/`, { status: 'packed' });
            alert("Order marked as packed.");
            fetchOrders();
            setIsOrderModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to mark as packed.");
        }
    };

    // Queries State
    const [queries, setQueries] = useState([]);
    const [queriesFilters, setQueriesFilters] = useState({ start: '', end: '' });

    const fetchQueries = async () => {
        try {
            const res = await api.get('/queries/');
            setQueries(res.data);
        } catch (err) {
            console.error('Error fetching queries:', err);
        }
    };

    const handleResolveQuery = async (queryId) => {
        if (!window.confirm('Are you sure you want to mark this query as resolved?')) return;
        try {
            await api.patch(`/queries/${queryId}/`, { is_resolved: true });
            fetchQueries();
        } catch (err) {
            console.error('Resolve failed:', err);
            alert('Failed to resolve query.');
        }
    };

    // Returns State
    const [returns, setReturns] = useState([]);
    const [returnsFilters, setReturnsFilters] = useState({ start: '', end: '' });

    // Return Review Modal State
    const [selectedReturnForReview, setSelectedReturnForReview] = useState(null);
    const [reviewOrderDetails, setReviewOrderDetails] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const openReviewModal = async (returnReq) => {
        setSelectedReturnForReview(returnReq);
        setIsReviewModalOpen(true);
        setReviewOrderDetails(null);
        try {
            const res = await api.get(`/orders/${returnReq.order}/`);
            setReviewOrderDetails(res.data);
        } catch (err) {
            console.error("Failed to fetch order details for return review", err);
        }
    };

    const fetchReturns = async () => {
        try {
            // Need to import returnAPI at the top, or just use api directly since we are admin
            const res = await api.get('/returns/');
            setReturns(res.data);
        } catch (err) {
            console.error('Error fetching returns:', err);
        }
    };

    const handleApproveReturn = async (returnId) => {
        if (!window.confirm('Are you sure you want to approve this return? This will mark the order as Returned.')) return;
        try {
            const res = await api.post(`/returns/${returnId}/approve/`);
            alert(res.data.status || 'Return Approved!');
            fetchReturns(); // Re-fetch returns
            fetchOrders(); // Re-fetch orders to update counts logic if needed
        } catch (err) {
            console.error('Approve failed:', err);
            alert('Failed to approve return.');
        }
    };

    const handleRejectReturn = async (returnId) => {
        if (!window.confirm('Are you sure you want to reject this return?')) return;
        try {
            const res = await api.post(`/returns/${returnId}/reject/`);
            alert(res.data.status || 'Return Rejected!');
            fetchReturns();
            fetchOrders();
        } catch (err) {
            console.error('Reject failed:', err);
            alert('Failed to reject return.');
        }
    };

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'returns') fetchReturns();
        if (activeTab === 'queries') fetchQueries();
    }, [activeTab]);

    // Filtering Logic
    const getFilteredData = (data, dates) => {
        if (!dates.start && !dates.end) return data;

        const start = dates.start ? new Date(dates.start) : new Date('1970-01-01');
        const end = dates.end ? new Date(dates.end) : new Date();
        end.setHours(23, 59, 59, 999); // Include the whole end day

        return data.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= start && itemDate <= end;
        });
    };

    const filteredProducts = getFilteredData(products, productFilters);
    const filteredOrders = getFilteredData(orders, orderFilters);
    const filteredReturns = getFilteredData(returns, returnsFilters);
    const filteredQueries = getFilteredData(queries, queriesFilters);

    // Export Logic
    const handleExport = () => {
        if (!exportFormat) return;

        let dataToExport;
        let currentFilters;
        let sheetName;

        if (activeTab === 'products') {
            dataToExport = filteredProducts;
            currentFilters = productFilters;
            sheetName = 'Products';
        } else if (activeTab === 'orders') {
            dataToExport = filteredOrders;
            currentFilters = orderFilters;
            sheetName = 'Orders';
        } else if (activeTab === 'returns') {
            dataToExport = filteredReturns;
            currentFilters = returnsFilters;
            sheetName = 'Returns';
        } else if (activeTab === 'queries') {
            dataToExport = filteredQueries;
            currentFilters = queriesFilters;
            sheetName = 'Queries';
        } else {
            return;
        }

        const filename = `guild-store-data_${currentFilters.start || 'all'}_${currentFilters.end || 'all'}`;

        if (exportFormat === 'excel') {
            const ws = XLSX.utils.json_to_sheet(dataToExport.map(item => {
                // Flatten data for export
                if (activeTab === 'orders') {
                    return {
                        'Order ID': item.id,
                        'User': item.user_username,
                        'Date': new Date(item.created_at).toLocaleString(),
                        'Total': item.total_price,
                        'Status': item.status,
                        'Items': item.items.map(i => `${i.quantity}x ${i.product_name}`).join(', ')
                    };
                } else if (activeTab === 'returns') {
                    return {
                        'Request ID': item.id,
                        'Order ID': item.order,
                        'Reason': item.reason,
                        'Status': item.status,
                        'Date': new Date(item.created_at).toLocaleString()
                    };
                } else {
                    return {
                        'Name': item.name,
                        'Price': item.price,
                        'Stock': item.stock,
                        'Category': item.category_name || item.category,
                        'Date Added': new Date(item.created_at).toLocaleString()
                    };
                }
            }));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, `${filename}.xlsx`);
        } else if (exportFormat === 'pdf') {
            const doc = new jsPDF();
            doc.text(`Guild Store Data - ${sheetName}`, 14, 15);

            let tableColumn = [];
            let tableRows = [];

            if (activeTab === 'orders') {
                tableColumn = ["ID", "User", "Date", "Total", "Status"];
                tableRows = dataToExport.map(item => [
                    item.id,
                    item.user_username,
                    new Date(item.created_at).toLocaleDateString(),
                    item.total_price,
                    item.status
                ]);
            } else if (activeTab === 'returns') {
                tableColumn = ["Req ID", "Ord ID", "Reason", "Status", "Date"];
                tableRows = dataToExport.map(item => [
                    item.id,
                    item.order,
                    item.reason,
                    item.status,
                    new Date(item.created_at).toLocaleDateString()
                ]);
            } else {
                tableColumn = ["Name", "Price", "Stock", "Category", "Date Added"];
                tableRows = dataToExport.map(item => [
                    item.name,
                    item.price,
                    item.stock,
                    item.category_name,
                    new Date(item.created_at).toLocaleDateString()
                ]);
            }

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });
            doc.save(`${filename}.pdf`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Store Owner Dashboard</h1>
                {activeTab === 'products' && (
                    <button
                        onClick={openAddModal}
                        className="bg-guild-red text-white px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg hover:bg-red-800 transition-colors w-full md:w-auto">
                        Add Product
                    </button>
                )}
            </div>

            {/* Controls: Tabs, Date Filter, Export */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-gray-200 w-full md:w-auto overflow-x-auto">
                        <button
                            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-guild-red border-b-2 border-guild-red' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('products')}
                        >
                            Products
                        </button>
                        <button
                            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'orders' ? 'text-guild-red border-b-2 border-guild-red' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                        <button
                            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'returns' ? 'text-guild-red border-b-2 border-guild-red' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('returns')}
                        >
                            Returns
                        </button>
                        <button
                            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'queries' ? 'text-guild-red border-b-2 border-guild-red' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('queries')}
                        >
                            Queries
                        </button>
                        <button
                            className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'analytics' ? 'text-guild-red border-b-2 border-guild-red' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            Analytics
                        </button>
                    </div>

                    {/* Filters & Export */}
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
                        <div className="flex gap-2 w-full md:w-auto">
                            {activeTab === 'products' && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border rounded p-2 text-sm w-full md:w-64 pl-8"
                                    />
                                    <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            )}
                            <input
                                type="date"
                                value={activeTab === 'products' ? productFilters.start : activeTab === 'orders' ? orderFilters.start : activeTab === 'returns' ? returnsFilters.start : queriesFilters.start}
                                onChange={(e) => {
                                    if (activeTab === 'products') setProductFilters({ ...productFilters, start: e.target.value });
                                    else if (activeTab === 'orders') setOrderFilters({ ...orderFilters, start: e.target.value });
                                    else if (activeTab === 'returns') setReturnsFilters({ ...returnsFilters, start: e.target.value });
                                    else setQueriesFilters({ ...queriesFilters, start: e.target.value });
                                }}
                                className="border rounded p-2 text-sm w-full md:w-auto"
                                placeholder="From Date"
                            />
                            <input
                                type="date"
                                value={activeTab === 'products' ? productFilters.end : activeTab === 'orders' ? orderFilters.end : activeTab === 'returns' ? returnsFilters.end : queriesFilters.end}
                                onChange={(e) => {
                                    if (activeTab === 'products') setProductFilters({ ...productFilters, end: e.target.value });
                                    else if (activeTab === 'orders') setOrderFilters({ ...orderFilters, end: e.target.value });
                                    else if (activeTab === 'returns') setReturnsFilters({ ...returnsFilters, end: e.target.value });
                                    else setQueriesFilters({ ...queriesFilters, end: e.target.value });
                                }}
                                className="border rounded p-2 text-sm w-full md:w-auto"
                                placeholder="To Date"
                            />
                        </div>

                        {activeTab === 'orders' && (
                            <div className="flex gap-2 w-full md:w-auto">
                                <select
                                    className="border rounded p-2 text-sm w-full md:w-auto"
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                >
                                    <option value="">Export To</option>
                                    <option value="excel">Excel</option>
                                    <option value="pdf">PDF</option>
                                </select>
                                <button
                                    onClick={handleExport}
                                    disabled={!exportFormat}
                                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black disabled:bg-gray-400 w-full md:w-auto"
                                >
                                    Export
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Table */}
            {activeTab === 'products' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => openEditModal(product)} className="text-guild-red hover:text-red-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No products found in this date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Table */}
            {activeTab === 'orders' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_username || 'Unknown'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total_price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <ul className="list-disc list-inside">
                                                {order.items.map(item => (
                                                    <li key={item.id}>{item.quantity} x {item.product_name} ({item.size})</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => openOrderModal(order)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                View Details
                                            </button>
                                            {order.status === 'placed' && (
                                                <span className="text-xs text-gray-500 italic block mt-1">Awaiting Dispatch</span>
                                            )}
                                            {order.status === 'shipped' && order.awb_code && (
                                                <span className="text-xs text-gray-500 block mt-1">AWB: {order.awb_code}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No orders found in this date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Returns Table */}
            {activeTab === 'returns' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Req ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReturns.map((returnReq) => (
                                    <tr key={returnReq.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{returnReq.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{returnReq.order}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{returnReq.reason.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={returnReq.description}>
                                            {returnReq.description || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {returnReq.image ? (
                                                <a href={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${returnReq.image}`} target="_blank" rel="noopener noreferrer" className="text-guild-red hover:underline flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${returnReq.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    returnReq.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {returnReq.status.charAt(0).toUpperCase() + returnReq.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(returnReq.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {returnReq.status === 'pending' && (
                                                <button
                                                    onClick={() => openReviewModal(returnReq)}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-800 font-medium whitespace-nowrap"
                                                >
                                                    Review Request
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredReturns.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No return requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Queries Table */}
            {activeTab === 'queries' && (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredQueries.map((query) => (
                                    <tr key={query.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(query.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{query.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{query.email}</div>
                                            <div>{query.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{query.query}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${query.is_resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {query.is_resolved ? 'Resolved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!query.is_resolved && (
                                                <button onClick={() => handleResolveQuery(query.id)} className="text-guild-red hover:text-red-900 font-bold">Mark Resolved</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredQueries.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No user queries found in this date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Custom Background for Analytics strictly when active */}
            {activeTab === 'analytics' && (
                <div className="fixed inset-0 min-h-screen bg-gray-50 z-[-1] transition-colors duration-500">
                    {/* Subtle colorful gradients for glassmorphism backdrop */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analyticsData && (
                <div className="space-y-6 relative z-10 pb-12">
                    {/* Controls Bar */}
                    <div className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <select
                                value={analyticsRange}
                                onChange={(e) => setAnalyticsRange(e.target.value)}
                                className="bg-white/50 border border-gray-200 text-gray-800 rounded-lg p-2 font-medium focus:ring-2 focus:ring-guild-red focus:outline-none backdrop-blur-sm"
                            >
                                <option value="today">Today</option>
                                <option value="last_2_days">Last 2 Days</option>
                                <option value="weekly">This Week</option>
                                <option value="monthly">This Month</option>
                                <option value="yearly">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                            {analyticsRange === 'custom' && (
                                <div className="flex gap-2 items-center">
                                    <input type="date" value={customAnalyticsDates.start} onChange={(e) => setCustomAnalyticsDates({ ...customAnalyticsDates, start: e.target.value })} className="bg-white/50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700" />
                                    <span className="text-gray-400">-</span>
                                    <input type="date" value={customAnalyticsDates.end} onChange={(e) => setCustomAnalyticsDates({ ...customAnalyticsDates, end: e.target.value })} className="bg-white/50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700" />
                                </div>
                            )}
                        </div>
                        <button onClick={fetchAnalytics} className="flex items-center gap-2 bg-gradient-to-r from-guild-red to-red-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transform transition active:scale-95 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh Data
                        </button>
                    </div>

                    {/* KPI Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { title: 'Total Revenue', value: `₹${analyticsData.total_sales.toLocaleString()}`, color: 'from-blue-500 to-blue-600', text: 'text-blue-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { title: 'Net Profit', value: `₹${analyticsData.profit.toLocaleString()}`, color: 'from-green-500 to-green-600', text: 'text-green-600', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                            { title: 'Profit Margin', value: `${analyticsData.profit_margin}%`, color: 'from-purple-500 to-purple-600', text: 'text-purple-600', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
                            { title: 'Average Order Value', value: `₹${analyticsData.average_order_value}`, color: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                            { title: 'Total Orders', value: analyticsData.total_orders, color: 'from-rose-500 to-rose-600', text: 'text-rose-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                        ].map((kpi, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 transition-all hover:-translate-y-1 hover:shadow-xl group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-gray-500 font-semibold text-sm tracking-wide">{kpi.title}</h3>
                                    <div className={`p-2 rounded-lg bg-opacity-10 group-hover:bg-opacity-20 transition ${kpi.text.replace('text', 'bg')}`}>
                                        <svg className={`w-5 h-5 ${kpi.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={kpi.icon} /></svg>
                                    </div>
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">{kpi.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Trends */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 lg:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Revenue & Profit Trends</h3>
                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
                            </div>
                            <RevenueTrendsChart data={analyticsData.sales_over_time} />
                        </div>

                        {/* Customer Distribution */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Customer Geography</h3>
                                <p className="text-sm text-gray-500">Sales by geographic region</p>
                            </div>
                            <StateDistributionChart data={analyticsData.state_distribution} />
                        </div>
                    </div>

                    {/* Secondary Metrics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Category Sales */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Product Categories</h3>
                            <CategorySalesChart data={analyticsData.category_sales} />
                        </div>

                        {/* Order Status Breakdown */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Status</h3>
                            <OrderStatusDoughnut data={analyticsData.status_breakdown} />
                            <div className="mt-4 text-center">
                                <span className="text-sm text-gray-500 font-medium bg-gray-100/50 px-4 py-1.5 rounded-full inline-block mt-2 backdrop-blur-sm">
                                    Conv. Rate: <strong className="text-gray-800">{analyticsData.conversion_rate}%</strong>
                                </span>
                            </div>
                        </div>

                        {/* Top Selling Products List */}
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                Top Sellers
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                {analyticsData.top_products.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 transition">
                                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                                            <img src={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}/media/${item.product__image}`} alt={item.product__name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">{item.product__name}</p>
                                            <p className="text-xs text-gray-500">Revenue: ₹{item.revenue}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-black text-guild-red">{item.total_sold}</span>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Sold</p>
                                        </div>
                                    </div>
                                ))}
                                {analyticsData.top_products.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Not enough data to determine top sellers yet.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Alerts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Low Stock Alerts */}
                        <div className="bg-orange-50/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgba(249,115,22,0.1)] border border-orange-100">
                            <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                                Low Stock Alerts
                            </h3>
                            <div className="space-y-3">
                                {analyticsData.low_stock.map((item) => (
                                    <div key={`low-${item.id}`} className="flex justify-between items-center bg-white/60 p-3 rounded-xl shadow-sm border border-orange-50">
                                        <span className="font-semibold text-gray-800 text-sm truncate pr-4">{item.name}</span>
                                        <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full whitespace-nowrap">{item.stock} left</span>
                                    </div>
                                ))}
                                {analyticsData.low_stock.length === 0 && <p className="text-sm text-orange-600 italic">All items are sufficiently stocked.</p>}
                            </div>
                        </div>

                        {/* Out of Stock Alerts */}
                        <div className="bg-red-50/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.1)] border border-red-100">
                            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Out of Stock
                            </h3>
                            <div className="space-y-3">
                                {analyticsData.out_of_stock.map((item) => (
                                    <div key={`out-${item.id}`} className="flex justify-between items-center bg-white/60 p-3 rounded-xl shadow-sm border border-red-50">
                                        <span className="font-semibold text-gray-800 text-sm truncate pr-4 line-through opacity-70">{item.name}</span>
                                        <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full whitespace-nowrap">Empty</span>
                                    </div>
                                ))}
                                {analyticsData.out_of_stock.length === 0 && <p className="text-sm text-green-600 italic">No products currently out of stock. Great job!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">


                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    required
                                    disabled={isEditMode}
                                >
                                    {!isEditMode && <option value="">Select Category</option>}
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.category && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                            <input name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Actual Price (MRP)</label>
                                            <input name="actual_price" type="number" step="0.01" value={formData.actual_price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                                            <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size Variants (Quantity & Dimensions)</label>
                                        <div className="border rounded-md overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight (grams)</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">L (cm)</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">W (cm)</th>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">H (cm)</th>
                                                        <th className="px-3 py-2"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {formData.variants.map((variant, index) => (
                                                        <tr key={index}>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="text"
                                                                    value={variant.size}
                                                                    onChange={e => handleVariantChange(index, 'size', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="number"
                                                                    value={variant.quantity}
                                                                    onChange={e => handleVariantChange(index, 'quantity', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="number" step="0.01"
                                                                    value={variant.weight}
                                                                    onChange={e => handleVariantChange(index, 'weight', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="number" step="0.01"
                                                                    value={variant.length || ''}
                                                                    onChange={e => handleVariantChange(index, 'length', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="number" step="0.01"
                                                                    value={variant.width || ''}
                                                                    onChange={e => handleVariantChange(index, 'width', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 min-w-[80px]">
                                                                <input
                                                                    type="number" step="0.01"
                                                                    value={variant.height || ''}
                                                                    onChange={e => handleVariantChange(index, 'height', e.target.value)}
                                                                    className="w-full border-gray-300 rounded-md text-sm"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 text-center">
                                                                <button type="button" onClick={() => removeVariant(index)} className="text-red-600 hover:text-red-900">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button type="button" onClick={addVariant} className="w-full py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 text-sm font-medium border-t border-gray-200">
                                                + Add Size Variant
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows="2" required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                        <input type="file" onChange={handleFileChange} className="mt-1 block w-full" accept="image/*" required={!isEditMode} />
                                    </div>

                                    {/* Matching Item Section */}
                                    {!isEditMode && (['Shirt', 'T-Shirt', 'Bottom', 'Short', 'Lower'].includes(getCategoryName(formData.category))) && (
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                Matching {getTargetCategoryForMatching()}s
                                            </h3>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Add Matching {getTargetCategoryForMatching()}?
                                                </label>
                                                <select onChange={toggleMatchingBottom} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                                    <option value="no">Not Available</option>
                                                    <option value="yes">Available</option>
                                                </select>
                                            </div>

                                            {formData.hasMatchingBottom && (
                                                <div className="space-y-6">
                                                    {formData.matchingBottoms.map((bottom, index) => (
                                                        <div key={bottom.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                                                            <div className="flex justify-between mb-2">
                                                                <h4 className="font-medium text-gray-700">Matching {getTargetCategoryForMatching()} #{index + 1}</h4>
                                                                <button type="button" onClick={() => removeMatchingBottom(bottom.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                                                    <input value={bottom.name} onChange={(e) => handleMatchingBottomChange(bottom.id, 'name', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Actual Price (MRP)</label>
                                                                    <input type="number" step="0.01" value={bottom.actual_price || ''} onChange={(e) => handleMatchingBottomChange(bottom.id, 'actual_price', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="MRP" required />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Selling Price</label>
                                                                    <input type="number" step="0.01" value={bottom.price} onChange={(e) => handleMatchingBottomChange(bottom.id, 'price', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Sale Price" required />
                                                                </div>
                                                            </div>

                                                            <div className="mt-2">
                                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                                <textarea value={bottom.description} onChange={(e) => handleMatchingBottomChange(bottom.id, 'description', e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows="2" required />
                                                            </div>

                                                            <div className="mt-4 border rounded-md overflow-x-auto">
                                                                <label className="block text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 border-b">Size Variants (Quantity & Dimensions)</label>
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight (grams)</th>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">L (cm)</th>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">W (cm)</th>
                                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">H (cm)</th>
                                                                            <th className="px-3 py-2"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {(bottom.variants || []).map((variant, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={variant.size}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'size', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="number"
                                                                                        value={variant.quantity}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'quantity', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="number" step="0.01"
                                                                                        value={variant.weight}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'weight', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="number" step="0.01"
                                                                                        value={variant.length || ''}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'length', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="number" step="0.01"
                                                                                        value={variant.width || ''}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'width', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-sm min-w-[80px]">
                                                                                    <input
                                                                                        type="number" step="0.01"
                                                                                        value={variant.height || ''}
                                                                                        onChange={e => handleMatchingVariantChange(bottom.id, idx, 'height', e.target.value)}
                                                                                        className="w-full border-gray-300 rounded-md text-sm"
                                                                                        required
                                                                                    />
                                                                                </td>
                                                                                <td className="px-3 py-2 text-center text-sm">
                                                                                    <button type="button" onClick={() => removeMatchingVariant(bottom.id, idx)} className="text-red-600 hover:text-red-900">
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <button type="button" onClick={() => addMatchingVariant(bottom.id)} className="w-full py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 text-sm font-medium border-t border-gray-200">
                                                                    + Add Size Variant
                                                                </button>
                                                            </div>

                                                            <div className="mt-2">
                                                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                                                <input type="file" onChange={(e) => handleMatchingBottomFileChange(bottom.id, e.target.files[0])} className="mt-1 block w-full" accept="image/*" required />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <button type="button" onClick={addMatchingBottom} className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-800 transition-colors">
                                                        + Add One More Item
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Linked Existing Items Section */}
                                    {['Shirt', 'T-Shirt', 'Bottom', 'Short', 'Lower'].includes(getCategoryName(formData.category)) && (
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Linked Existing Items</h3>

                                            <ul className="mb-4">
                                                {formData.linkedExistingItems.map(item => (
                                                    <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 mb-2 rounded border border-gray-200">
                                                        <span className="text-sm font-medium text-gray-800">{item.name}</span>
                                                        <button type="button" onClick={() => handleRemoveExistingLink(item.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                                                    </li>
                                                ))}
                                                {formData.linkedExistingItems.length === 0 && (
                                                    <li className="text-sm text-gray-500 italic">No existing items linked.</li>
                                                )}
                                            </ul>

                                            <div className="flex gap-2">
                                                <select value={formData.selectedItemToLink} onChange={handleInputChange} name="selectedItemToLink" className="border border-gray-300 rounded p-2 flex-grow text-sm">
                                                    <option value="">-- Select Existing Product to Link --</option>
                                                    {products
                                                        .filter(p => p.id !== (currentProduct?.id) && !formData.linkedExistingItems.find(li => li.id === p.id))
                                                        .filter(p => {
                                                            const currentCat = getCategoryName(formData.category);
                                                            const targetCats = ['Shirt', 'T-Shirt'].includes(currentCat) ? ['Bottom', 'Short', 'Lower'] : ['Shirt', 'T-Shirt'];
                                                            return targetCats.includes(p.category_name);
                                                        })
                                                        .map(p => (
                                                            <option key={p.id} value={p.id}>{p.name} ({p.category_name})</option>
                                                        ))}
                                                </select>
                                                <button type="button" onClick={handleAddExistingLink} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black whitespace-nowrap">Add Link</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-guild-red text-white rounded-lg hover:bg-red-800">{isEditMode ? 'Update' : 'Create'}</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
            {/* Order Details Modal for Pre-Shipment Proofs */}
            {isOrderModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* existing order modal contents... skipping for brevity and replacing effectively... wait, no! I can't overwrite this block with a summary. I must append below it! */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
                            <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                            <div><strong>User:</strong> {selectedOrder.user_username}</div>
                            <div><strong>Status:</strong> <span className="uppercase font-semibold">{selectedOrder.status}</span></div>
                            <div><strong>Total Price:</strong> ₹{selectedOrder.total_price}</div>
                            <div><strong>Shipping:</strong> {selectedOrder.shipping_city}, {selectedOrder.shipping_state}</div>
                        </div>

                        <h3 className="text-lg font-bold mb-3 border-b pb-2">Items & Pre-Shipment Product Proofs</h3>
                        <div className="space-y-6">
                            {selectedOrder.items.map(item => (
                                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex gap-4 items-start">
                                        <img src={`${import.meta.env.VITE_MEDIA_URL}${item.product_image}`} alt={item.product_name} className="w-20 h-20 object-cover rounded shadow" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold">{item.product_name}</h4>
                                            <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity} | ₹{item.price}</p>

                                            {/* Proofs Section */}
                                            <div className="mt-3">
                                                <p className="text-sm font-semibold mb-2">Uploaded Proofs:</p>
                                                {item.shipment_proofs && item.shipment_proofs.length > 0 ? (
                                                    <div className="flex gap-2 flex-wrap mb-3">
                                                        {item.shipment_proofs.map(proof => (
                                                            <div key={proof.id} className="relative group">
                                                                <img src={`${import.meta.env.VITE_MEDIA_URL}${proof.image}`} alt="Proof" className="w-24 h-24 object-cover rounded border border-gray-300" />
                                                                <button
                                                                    onClick={() => handleDeleteProof(proof.id)}
                                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Delete Proof"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500 italic mb-2">No proofs uploaded yet.</p>
                                                )}

                                                {(!item.shipment_proofs || item.shipment_proofs.length < 3) && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleProofFileChange(item.id, e.target.files[0])}
                                                            className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                                                        />
                                                        <button
                                                            onClick={() => handleUploadProof(item.id)}
                                                            disabled={uploadingItemId === item.id || !proofFiles[item.id]}
                                                            className="bg-guild-red text-white px-3 py-1 rounded text-sm hover:bg-red-800 disabled:bg-gray-400"
                                                        >
                                                            {uploadingItemId === item.id ? 'Uploading...' : 'Upload'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                            {selectedOrder.status === 'placed' && (
                                <button
                                    onClick={() => handleMarkAsPacked(selectedOrder.id)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-800 font-medium"
                                >
                                    Mark as Packed
                                </button>
                            )}
                            <button onClick={() => setIsOrderModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return Review Modal for Quality Comparison */}
            {isReviewModalOpen && selectedReturnForReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Review Return #{selectedReturnForReview.id} (Order #{selectedReturnForReview.order})</h2>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Customer Claim</h3>
                                <p className="text-sm"><strong>Reason:</strong> <span className="capitalize">{selectedReturnForReview.reason.replace('_', ' ')}</span></p>
                                <p className="text-sm mt-1"><strong>Description:</strong> {selectedReturnForReview.description || 'No description provided'}</p>
                            </div>
                            <div>
                                {selectedReturnForReview.image ? (
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm font-semibold mb-2">Customer Uploaded Photo:</p>
                                        <a href={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${selectedReturnForReview.image}`} target="_blank" rel="noopener noreferrer">
                                            <img src={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${selectedReturnForReview.image}`} alt="Customer Proof" className="max-h-40 object-contain rounded border shadow-sm" />
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No image provided by customer.</p>
                                )}
                            </div>
                        </div>

                        {reviewOrderDetails ? (
                            <div>
                                <h3 className="text-lg font-bold mb-3 border-b pb-2">Admin Pre-Shipment Proofs</h3>
                                {reviewOrderDetails.items.map(item => (
                                    <div key={item.id} className="mb-4">
                                        <h4 className="font-semibold text-sm mb-2">{item.product_name} (Size: {item.size})</h4>
                                        {item.shipment_proofs && item.shipment_proofs.length > 0 ? (
                                            <div className="flex gap-4 overflow-x-auto pb-2">
                                                {item.shipment_proofs.map(proof => (
                                                    <a key={proof.id} href={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${proof.image}`} target="_blank" rel="noopener noreferrer">
                                                        <img src={`${import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000'}${proof.image}`} alt="Admin Proof" className="h-32 w-32 object-cover rounded border shadow-sm" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No pre-shipment proofs found for this item.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="text-sm text-gray-500 mt-2">Loading order details...</p>
                            </div>
                        )}

                        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    handleRejectReturn(selectedReturnForReview.id);
                                    setIsReviewModalOpen(false);
                                }}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800 font-medium"
                            >
                                Reject Return
                            </button>
                            <button
                                onClick={() => {
                                    handleApproveReturn(selectedReturnForReview.id);
                                    setIsReviewModalOpen(false);
                                }}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800 font-medium"
                            >
                                Approve Return
                            </button>
                            <button onClick={() => setIsReviewModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
