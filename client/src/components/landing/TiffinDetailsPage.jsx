import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../services/cartAction';
import AlertSnackbar from '../../ui/AlertSnackbar';
import TiffinHeader from './TiffinHeader';
import TiffinMenuTabs from './TiffinMenuTabs';
import PricingPlans from './PricingPlans';
import TiffinAddToCartBar from './TiffinAddToCartBar';




export default function TiffinDetailsPage() {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
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
            setTiffin(res.data?.data);
        } catch (err) {
            console.error('Error fetching tiffin:', err);
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
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
          
            showSnackbar("Please login to add items to cart", "warning");
            navigate('/login');
            return;
        }

        if (!selectedPlan) {
            showSnackbar('Please select a plan', "info");
            return;
        }

        setAddingToCart(true);

        const cartData = {
            itemType: 'tiffin',
            tiffinId: id,
            plan: selectedPlan
        };

        const result = await dispatch(addToCart(cartData));

        if (result.success) {
            showSnackbar(result.message || 'Tiffin added to cart successfully!', "success");
            // Optionally navigate to cart page
            // navigate('/cart');
        } else {
            showSnackbar(result.message || 'Failed to add to cart', "warning");
        }

        setAddingToCart(false);
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
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50">
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
                        onAddToCart={handleAddToCart}
                        isLoading={addingToCart}
                    />
                </div>
            </div>
        </>
    );
}