import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';
import { RippleLoader } from '../../ui/Loader';

const UpdateTiffinForm = ({ onSuccess, onCancel }) => {
    const id = useParams().id;
    const [tiffinLoading, setTiffinLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        menu: '',
        pricing: {
            oneTime: { price: '', discount: '' },
            monthly: {
                oneTime: { price: '', discount: '' },
                twoTime: { price: '', discount: '' },
                threeTime: { price: '', discount: '' }
            },
            quarterly: {
                oneTime: { price: '', discount: '' },
                twoTime: { price: '', discount: '' },
                threeTime: { price: '', discount: '' }
            },
            halfYearly: {
                oneTime: { price: '', discount: '' },
                twoTime: { price: '', discount: '' },
                threeTime: { price: '', discount: '' }
            },
            annual: {
                oneTime: { price: '', discount: '' },
                twoTime: { price: '', discount: '' },
                threeTime: { price: '', discount: '' }
            }
        },
        tags: [],
        foodType: '',
        status: 'active'
    });
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const tagOptions = ['special', 'normal', 'gym', 'premium', 'custom'];
    const foodTypeOptions = ['veg', 'non-veg', 'egg'];
    const pricingPeriods = [
        { key: 'oneTime', label: 'One Time' },
        { key: 'monthly', label: 'Monthly' },
        { key: 'quarterly', label: 'Quarterly' },
        { key: 'halfYearly', label: 'Half Yearly' },
        { key: 'annual', label: 'Annual' }
    ];

    useEffect(() => {
        fetchMenus();
        fetchTiffin();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await axiosClient.get('/api/v1/menu/all');
            console.log('Menus fetched:', response);
            if (response.data.success) {
                setMenus(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };
    const fetchTiffin = async () => {
        try {
            setTiffinLoading(true);
            const response = await axiosClient.get(`/api/v1/tiffin/get/${id}`);
            console.log('Tiffin fetched:', response);
            if (response.data.success) {
                const tiffinData = response.data.data;
                // Handle both old and new pricing structures for backward compatibility
                const pricing = tiffinData.pricing || {};
                
                setFormData({
                    name: tiffinData.name || '',
                    menu: tiffinData.menu?._id || '',
                    pricing: {
                        oneTime: {
                            price: pricing.oneTime?.price || (typeof pricing.oneTime === 'object' && pricing.oneTime?.price) || '',
                            discount: pricing.oneTime?.discount || (typeof pricing.oneTime === 'object' && pricing.oneTime?.discount) || ''
                        },
                        monthly: {
                            oneTime: {
                                price: pricing.monthly?.oneTime?.price || (typeof pricing.monthly === 'object' && !pricing.monthly?.oneTime && pricing.monthly?.price) || '',
                                discount: pricing.monthly?.oneTime?.discount || (typeof pricing.monthly === 'object' && !pricing.monthly?.oneTime && pricing.monthly?.discount) || ''
                            },
                            twoTime: {
                                price: pricing.monthly?.twoTime?.price || '',
                                discount: pricing.monthly?.twoTime?.discount || ''
                            },
                            threeTime: {
                                price: pricing.monthly?.threeTime?.price || '',
                                discount: pricing.monthly?.threeTime?.discount || ''
                            }
                        },
                        quarterly: {
                            oneTime: {
                                price: pricing.quarterly?.oneTime?.price || (typeof pricing.quarterly === 'object' && !pricing.quarterly?.oneTime && pricing.quarterly?.price) || '',
                                discount: pricing.quarterly?.oneTime?.discount || (typeof pricing.quarterly === 'object' && !pricing.quarterly?.oneTime && pricing.quarterly?.discount) || ''
                            },
                            twoTime: {
                                price: pricing.quarterly?.twoTime?.price || '',
                                discount: pricing.quarterly?.twoTime?.discount || ''
                            },
                            threeTime: {
                                price: pricing.quarterly?.threeTime?.price || '',
                                discount: pricing.quarterly?.threeTime?.discount || ''
                            }
                        },
                        halfYearly: {
                            oneTime: {
                                price: pricing.halfYearly?.oneTime?.price || (typeof pricing.halfYearly === 'object' && !pricing.halfYearly?.oneTime && pricing.halfYearly?.price) || '',
                                discount: pricing.halfYearly?.oneTime?.discount || (typeof pricing.halfYearly === 'object' && !pricing.halfYearly?.oneTime && pricing.halfYearly?.discount) || ''
                            },
                            twoTime: {
                                price: pricing.halfYearly?.twoTime?.price || '',
                                discount: pricing.halfYearly?.twoTime?.discount || ''
                            },
                            threeTime: {
                                price: pricing.halfYearly?.threeTime?.price || '',
                                discount: pricing.halfYearly?.threeTime?.discount || ''
                            }
                        },
                        annual: {
                            oneTime: {
                                price: pricing.annual?.oneTime?.price || (typeof pricing.annual === 'object' && !pricing.annual?.oneTime && pricing.annual?.price) || '',
                                discount: pricing.annual?.oneTime?.discount || (typeof pricing.annual === 'object' && !pricing.annual?.oneTime && pricing.annual?.discount) || ''
                            },
                            twoTime: {
                                price: pricing.annual?.twoTime?.price || '',
                                discount: pricing.annual?.twoTime?.discount || ''
                            },
                            threeTime: {
                                price: pricing.annual?.threeTime?.price || '',
                                discount: pricing.annual?.threeTime?.discount || ''
                            }
                        }
                    },
                    tags: tiffinData.tags || [],
                    foodType: tiffinData.foodType || '',
                    status: tiffinData.status || 'active'
                });
            }
            setTiffinLoading(false);
        } catch (error) {
            console.error('Error fetching tiffin:', error);
            setErrors({ submit: 'Failed to fetch tiffin data' });
            setTiffinLoading(false);
        }
    };
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tiffin name is required';
        }

        if (!formData.menu) {
            newErrors.menu = 'Please select a menu';
        }

        if (!formData.foodType) {
            newErrors.foodType = 'Please select food type';
        }

        if (formData.tags.length === 0) {
            newErrors.tags = 'Please select at least one tag';
        }

        // Validate pricing
        // Validate oneTime plan (simple structure)
        const oneTimePrice = formData.pricing.oneTime?.price;
        const oneTimeDiscount = formData.pricing.oneTime?.discount;
        if (oneTimePrice && oneTimePrice <= 0) {
            newErrors['pricing_oneTime'] = 'Price must be greater than 0';
        }
        if (oneTimeDiscount && (oneTimeDiscount < 0 || oneTimeDiscount > 100)) {
            newErrors['discount_oneTime'] = 'Discount must be between 0-100%';
        }

        // Validate other plans (timing-based structure)
        const plansToValidate = ['monthly', 'quarterly', 'halfYearly', 'annual'];
        plansToValidate.forEach(period => {
            const timingKeys = ['oneTime', 'twoTime', 'threeTime'];
            timingKeys.forEach(timingKey => {
                const price = formData.pricing[period]?.[timingKey]?.price;
                const discount = formData.pricing[period]?.[timingKey]?.discount;

                if (price && price <= 0) {
                    newErrors[`pricing_${period}_${timingKey}`] = 'Price must be greater than 0';
                }
                if (discount && (discount < 0 || discount > 100)) {
                    newErrors[`discount_${period}_${timingKey}`] = 'Discount must be between 0-100%';
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Convert pricing values to numbers
            const processedData = {
                ...formData,
                pricing: {
                    // Handle oneTime plan (simple structure)
                    oneTime: {
                        price: Number(formData.pricing.oneTime.price || 0),
                        discount: Number(formData.pricing.oneTime.discount || 0)
                    },
                    // Handle other plans (timing-based structure)
                    monthly: {
                        oneTime: {
                            price: Number(formData.pricing.monthly.oneTime.price || 0),
                            discount: Number(formData.pricing.monthly.oneTime.discount || 0)
                        },
                        twoTime: {
                            price: Number(formData.pricing.monthly.twoTime.price || 0),
                            discount: Number(formData.pricing.monthly.twoTime.discount || 0)
                        },
                        threeTime: {
                            price: Number(formData.pricing.monthly.threeTime.price || 0),
                            discount: Number(formData.pricing.monthly.threeTime.discount || 0)
                        }
                    },
                    quarterly: {
                        oneTime: {
                            price: Number(formData.pricing.quarterly.oneTime.price || 0),
                            discount: Number(formData.pricing.quarterly.oneTime.discount || 0)
                        },
                        twoTime: {
                            price: Number(formData.pricing.quarterly.twoTime.price || 0),
                            discount: Number(formData.pricing.quarterly.twoTime.discount || 0)
                        },
                        threeTime: {
                            price: Number(formData.pricing.quarterly.threeTime.price || 0),
                            discount: Number(formData.pricing.quarterly.threeTime.discount || 0)
                        }
                    },
                    halfYearly: {
                        oneTime: {
                            price: Number(formData.pricing.halfYearly.oneTime.price || 0),
                            discount: Number(formData.pricing.halfYearly.oneTime.discount || 0)
                        },
                        twoTime: {
                            price: Number(formData.pricing.halfYearly.twoTime.price || 0),
                            discount: Number(formData.pricing.halfYearly.twoTime.discount || 0)
                        },
                        threeTime: {
                            price: Number(formData.pricing.halfYearly.threeTime.price || 0),
                            discount: Number(formData.pricing.halfYearly.threeTime.discount || 0)
                        }
                    },
                    annual: {
                        oneTime: {
                            price: Number(formData.pricing.annual.oneTime.price || 0),
                            discount: Number(formData.pricing.annual.oneTime.discount || 0)
                        },
                        twoTime: {
                            price: Number(formData.pricing.annual.twoTime.price || 0),
                            discount: Number(formData.pricing.annual.twoTime.discount || 0)
                        },
                        threeTime: {
                            price: Number(formData.pricing.annual.threeTime.price || 0),
                            discount: Number(formData.pricing.annual.threeTime.discount || 0)
                        }
                    }
                }
            };

            const response = await axiosClient.put(`/api/v1/tiffin/update/${id}`, processedData);

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    if (onSuccess) onSuccess(response.data.data);
                }, 1500);
                setTimeout(() => {
                    navigate("/tiffin")
                }, 2000);
            }
        } catch (error) {
            setErrors({ submit: error.response?.data?.message || 'Failed to update tiffin' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePricingChange = (period, timingKey, field, value) => {
        setFormData(prev => {
            if (period === 'oneTime') {
                // Simple structure for oneTime
                return {
                    ...prev,
                    pricing: {
                        ...prev.pricing,
                        oneTime: {
                            ...prev.pricing.oneTime,
                            [field]: value
                        }
                    }
                };
            } else {
                // Timing-based structure for other plans
                return {
                    ...prev,
                    pricing: {
                        ...prev.pricing,
                        [period]: {
                            ...prev.pricing[period],
                            [timingKey]: {
                                ...prev.pricing[period][timingKey],
                                [field]: value
                            }
                        }
                    }
                };
            }
        });
        const errorKey = timingKey ? `${field}_${period}_${timingKey}` : `${field}_${period}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
    };

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
        if (errors.tags) {
            setErrors(prev => ({ ...prev, tags: '' }));
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                    <p className="text-gray-600">Tiffin Updated successfully</p>
                </div>
            </div>
        );
    }
    if (tiffinLoading) {
        return (
            <>
                <RippleLoader size={30} color='#e7582e' />
            </>
        )
    }
    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Update Tiffin</h2>
                {/* {onCancel && (
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )} */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Info Section - Spans 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-third">Basic Information</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiffin Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                                placeholder="Enter tiffin name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Menu *
                            </label>
                            <select
                                name="menu"
                                value={formData.menu}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.menu ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                            >
                                <option value="">Select a menu</option>
                                {menus.map(menu => (
                                    <option key={menu._id} value={menu._id}>
                                        {menu.menuName}
                                    </option>
                                ))}
                            </select>
                            {errors.menu && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.menu}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Food Type & Tags Section */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-third">Categories</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Food Type *
                            </label>
                            <div className="space-y-2">
                                {foodTypeOptions.map(type => (
                                    <label
                                        key={type}
                                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.foodType === type
                                            ? 'border-primary bg-primary bg-opacity-10'
                                            : 'border-gray-200 hover:border-secondary'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="foodType"
                                            value={type}
                                            checked={formData.foodType === type}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-3 text-sm font-medium capitalize">{type}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.foodType && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.foodType}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Tags *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tagOptions.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.tags.includes(tag)
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            {errors.tags && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.tags}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pricing Section - Spans full width */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-third">Pricing Plans</h3>
                    <p className="text-sm text-gray-600 mb-4">Set prices based on number of delivery timings (1-time, 2-time, or 3-time delivery)</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {pricingPeriods.map(({ key, label }) => {
                            // For oneTime plan, show simple pricing
                            if (key === 'oneTime') {
                                return (
                                    <div key={key} className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                        <h4 className="font-semibold text-third mb-3 text-center">{label}</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={formData.pricing.oneTime.price}
                                                    onChange={(e) => handlePricingChange('oneTime', null, 'price', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Discount (%)</label>
                                                <input
                                                    type="number"
                                                    value={formData.pricing.oneTime.discount}
                                                    onChange={(e) => handlePricingChange('oneTime', null, 'discount', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // For other plans, show timing-based pricing
                            const timingOptions = [
                                { key: 'oneTime', label: '1-Time Delivery', icon: '1️⃣' },
                                { key: 'twoTime', label: '2-Time Delivery', icon: '2️⃣' },
                                { key: 'threeTime', label: '3-Time Delivery', icon: '3️⃣' }
                            ];

                            return (
                                <div key={key} className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                    <h4 className="font-semibold text-third mb-3 text-center">{label}</h4>
                                    <div className="space-y-4">
                                        {timingOptions.map((timing) => (
                                            <div key={timing.key} className="border border-gray-200 rounded-lg p-2 bg-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{timing.icon}</span>
                                                    <span className="text-xs font-medium text-gray-700">{timing.label}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={formData.pricing[key]?.[timing.key]?.price || ''}
                                                            onChange={(e) => handlePricingChange(key, timing.key, 'price', e.target.value)}
                                                            className="w-full px-2 py-1.5 rounded border border-gray-300 focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs"
                                                            placeholder="0"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Discount (%)</label>
                                                        <input
                                                            type="number"
                                                            value={formData.pricing[key]?.[timing.key]?.discount || ''}
                                                            onChange={(e) => handlePricingChange(key, timing.key, 'discount', e.target.value)}
                                                            className="w-full px-2 py-1.5 rounded border border-gray-300 focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-xs"
                                                            placeholder="0"
                                                            min="0"
                                                            max="100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Section */}
                <div className="lg:col-span-3">
                    {errors.submit && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex gap-4 justify-end">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-3 rounded-lg bg-linear-to-br from-primary to-secondary text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Updating...' : 'Update Tiffin'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UpdateTiffinForm;