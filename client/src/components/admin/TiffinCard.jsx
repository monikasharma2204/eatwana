import React from 'react';
import { Star, Leaf, Drumstick, Egg, IndianRupee, Pencil, Trash2, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteConfirmDialog from '../../ui/DeleteConfirmDialog';
import { useNavigate } from 'react-router-dom';

const TiffinCard = ({ tiffin, onView, onEdit, onDelete }) => {
    const [showDialog, setShowDialog] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const navigate = useNavigate();
    console.log(tiffin)
    const getFoodTypeIcon = (type) => {
        switch (type) {
            case 'veg':
                return <Leaf className="w-5 h-5 text-green-600" />;
            case 'non-veg':
                return <Drumstick className="w-5 h-5 text-red-600" />;
            case 'egg':
                return <Egg className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getFoodTypeLabel = (type) => {
        if (!type) return 'N/A';
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const calculateDiscountedPrice = (price, discount) => {
        if (!price) return 0;
        return price - (price * (discount || 0) / 100);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(tiffin);
        setIsDeleting(false);
        setShowDialog(false);
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(tiffin);
        }
    };

    // Safe data access with fallbacks
    const foodType = tiffin?.foodType || 'veg';
    const name = tiffin?.name || 'Unnamed Tiffin';
    const menuName = tiffin?.menu?.menuName || 'No menu specified';
    const tags = tiffin?.tags || [];
    const rating = tiffin?.rating?.averageRating || 0;
    const totalRatings = tiffin?.rating?.totalRatings || 0;
    const monthlyPrice = tiffin?.pricing?.monthly?.price || 0;
    const monthlyDiscount = tiffin?.pricing?.monthly?.discount || 0;

    return (
        <>
            <DeleteConfirmDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={handleDelete}
                itemName={name}
                itemType="Tiffin Menu"
                isLoading={isDeleting}
            />
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={() => navigate(`/admin/tiffin/update/${tiffin._id}`)}
                            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                            title="Edit"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowDialog(true)}
                            className="bg-red-500/80 hover:bg-red-600 p-2 rounded-lg transition-colors backdrop-blur-sm"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-start justify-between mb-3 pr-20">
                        <div className="flex items-center gap-2">
                            {getFoodTypeIcon(foodType)}
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                {getFoodTypeLabel(foodType)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                            <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
                            <span className="text-xs">({totalRatings})</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{name}</h3>
                    <p className="text-sm text-white/90">{menuName}</p>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="px-6 py-3 border-b flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span
                                key={`${tag}-${index}`}
                                className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Pricing Preview */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Starting from</p>
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-orange-500" />
                                <span className="text-3xl font-bold text-gray-800">
                                    {/* {Math.floor(calculateDiscountedPrice(monthlyPrice, monthlyDiscount))} */}
                                    {tiffin?.pricing?.monthly?.oneTime?.price}
                                </span>
                                <span className="text-gray-500">/month (1 Time Meal Delivery)</span>
                            </div>
                            {monthlyDiscount > 0 && (
                                <p className="text-green-600 text-sm font-medium mt-1">
                                    Save {monthlyDiscount}%
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onView && onView(tiffin)}
                        className="w-full bg-orange-500 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
                    >
                        View Full Menu
                    </button>
                </div>
            </div>
        </>
    );
};


export default TiffinCard;