import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./pages/landing/Home";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/SignUp";
import ForgotPassword from "./pages/landing/ForgotPassword";
import Loader from "./ui/Loader";
import Profile from "./pages/landing/Profile";
import CoomingSoon from "./pages/landing/CoomingSoon";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// Utils
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/admin/Sidebar";
import AddDishForm from "./pages/admin/AddDishForm";
import SubCategoryForm from "./components/admin/SubCategoryForm";
import AllDish from "./pages/admin/AllDish";
import AddSubCategory from "./pages/admin/AddSubCategory";
import SubCategory from "./pages/admin/SubCategory";
import UpdateDishForm from "./pages/admin/UpdateDish";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* ==================== AUTH ROUTES ==================== */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/loader" element={<Loader />} />
          {/* <Route path="/" element={<CoomingSoon />} /> */}
        </Route>

        {/* ==================== MAIN ROUTES ==================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={

              <Sidebar>
                Hello
              </Sidebar>

            }
          />
          <Route
            path="/dishes/all"
            element={
              <Sidebar>
                <AllDish />
              </Sidebar>

            }
          />
          <Route
            path="/dishes/add"
            element={
              <Sidebar>
                <AddDishForm />
              </Sidebar>
            }
          />
          <Route
            path="/dishes/update/:id"
            element={
              <Sidebar>
                <UpdateDishForm />
              </Sidebar>
            }
          />
          <Route
            path="/dishes/sub-categories"
            element={
              <Sidebar>
                <SubCategory />
              </Sidebar>
            }
          />
          <Route
            path="/dishes/sub-categories/add"
            element={
              <Sidebar>
                <AddSubCategory />
              </Sidebar>

            }
          />



        </Route>
      </Routes>
    </Router>
  );
}
