import React, { useState } from 'react';
import { Upload, X, Plus, Minus, Image, ChevronRight } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

import Breadcrumb from '../../ui/Breadcrumb';

const AddDishForm = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const [formData, setFormData] = useState({
        name: '',
        category: 'veg',
        subCategory: '',
        mealType: 'normal',
        description: '',
        tags: [],
        isAvailable: true,
    });

    const [subCategories, setSubCategories] = useState([]);

    const [quantities, setQuantities] = useState([
        { size: '', price: '', discountPrice: '' }
    ]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);


    // Fetch subcategories on mount
    React.useEffect(() => {
        fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await axiosClient.get('/api/v1/subcategory/all');
            if (response.data.success) {
                setSubCategories(response.data.data);
            }
        } catch (error) {
            showSnackbar('Failed to load subcategories', 'error');
        }
    };

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showSnackbar('Image size should be less than 2MB', 'error');
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleQuantityChange = (index, field, value) => {
        const newQuantities = [...quantities];
        newQuantities[index][field] = value;

        // If discount price is greater than price, show warning
        if (field === 'discountPrice' || field === 'price') {
            const price = parseFloat(field === 'price' ? value : newQuantities[index].price) || 0;
            const discountPrice = parseFloat(field === 'discountPrice' ? value : newQuantities[index].discountPrice) || 0;

            if (discountPrice > 0 && discountPrice >= price) {
                showSnackbar('Discount price should be less than regular price', 'warning');
            }
        }

        setQuantities(newQuantities);
    };

    const addQuantity = () => {
        setQuantities([...quantities, { size: '', price: '', discountPrice: '' }]);
    };

    const removeQuantity = (index) => {
        if (quantities.length > 1) {
            setQuantities(quantities.filter((_, i) => i !== index));
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const calculateDiscount = (price, discountPrice) => {
        if (!price || !discountPrice || discountPrice >= price) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            showSnackbar('Please upload a dish image', 'error');
            return;
        }

        const validQuantities = quantities.filter(q => q.size && q.price);
        if (validQuantities.length === 0) {
            showSnackbar('Please add at least one quantity with size and price', 'error');
            return;
        }

        // Validate discount prices
        for (let q of validQuantities) {
            if (q.discountPrice && parseFloat(q.discountPrice) >= parseFloat(q.price)) {
                showSnackbar('Discount price must be less than regular price', 'error');
                return;
            }
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('image', image);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('subCategory', formData.subCategory);
            formDataToSend.append('mealType', formData.mealType);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('isAvailable', formData.isAvailable);

            // Format quantities to match backend expectations
            const formattedQuantities = validQuantities.map(q => ({
                size: q.size,
                price: parseFloat(q.price),
                discountPrice: q.discountPrice ? parseFloat(q.discountPrice) : 0
            }));

            formDataToSend.append('quantities', JSON.stringify(formattedQuantities));
            formDataToSend.append('tags', JSON.stringify(formData.tags));

            const response = await axiosClient.post('/api/v1/dishes/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                showSnackbar('Dish created successfully!', 'success');
                resetForm();
            } else {
                showSnackbar(response.data.message || 'Failed to create dish', 'error');
            }
        } catch (error) {
            showSnackbar('An error occurred while creating the dish', 'error');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'veg',
            subCategory: '',
            mealType: 'normal',
            description: '',
            tags: [],
            isAvailable: true,
        });
        setQuantities([{ size: '', price: '', discountPrice: '' }]);
        setImage(null);
        setImagePreview(null);
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Dish', href: '/admin/dishes/all' },
                    { label: 'Add Dish' }
                ]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">

                        {/* Image Upload - Large Featured Box */}
                        <div className="lg:col-span-5 lg:row-span-2 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dish Image *</h3>
                            <div className="h-full flex items-center justify-center">
                                <div className="w-full">
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 transition-colors overflow-hidden bg-gray-50">
                                        {imagePreview ? (
                                            <div className="relative aspect-square">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="aspect-square flex flex-col items-center justify-center p-8">
                                                <Image className="h-16 w-16 text-gray-400 mb-4" />
                                                <label className="cursor-pointer">
                                                    <span className="text-orange-500 hover:text-orange-600 font-medium text-lg">Upload Image</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 2MB (1:1 ratio)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name - Wide Box */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Dish Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                                placeholder="Enter delicious dish name"
                            />
                        </div>

                        {/* Category, SubCategory, Meal Type */}
                        <div className="lg:col-span-4 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Category *
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="veg"
                                        checked={formData.category === 'veg'}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 font-medium">Veg</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="non-veg"
                                        checked={formData.category === 'non-veg'}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-orange-500 focus:ring-2 focus:ring-orange-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 font-medium">Non-Veg</span>
                                </label>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Sub Category *
                            </label>
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((subCat) => (
                                    <option key={subCat._id || subCat.id} value={subCat._id || subCat.id}>
                                        {subCat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Meal Type - Medium Box */}
                        <div className="lg:col-span-4 bg-linear-to-br from-third to-third/55 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-white">
                            <label className="block text-sm font-semibold mb-3">
                                Meal Type
                            </label>
                            <select
                                name="mealType"
                                value={formData.mealType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 text-white focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm"
                            >
                                <option value="normal" className="text-gray-900">Normal</option>
                                <option value="special" className="text-gray-900">Special</option>
                                <option value="gym" className="text-gray-900">Gym</option>
                            </select>
                        </div>

                        {/* Quantities with Discount - Tall Box */}
                        <div className="lg:col-span-7 lg:row-span-2 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Quantities & Pricing *</h3>
                                <button
                                    type="button"
                                    onClick={addQuantity}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <Plus size={18} /> Add
                                </button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {quantities.map((quantity, index) => {
                                    const discount = calculateDiscount(quantity.price, quantity.discountPrice);
                                    return (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={quantity.size}
                                                    onChange={(e) => handleQuantityChange(index, 'size', e.target.value)}
                                                    placeholder="Size (e.g., Quarter, Half, Full)"
                                                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuantity(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    disabled={quantities.length === 1}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Regular Price *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={quantity.price}
                                                        onChange={(e) => handleQuantityChange(index, 'price', e.target.value)}
                                                        placeholder="₹ 0"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Discount Price (Optional)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={quantity.discountPrice}
                                                        onChange={(e) => handleQuantityChange(index, 'discountPrice', e.target.value)}
                                                        placeholder="₹ 0"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            {discount > 0 && (
                                                <div className="mt-2 flex items-center gap-2 text-sm">
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                                        {discount}% OFF
                                                    </span>
                                                    <span className="text-gray-600">
                                                        Save ₹{(quantity.price - quantity.discountPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Description - Large Box */}
                        <div className="lg:col-span-5 lg:row-span-2 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <label className="block text-sm font-semibold text-gray-800 mb-3">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="8"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                placeholder="Describe your delicious dish..."
                            />
                        </div>

                        {/* Tags - Wide Box */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Add tag and press Enter"
                                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-6 py-2 bg-third text-white rounded-lg hover:bg-third/80 transition-opacity"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:opacity-80"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Availability Toggle - Small Box */}
                        <div className="lg:col-span-5 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between h-full">
                                <div className="text-white">
                                    <h3 className="text-lg font-semibold mb-1">Availability</h3>
                                    <p className="text-white/80 text-sm">Is this dish available?</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons - Wide Box */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex gap-4 h-full items-center">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 text-white py-4 px-6 rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? 'Creating Dish...' : 'Create Dish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <AlertSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    duration={4000}
                    onClose={handleClose}
                    position={{ vertical: "top", horizontal: "right" }}
                />

                <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>
            </div>
        </>
    );
};

export default AddDishForm;