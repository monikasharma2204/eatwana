import { createSlice } from "@reduxjs/toolkit";

const savedAdmin = localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : null;

const initialState = {
    admin: savedAdmin?.admin || null,
    token: savedAdmin?.token || null,
    isAuthenticated: savedAdmin ? true : false,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { admin, token } = action.payload;

            state.admin = admin;
            state.token = token;
            state.isAuthenticated = true;

            // save to localStorage
            localStorage.setItem(
                "adminData",
                JSON.stringify({ admin, token })
            );
        },

        logoutAdmin: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("adminData");
        },
    },
});

export const { loginSuccess, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
