import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, addressAPI } from '../services/api';
import { useModal } from '../context/ModalContext';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Phone edit state
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    
    // Address Modal states
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({
        id: null,
        full_name: '',
        phone_number: '',
        house_name: '',
        street_area: '',
        landmark: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        address_type: 'home',
        is_default: false,
    });
    
    const navigate = useNavigate();
    const { showModal, showAlert, showConfirm } = useModal();

    const fetchProfileAndAddresses = async () => {
        try {
            const profileRes = await profileAPI.getProfile();
            setProfile(profileRes.data);
            setPhoneInput(profileRes.data.phone_number || '');
            
            const addressRes = await addressAPI.getAddresses();
            setAddresses(addressRes.data);
        } catch (err) {
            console.error("Failed to load profile details:", err);
            showAlert({
                title: 'Authentication Required',
                message: 'Please login to access your profile dashboard.',
                type: 'error'
            });
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileAndAddresses();
    }, []);

    const handleSavePhone = async () => {
        if (!phoneInput || phoneInput.length < 10) {
            showAlert({ title: 'Invalid Phone Number', message: 'Please enter a valid 10-digit phone number.', type: 'warning' });
            return;
        }
        try {
            const res = await profileAPI.updateProfile(phoneInput);
            setProfile(res.data);
            setIsEditingPhone(false);
            showAlert({ title: 'Profile Updated', message: 'Phone number updated successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            showAlert({ title: 'Update Failed', message: 'Failed to update phone number.', type: 'error' });
        }
    };

    const handleOpenAddModal = () => {
        setAddressForm({
            id: null,
            full_name: '',
            phone_number: '',
            house_name: '',
            street_area: '',
            landmark: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            address_type: 'home',
            is_default: false,
        });
        setIsAddressModalOpen(true);
    };

    const handleOpenEditModal = (addr) => {
        setAddressForm({
            id: addr.id,
            full_name: addr.full_name,
            phone_number: addr.phone_number,
            house_name: addr.house_name,
            street_area: addr.street_area,
            landmark: addr.landmark || '',
            city: addr.city,
            state: addr.state,
            country: addr.country || 'India',
            pincode: addr.pincode,
            address_type: addr.address_type,
            is_default: addr.is_default,
        });
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const { full_name, phone_number, house_name, street_area, city, state, pincode } = addressForm;
        if (!full_name || !phone_number || !house_name || !street_area || !city || !state || !pincode) {
            showAlert({ title: 'Missing Information', message: 'Please fill out all mandatory fields.', type: 'warning' });
            return;
        }
        try {
            if (addressForm.id) {
                // Edit
                await addressAPI.editAddress(addressForm.id, addressForm);
            } else {
                // Add
                await addressAPI.addAddress(addressForm);
            }
            setIsAddressModalOpen(false);
            fetchProfileAndAddresses();
            showAlert({ title: 'Address Saved', message: 'Address details saved successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            showAlert({ title: 'Save Failed', message: 'Failed to save address details.', type: 'error' });
        }
    };

    const handleDeleteAddress = async (id) => {
        const confirmed = await showConfirm({
            title: 'Delete Address',
            message: 'Are you sure you want to delete this address?',
            type: 'danger',
            confirmText: 'Delete Address',
            isDanger: true,
        });
        if (!confirmed) return;
        try {
            await addressAPI.deleteAddress(id);
            fetchProfileAndAddresses();
            showAlert({ title: 'Address Deleted', message: 'Address removed successfully.', type: 'success' });
        } catch (err) {
            console.error(err);
            showAlert({ title: 'Delete Failed', message: 'Failed to delete address.', type: 'error' });
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await addressAPI.setDefault(id);
            fetchProfileAndAddresses();
            showAlert({ title: 'Default Updated', message: 'Default shipping address updated successfully.', type: 'success' });
        } catch (err) {
            console.error(err);
            showAlert({ title: 'Update Failed', message: 'Failed to update default address.', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-guild-red"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                        <svg className="w-5 h-5 text-guild-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Details
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                            <p className="text-base font-semibold text-gray-800 mt-1">{profile?.username}</p>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <p className="text-base font-semibold text-gray-800 mt-1">{profile?.email}</p>
                        </div>
                        
                        <div className="pt-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                            {isEditingPhone ? (
                                <div className="mt-2 flex gap-2">
                                    <input
                                        type="text"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                                        maxLength="12"
                                        placeholder="Enter Phone Number"
                                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-guild-red focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={handleSavePhone}
                                        className="bg-guild-red hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPhoneInput(profile?.phone_number || '');
                                            setIsEditingPhone(false);
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-base font-semibold text-gray-800">
                                        {profile?.phone_number ? profile.phone_number : <span className="text-gray-400 italic font-normal">Not Provided</span>}
                                    </p>
                                    <button
                                        onClick={() => setIsEditingPhone(true)}
                                        className="text-xs font-bold text-guild-red hover:underline"
                                    >
                                        {profile?.phone_number ? 'Edit' : 'Add Phone'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Book */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b pb-3">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-guild-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Address Book
                            </h2>
                            <button
                                onClick={handleOpenAddModal}
                                className="bg-guild-red hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Address
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                                <p className="text-neutral-500 font-medium">No saved addresses found. Add one to speed up checkout!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <div 
                                        key={addr.id} 
                                        className={`rounded-2xl p-5 border transition-all duration-300 relative ${addr.is_default ? 'border-guild-red bg-red-50/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                    >
                                        {/* Default badge */}
                                        {addr.is_default && (
                                            <span className="absolute top-4 right-4 bg-guild-red text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
                                                Default
                                            </span>
                                        )}
                                        
                                        <div className="pr-12">
                                            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                                                {addr.full_name}
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 rounded-md px-1.5 py-0.5 capitalize">
                                                    {addr.address_type}
                                                </span>
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 mt-2">PHONE</p>
                                            <p className="text-sm font-semibold text-gray-800">{addr.phone_number}</p>
                                            
                                            <p className="text-xs font-bold text-gray-400 mt-2.5">ADDRESS</p>
                                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                {addr.house_name}, {addr.street_area}
                                                {addr.landmark && <span className="block text-xs text-gray-500 mt-0.5">Landmark: {addr.landmark}</span>}
                                            </p>
                                            <p className="text-sm text-gray-700 font-semibold mt-1">
                                                {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                        </div>

                                        {/* Actions footer */}
                                        <div className="mt-5 pt-3.5 border-t border-neutral-100 flex flex-wrap gap-3">
                                            {!addr.is_default && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    className="text-xs font-bold text-guild-red hover:underline"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenEditModal(addr)}
                                                className="text-xs font-bold text-gray-600 hover:text-gray-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="text-xs font-bold text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add / Edit Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        <div className="flex justify-between items-center mb-5 border-b pb-3.5">
                            <h2 className="text-lg font-bold text-gray-900">
                                {addressForm.id ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button 
                                onClick={() => setIsAddressModalOpen(false)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.full_name}
                                        onChange={(e) => setAddressForm({...addressForm, full_name: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.phone_number}
                                        onChange={(e) => setAddressForm({...addressForm, phone_number: e.target.value.replace(/\D/g, '')})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">House / Flat / Building Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.house_name}
                                    onChange={(e) => setAddressForm({...addressForm, house_name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Street / Area / Locality *</label>
                                <input
                                    type="text"
                                    required
                                    value={addressForm.street_area}
                                    onChange={(e) => setAddressForm({...addressForm, street_area: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    value={addressForm.landmark}
                                    onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">State *</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Pincode *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={addressForm.pincode}
                                        onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, '')})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Address Type *</label>
                                    <select
                                        value={addressForm.address_type}
                                        onChange={(e) => setAddressForm({...addressForm, address_type: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-guild-red"
                                    >
                                        <option value="home">Home</option>
                                        <option value="work">Work</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-5">
                                    <input
                                        type="checkbox"
                                        id="defaultAddressCheckbox"
                                        checked={addressForm.is_default}
                                        onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                                        className="w-4 h-4 text-guild-red focus:ring-guild-red rounded"
                                    />
                                    <label htmlFor="defaultAddressCheckbox" className="text-xs font-bold text-gray-600 select-none cursor-pointer">
                                        Set as Default
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-guild-red hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;