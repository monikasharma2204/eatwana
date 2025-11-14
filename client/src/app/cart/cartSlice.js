import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        loading: false,
        error: null,
    },

    reducers: {
        // 🟡 Start loading (during API request)
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },

        // 🟢 Set full cart data (e.g., after fetching from backend)
        setCart: (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            state.error = null;
        },

        // ➕ Add a new cart item
        addCartItem: (state, action) => {
            state.cart.push(action.payload);
            state.loading = false;
            state.error = null;
        },

        // 🔄 Update quantity of specific cart item
        updateCartItem: (state, action) => {
            const updatedItem = action.payload;
            state.cart = state.cart.map((item) =>
                item._id === updatedItem._id ? updatedItem : item
            );
            state.loading = false;
            state.error = null;
        },

        // 🗑 Remove item by ID
        removeCartItem: (state, action) => {
            const id = action.payload;
            state.cart = state.cart.filter((item) => item._id !== id);
            state.loading = false;
            state.error = null;
        },

        // ❌ Set error
        setCartError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        // 🚪 Clear cart (on logout)
        resetCart: (state) => {
            state.cart = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    startLoading,
    setCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    setCartError,
    resetCart
} = cartSlice.actions;

export default cartSlice.reducer;
