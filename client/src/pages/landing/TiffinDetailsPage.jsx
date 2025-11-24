import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../services/cartAction';
import AlertSnackbar from '../../ui/AlertSnackbar';
import { PricingPlans, TiffinAddToCartBar, TiffinHeader, TiffinMenuTabs } from '../../components/landing/TiffinDetail';



export default function TiffinDetailsPage() {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [deliveryTimings, setDeliveryTimings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tiffin, setTiffin] = useState(null);
    const [menu, setMenu] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const fetchTiffin = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`/api/v1/tiffin/get/${id}`);
            console.log(res.data.data);
            setTiffin(res.data?.data);
        } catch (err) {
            console.error('Error fetching tiffin:', err);
            showSnackbar('Failed to load tiffin details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await axiosClient.get(`/api/v1/menu/get/${tiffin?.menu?._id}`);
            setMenu(res.data?.data);
        } catch (err) {
            console.error('Error fetching menu:', err);
            showSnackbar('Failed to load menu', 'error');
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            showSnackbar("Please login to add items to cart", "warning");
            navigate('/auth/login');
            return;
        }

        if (!selectedPlan) {
            showSnackbar('Please select a plan', "info");
            return;
        }

        if (!deliveryTimings || deliveryTimings.length === 0) {
            showSnackbar('Please select at least one delivery timing (breakfast, lunch, or dinner)', "warning");
            return;
        }

        setAddingToCart(true);

        try {
            const cartData = {
                itemType: 'tiffin',
                tiffinId: id,
                plan: selectedPlan,
                deliveryTimings: deliveryTimings
            };

            const result = await dispatch(addToCart(cartData));

            if (result.success) {
                const timingLabels = deliveryTimings.map(t =>
                    t === 'breakfast' ? 'Breakfast' : t === 'lunch' ? 'Lunch' : 'Dinner'
                ).join(', ');
                showSnackbar(`Tiffin added to cart successfully! (${timingLabels})`, "success");
                setDeliveryTimings([]);
            } else {
                showSnackbar(result.message || 'Failed to add to cart', "warning");
            }
        } catch (error) {
            showSnackbar('Error adding to cart', "error");
        } finally {
            setAddingToCart(false);
        }
    };

    useEffect(() => {
        fetchTiffin();
    }, [id]);

    useEffect(() => {
        if (tiffin?.menu?._id) {
            fetchMenu();
        }
    }, [tiffin]);

    if (loading && !tiffin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <div className="min-h-screen bg-gray-50 pb-32">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <TiffinHeader data={tiffin} />
                    <TiffinMenuTabs menu={menu} />
                    <PricingPlans
                        pricing={tiffin?.pricing}
                        selectedPlan={selectedPlan}
                        onSelectPlan={setSelectedPlan}
                    />
                    <TiffinAddToCartBar
                        selectedPlan={selectedPlan}
                        pricing={tiffin?.pricing}
                        tiffinId={id}
                        deliveryTimings={deliveryTimings}
                        onDeliveryTimingsChange={setDeliveryTimings}
                        onAddToCart={handleAddToCart}
                        isLoading={addingToCart}
                    />
                </div>
            </div>
        </>
    );
}