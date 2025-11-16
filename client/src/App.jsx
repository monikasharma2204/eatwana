import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
// Landing Page 
import UserMenu from "./pages/landing/UserMenu";

// Pages
import Home from "./pages/landing/Home";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/SignUp";
import ForgotPassword from "./pages/landing/ForgotPassword";
import Loader from "./ui/Loader";
import Profile from "./pages/landing/Profile";
import AddDishForm from "./pages/admin/AddDishForm";
import SubCategoryForm from "./components/admin/SubCategoryForm";
import AllDish from "./pages/admin/AllDish";
import AddSubCategory from "./pages/admin/AddSubCategory";
import SubCategory from "./pages/admin/SubCategory";
import UpdateDishForm from "./pages/admin/UpdateDish";
import AddMenu from "./pages/admin/AddMenu";
import CoomingSoon from "./pages/landing/CoomingSoon";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// Utils
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/admin/Sidebar";
import Menu from "./pages/admin/Menu";
import UpdateMenu from "./pages/admin/UpdateMenu";
import AddTiffin from "./pages/admin/AddTiffin";
import Tiffin from "./pages/admin/Tiffin";
import UpdateTiffin from "./pages/admin/UpdateTiffin";
import UserTiffin from "./pages/landing/UserTiffin";
import TiffinDetailsPage from "./components/landing/TiffinDetailsPage";
import DishDetailPage from "./pages/landing/DishDetailPage";
import CartPage from "./pages/landing/Cart";
import Customers from "./pages/admin/Customers";
import ManageOrders from "./pages/admin/ManageOrders";
import AdminLoginForm from "./pages/admin/AdminLoginForm";
import FooterSection from "./components/landing/FooterSection";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Enquiries from "./pages/admin/Enquiries";
import AdminSubscriptionPage from "./pages/admin/AdminSubscriptionPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";



export default function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== AUTH ROUTES ==================== */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/auth/login" element={<AdminLoginForm />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/loader" element={<Loader />} />
          {/* <Route path="/" element={<CoomingSoon />} /> */}
        </Route>

        {/* ==================== MAIN ROUTES ==================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<UserMenu />} />
          <Route path="/tiffin" element={<UserTiffin />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tiffin/:id"
            element={

              <TiffinDetailsPage />

            }
          />
          <Route
            path="/dish/:id"
            element={

              <DishDetailPage />

            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <Sidebar>
                  <AdminDashboardPage />
                </Sidebar>
              </AdminProtectedRoute>

            }
          />
          <Route
            path="/admin/dishes/all"
            element={

              <Sidebar>
                <AllDish />
              </Sidebar>

            }
          />
          <Route
            path="/admin/dishes/add"
            element={

              <Sidebar>
                <AddDishForm />
              </Sidebar>
            }
          />
          <Route
            path="/admin/update/:id"
            element={
              <Sidebar>
                <UpdateDishForm />
              </Sidebar>
            }
          />
          <Route
            path="/admin/sub-categories"
            element={
              <Sidebar>
                <SubCategory />
              </Sidebar>
            }
          />
          <Route
            path="/admin/sub-categories/add"
            element={
              <Sidebar>
                <AddSubCategory />
              </Sidebar>

            }
          />
          <Route
            path="/admin/menu"
            element={
              <Sidebar>
                <Menu />
              </Sidebar>

            }
          />
          <Route
            path="/admin/menu/add"
            element={
              <Sidebar>
                <AddMenu />
              </Sidebar>

            }
          />
          <Route
            path="/admin/menu/update/:id"
            element={
              <Sidebar>
                <UpdateMenu />
              </Sidebar>

            }
          />
          <Route
            path="/admin/tiffin"
            element={
              <Sidebar>
                <Tiffin />
              </Sidebar>

            }
          />
          <Route
            path="/admin/tiffin/add"
            element={
              <Sidebar>
                <AddTiffin />
              </Sidebar>

            }
          />
          <Route
            path="/admin/tiffin/update/:id"
            element={
              <Sidebar>
                <UpdateTiffin />
              </Sidebar>

            }
          />
          <Route
            path="/admin/customers"
            element={
              <Sidebar>
                <Customers />
              </Sidebar>

            }
          />
          <Route
            path="/admin/orders"
            element={
              <Sidebar>
                <ManageOrders />
              </Sidebar>

            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <Sidebar>
                <Enquiries />
              </Sidebar>

            }
          />
          <Route
            path="/admin/subscription"
            element={
              <Sidebar>
                <AdminSubscriptionPage />
              </Sidebar>

            }
          />



        </Route>
      </Routes>
    </Router>
  );
}
