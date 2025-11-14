import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import userAuthRoute from './routes/userAuthRoutes.js';
import dishRoutes from "./routes/dishRoute.js";
import subCategoryRoutes from "./routes/subCategoryRoute.js";
import tiffinMenuRoutes from "./routes/tiffinMenuRoute.js";
import tiffinRoutes from "./routes/tiffinRoute.js";
import cartRoutes from "./routes/cartRoutes.js";


import { errorHandler, notFound } from "./middleware/errorHandler.js";
console.log("JWT_SECRET:", process.env.USER_JWT_SECRET);



const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eatwana';



// ========================
// 🔹 Middlewares
// ========================
app.use(cors({
    origin: '*', // You can restrict it later like: ['https://eatwana.in']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // For parsing JSON data
app.use(express.urlencoded({ extended: true })); // For form data
app.use('/uploads', express.static('uploads'));
// app.use(notFound);
// app.use(errorHandler);


// ========================
// 🔹 MongoDB Connection
// ========================
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); // Stop the app if DB connection fails
    });





// ========================
// 🔹 Routes
// ========================
app.use('/api/v1/auth', userAuthRoute);
app.use("/api/v1/dishes", dishRoutes);
app.use("/api/v1/subcategory", subCategoryRoutes);
app.use("/api/v1/menu", tiffinMenuRoutes);
app.use("/api/v1/tiffin", tiffinRoutes);
app.use("/api/v1/cart", cartRoutes);


// Example Test Route
app.get('/', (req, res) => {
    res.json({ message: 'API working fine!' });
});

// ========================
// 🔹 Global Error Handler
// ========================
// app.use((err, req, res, next) => {
//     console.error('Error:', err.stack);
//     res.status(500).json({ message: 'Something went wrong!' });
// });

// ========================
// 🔹 Start Server
// ========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    console.log(PORT, MONGO_URI, process.env.USER_JWT_SECRET);
});
