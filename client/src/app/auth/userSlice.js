import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
    },
    reducers: {
        // 🟡 Start loading before API request
        startLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        // ✅ Login success
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },
        // ❌ Error handling
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // 🚪 Logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { startLoading, loginSuccess, setError, logout } = userSlice.actions;
export default userSlice.reducer;
