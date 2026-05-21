import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";

// Lazy loading admin pages
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLogin"));
const ProductManagement = lazy(() => import("../pages/admin/ProductManagement"));
const OrderManagement = lazy(() => import("../pages/admin/OrderManagement"));
const ErrorPage = lazy(() => import("../pages/error/ErrorPage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));

const AppRoutes = () => {
    const { isAdminAuthenticated, loading, user } = useSelector((state) => state.auth);

    if (loading) {
        return <Loader fullScreen text="Checking authentication..." />;
    }

    const getRootElement = () => {
        if (loading) return <Loader fullScreen text="Checking authentication..." />;
        
        // If admin is authenticated AND has the admin role, go to admin dashboard
        if (isAdminAuthenticated && user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        
        return <Navigate to="/admin/login" replace />;
    };

    return (
        <Suspense fallback={<Loader fullScreen text="Loading..." />}>
            <Routes>
                <Route path="/" element={getRootElement()} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<PublicRoute redirectTo="/admin/dashboard"><AdminLoginPage /></PublicRoute>} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute role="admin">
                        <ProductManagement />
                    </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedRoute role="admin">
                        <OrderManagement />
                    </ProtectedRoute>
                } />

                {/* Utility Routes */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
