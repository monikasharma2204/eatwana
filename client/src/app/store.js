// src/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// 🔹 Import your slices (reducers)
import userReducer from './auth/userSlice.js';

// 🔹 Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// 🔹 Configure persistence
const persistConfig = {
    key: 'root', // key name in storage
    storage,
    version: 1,
};

// 🔹 Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Create store
export const store = configureStore({
    reducer: persistedReducer,

    // ✅ Fix for non-serializable actions from redux-persist
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// 🔹 Create persistor
export const persistor = persistStore(store);
