import React, { useEffect, useState } from 'react';
import { Star, Clock, Award, Leaf, Egg, Drumstick } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useParams } from 'react-router-dom';

// Mock data based on the models
const tiffinData = {
    name: "Premium Healthy Tiffin",
    foodType: "veg",
    rating: {
        averageRating: 4.7,
        totalRatings: 342
    },
    tags: ["special", "gym", "premium"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    pricing: {
        oneTime: { price: 150, discount: 0 },
        monthly: { price: 3600, discount: 10 },
        quarterly: { price: 10200, discount: 15 },
        halfYearly: { price: 19800, discount: 20 },
        annual: { price: 38400, discount: 25 }
    }
};

const menuData = {
    menuName: "Balanced Weekly Menu",
    menuType: "Pure-Veg",
    week: [
        {
            day: "Monday",
            meals: {
                breakfast: ["Poha", "Sambar", "Green Tea"],
                lunch: ["Dal Tadka", "Jeera Rice", "Mixed Veg", "Roti", "Salad"],
                dinner: ["Paneer Curry", "Chapati", "Raita", "Fruit"]
            },
            note: "High protein day"
        },
        {
            day: "Tuesday",
            meals: {
                breakfast: ["Upma", "Coconut Chutney", "Coffee"],
                lunch: ["Rajma Curry", "Brown Rice", "Aloo Gobi", "Roti", "Curd"],
                dinner: ["Veg Pulao", "Raita", "Papad", "Dessert"]
            },
            note: "Balanced nutrition"
        },
        {
            day: "Wednesday",
            meals: {
                breakfast: ["Idli", "Sambar", "Coconut Chutney"],
                lunch: ["Chole", "Jeera Rice", "Bhindi Fry", "Roti", "Salad"],
                dinner: ["Dal Makhani", "Chapati", "Veg Raita", "Fruit"]
            },
            note: "Rich in fiber"
        },
        {
            day: "Thursday",
            meals: {
                breakfast: ["Paratha", "Curd", "Pickle", "Tea"],
                lunch: ["Palak Paneer", "Brown Rice", "Dal Fry", "Roti", "Salad"],
                dinner: ["Veg Biryani", "Raita", "Papad", "Gulab Jamun"]
            },
            note: "Special menu"
        },
        {
            day: "Friday",
            meals: {
                breakfast: ["Dosa", "Sambar", "Coconut Chutney", "Coffee"],
                lunch: ["Kadhi Pakora", "Jeera Rice", "Aloo Matar", "Roti", "Curd"],
                dinner: ["Mixed Veg", "Chapati", "Dal", "Salad"]
            },
            note: "Light & healthy"
        },
        {
            day: "Saturday",
            meals: {
                breakfast: ["Puri", "Aloo Sabzi", "Halwa", "Tea"],
                lunch: ["Paneer Tikka Masala", "Naan", "Dal Makhani", "Rice", "Salad"],
                dinner: ["Veg Fried Rice", "Manchurian", "Soup"]
            },
            note: "Weekend special"
        },
        {
            day: "Sunday",
            meals: {
                breakfast: ["Chole Bhature", "Lassi", "Pickle"],
                lunch: ["Special Thali", "Rice", "Roti", "Dessert", "Salad"],
                dinner: ["Veg Pulao", "Paneer Curry", "Raita", "Fruit"]
            },
            note: "Sunday feast"
        }
    ]
};

const TiffinHeader = ({ data }) => {
    const getFoodTypeIcon = (type) => {
        switch (type) {
            case 'veg': return <Leaf className="w-4 h-4" />;
            case 'non-veg': return <Drumstick className="w-4 h-4" />;
            case 'egg': return <Egg className="w-4 h-4" />;
            default: return null;
        }
    };

    const getFoodTypeBadge = (type) => {
        const colors = {
            veg: 'bg-green-100 text-green-700 border-green-300',
            'non-veg': 'bg-red-100 text-red-700 border-red-300',
            egg: 'bg-yellow-100 text-yellow-700 border-yellow-300'
        };
        return colors[type] || colors.veg;
    };

    const getTagColor = (tag) => {
        const colors = {
            special: 'bg-purple-100 text-purple-700',
            gym: 'bg-blue-100 text-blue-700',
            premium: 'bg-amber-100 text-amber-700',
            normal: 'bg-gray-100 text-gray-700'
        };
        return colors[tag] || colors.normal;
    };

    return (
        <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <img
                        src="/picture/non_veg_tiffin.png"
                        // alt={}
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                        {data?.name}
                    </h1>

                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getFoodTypeBadge(data?.foodType)}`}>
                            {getFoodTypeIcon(data?.foodType)}
                            {data?.foodType === 'veg' ? 'Pure Veg' : data?.foodType === 'non-veg' ? 'Non-Veg' : 'Egg'}
                        </span>

                        {data?.tags.map(tag => (
                            <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-amber-900">{data?.rating.averageRating}</span>
                        </div>
                        <span className="text-third">({data?.rating.totalRatings} ratings)</span>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-third/20">
                        <p className="text-third">
                            Enjoy a perfectly balanced meal plan with fresh, healthy ingredients delivered daily to your doorstep.
                            Our tiffin service ensures you never miss a nutritious meal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TiffinMenuTabs = ({ menu }) => {
    const [activeDay, setActiveDay] = useState(0);

    const getMealIcon = (mealType) => {
        return <Clock className="w-4 h-4" />;
    };

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Weekly Menu</h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-third/20">
                <div className="flex overflow-x-auto bg-third/5 border-b border-third/20">
                    {menu?.week?.map((day, idx) => (
                        <button
                            key={day?.day}
                            onClick={() => setActiveDay(idx)}
                            className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${activeDay === idx
                                ? 'bg-primary text-white'
                                : 'text-third hover:bg-third/10'
                                }`}
                        >
                            {day?.day}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {menu?.week[activeDay] && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary px-3 py-1 bg-secondary/10 rounded-full">
                                    {menu.menuType}
                                </span>
                                {menu?.week[activeDay].note && (
                                    <span className="text-sm text-third italic flex items-center gap-1">
                                        <Award className="w-4 h-4" />
                                        {menu?.week[activeDay].note}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {Object.entries(menu?.week[activeDay].meals).map(([mealType, dishes]) => (
                                    <div key={mealType}>
                                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                                            {getMealIcon(mealType)}
                                            {mealType?.charAt(0).toUpperCase() + mealType?.slice(1)}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {dishes.map((dish, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-third/5 border border-third/20 rounded-full text-sm text-third hover:scale-[1.03] hover:shadow-md transition-all cursor-default flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {dish?.name}   {/* ✅ FIX */}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PricingPlans = ({ pricing, selectedPlan, onSelectPlan }) => {
    const plans = [
        { key: 'oneTime', name: 'One Time', duration: '1 day' },
        { key: 'monthly', name: 'Monthly', duration: '30 days' },
        { key: 'quarterly', name: 'Quarterly', duration: '90 days' },
        { key: 'halfYearly', name: 'Half Yearly', duration: '180 days' },
        { key: 'annual', name: 'Annual', duration: '365 days' }
    ];

    const calculatePrice = (plan) => {
        const originalPrice = plan?.price;
        const discount = plan?.discount;
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        const savings = originalPrice - discountedPrice;

        return { originalPrice, discountedPrice, savings, discount };
    };

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Choose Your Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {plans && plans?.map(plan => {
                    const planPricing = pricing?.[plan?.key];

                    if (!planPricing) return null; // skip plans that don't exist in pricing

                    const priceInfo = calculatePrice(planPricing);
                    const isSelected = selectedPlan === plan?.key;

                    return (
                        <div
                            key={plan?.key}
                            className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${isSelected
                                ? 'border-primary shadow-lg scale-[1.02]'
                                : 'border-third/20 hover:border-primary/50'
                                }`}
                            onClick={() => onSelectPlan(plan?.key)}
                        >
                            <div className="text-center space-y-3">
                                <h3 className="text-lg font-bold text-third">{plan?.name}</h3>
                                <p className="text-sm text-third/70">{plan?.duration}</p>

                                {priceInfo?.discount > 0 && (
                                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full inline-block">
                                        Save {priceInfo?.discount}%
                                    </div>
                                )}

                                <div>
                                    {priceInfo?.discount > 0 && (
                                        <p className="text-sm text-third/50 line-through">₹{priceInfo?.originalPrice}</p>
                                    )}
                                    <p className="text-3xl font-bold text-primary">₹{priceInfo?.discountedPrice}</p>
                                    {priceInfo?.savings > 0 && (
                                        <p className="text-xs text-green-600 font-medium">You save ₹{priceInfo?.savings}</p>
                                    )}
                                </div>

                                <button
                                    className={`w-full py-2 rounded-full font-medium transition-all ${isSelected
                                        ? 'bg-primary text-white'
                                        : 'bg-third/10 text-third hover:bg-third/20'
                                        }`}
                                >
                                    {isSelected ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AddToCartBar = ({ selectedPlan, pricing }) => {
    const plans = {
        oneTime: 'One Time',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        halfYearly: 'Half Yearly',
        annual: 'Annual'
    };

    const getPlanDetails = () => {
        if (!selectedPlan) return null;

        const plan = pricing?.[selectedPlan];
        if (!plan) return null;   // <-- Important safety check

        const originalPrice = plan.price;
        const discountedPrice = originalPrice - (originalPrice * plan.discount / 100);

        return {
            name: plans[selectedPlan],
            originalPrice,
            discountedPrice,
            hasDiscount: plan.discount > 0
        };
    };


    const details = getPlanDetails();

    return (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-third/20 sticky top-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    {details ? (
                        <div>
                            <p className="text-lg font-semibold text-third">Selected Plan: <span className="text-primary">{details.name}</span></p>
                            <div className="flex items-center gap-3 mt-1">
                                {details.hasDiscount && (
                                    <span className="text-third/50 line-through">₹{details.originalPrice}</span>
                                )}
                                <span className="text-2xl font-bold text-primary">₹{details.discountedPrice}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-third">Please select a plan to continue</p>
                    )}
                </div>

                <button
                    disabled={!selectedPlan}
                    className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all ${selectedPlan
                        ? 'bg-primary text-white hover:scale-[1.05] hover:shadow-xl cursor-pointer'
                        : 'bg-third/20 text-third/50 cursor-not-allowed'
                        }`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default function TiffinDetailsPage() {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const [tiffin, setTiffin] = useState(null);
    const [menu, setMenu] = useState(null);
    const { id } = useParams();
    console.log("Tiffin ID:", id);


    const fetchTiffin = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/api/v1/tiffin/get/${id}`);
            console.log("Tiffin Data:", res.data?.data);
            setTiffin(res.data?.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/api/v1/menu/get/${tiffin?.menu?._id}`);
            console.log("Menu Data:", res.data?.data);
            setMenu(res.data?.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTiffin();
    }, []);

    useEffect(() => {
        if (tiffin?.menu?._id) {
            fetchMenu();
        }
    }, [tiffin]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <TiffinHeader data={tiffin} />
                <TiffinMenuTabs menu={menu} />
                <PricingPlans
                    pricing={tiffin?.pricing}
                    selectedPlan={selectedPlan}
                    onSelectPlan={setSelectedPlan}
                />
                <AddToCartBar
                    selectedPlan={selectedPlan}
                    pricing={tiffin?.pricing}
                />
            </div>

            <style>{`
        .text-primary { color: #f97316; }
        .bg-primary { background-color: #f97316; }
        .border-primary { border-color: #f97316; }
        .text-secondary { color: #ea580c; }
        .bg-secondary { background-color: #ea580c; }
        .text-third { color: #78716c; }
        .bg-third { background-color: #78716c; }
        .border-third { border-color: #78716c; }
      `}</style>
        </div>
    );
}