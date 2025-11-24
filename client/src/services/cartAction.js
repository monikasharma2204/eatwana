// src/store/actions/cartActions.js
import { resetCart } from '../app/cart/cartSlice';
import axiosClient from './axiosClient';

// Add item to cart
export const addToCart = (itemData) => async (dispatch) => {
    try {
        dispatch({ type: 'cart/setLoading', payload: true });
        const response = await axiosClient.post('/api/v1/cart/add', itemData);
        // Fetch updated cart after adding
        dispatch(fetchCart());

        return {
            success: true,
            message: response.data.message || 'Item added to cart successfully'
        };
    } catch (error) {
        console.log(error)
        dispatch({
            type: 'cart/setError',
            payload: error.response?.data?.message || 'Failed to add item to cart'
        });

        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add item to cart'
        };
    } finally {
        dispatch({ type: 'cart/setLoading', payload: false });
    }
};

// Fetch cart items
export const fetchCart = () => async (dispatch) => {
    try {
        dispatch({ type: 'cart/setLoading', payload: true });

        const response = await axiosClient.get('/api/v1/cart/get');
        console.log(response.data.cart)
        dispatch({
            type: 'cart/setCart',
            payload: response.data.cart || []
        });
    } catch (error) {
        dispatch({
            type: 'cart/setError',
            payload: error.response?.data?.message || 'Failed to fetch cart'
        });
    } finally {
        dispatch({ type: 'cart/setLoading', payload: false });
    }
};

// Remove item from cart
export const removeFromCart = (itemId) => async (dispatch) => {
    try {
        dispatch({ type: 'cart/setLoading', payload: true });

        await axiosClient.delete(`/api/v1/cart/remove/${itemId}`);

        dispatch(fetchCart());

        return { success: true, message: 'Item removed from cart' };
    } catch (error) {
        dispatch({
            type: 'cart/setError',
            payload: error.response?.data?.message || 'Failed to remove item'
        });

        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove item'
        };
    } finally {
        dispatch({ type: 'cart/setLoading', payload: false });
    }
};

// Clear cart
export const clearCart = () => async (dispatch) => {
    try {
        dispatch({ type: 'cart/setLoading', payload: true });

        await axiosClient.delete('/api/v1/cart/clear');

        dispatch(resetCart());

        return { success: true, message: 'Cart cleared' };
    } catch (error) {
        dispatch({
            type: 'cart/setError',
            payload: error.response?.data?.message || 'Failed to clear cart'
        });

        return {
            success: false,
            message: error.response?.data?.message || 'Failed to clear cart'
        };
    } finally {
        dispatch({ type: 'cart/setLoading', payload: false });
    }
};