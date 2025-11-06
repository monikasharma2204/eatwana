import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/landing/Home";
import Navbar from "./components/landing/Navbar";
import Login from "./pages/landing/Login";
import Signup from "./pages/landing/SignUp";
import ForgotPassword from "./pages/landing/ForgotPassword";



export default function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}
