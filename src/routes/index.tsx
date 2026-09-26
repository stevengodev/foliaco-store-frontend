import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/users/store/authStore';

// Layouts
import { MainLayout, AuthLayout, AdminLayout } from '@/components/layout';

// Pages
import { HomePage } from '@/features/home/pages/HomePage';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { ProductDetailsPage } from '@/features/catalog/pages/ProductDetailsPage';
import { LoginPage } from '@/features/users/pages/LoginPage';
import { RegisterPage } from '@/features/users/pages/RegisterPage';
import { DashboardPage } from '@/features/admin/pages/DashboardPage';
import { AdminProductsPage } from '@/features/admin/pages/AdminProductsPage';
import { AdminProductFormPage } from '@/features/admin/pages/AdminProductFormPage';
import { AdminCategoriesPage } from '@/features/admin/pages/AdminCategoriesPage';
import { AdminCategoryFormPage } from '@/features/admin/pages/AdminCategoryFormPage';
import { CartPage } from '@/features/cart/pages/CartPage';
import { CheckoutPage } from '@/features/cart/pages/CheckoutPage';
import { MyOrdersPage } from '@/features/profile/pages/MyOrdersPage';
import { AdminOrdersPage } from '@/features/admin/pages/AdminOrdersPage';
import { AdminReceiptsPage } from '@/features/admin/pages/AdminReceiptsPage';
import { AdminInventoryPage } from '@/features/admin/pages/AdminInventoryPage';
import { AdminMovementsPage } from '@/features/admin/pages/AdminMovementsPage';
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage';
import { AdminSuppliersPage } from '@/features/admin/pages/AdminSuppliersPage';
import { AdminSupplierFormPage } from '@/features/admin/pages/AdminSupplierFormPage';
import { AdminPurchaseOrdersPage } from '@/features/admin/pages/AdminPurchaseOrdersPage';
import { AdminPurchaseOrderFormPage } from '@/features/admin/pages/AdminPurchaseOrderFormPage';

// Componente para pruebas de UI que reemplaza temporalmente a App.tsx original
import UIKitPage from '../App';

export const AppRoutes: React.FC = () => {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rutas Públicas - MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile/orders" element={<MyOrdersPage />} />
          
          {/* Ruta temporal para ver los componentes que construimos */}
          <Route path="/ui-kit" element={<UIKitPage />} />
        </Route>

        {/* Rutas de Autenticación - AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rutas de Administrador - AdminLayout */}
        {/* En el futuro aquí agregaremos ProtectedRoute para que solo entren admins */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirigir /admin a /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="catalog/products" element={<AdminProductsPage />} />
          <Route path="catalog/products/new" element={<AdminProductFormPage />} />
          <Route path="catalog/products/edit/:id" element={<AdminProductFormPage />} />
          <Route path="catalog/categories" element={<AdminCategoriesPage />} />
          <Route path="catalog/categories/new" element={<AdminCategoryFormPage />} />
          <Route path="catalog/categories/edit/:id" element={<AdminCategoryFormPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/receipts" element={<AdminReceiptsPage />} />
          <Route path="inventory/stock" element={<AdminInventoryPage />} />
          <Route path="inventory/movements" element={<AdminMovementsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="suppliers" element={<AdminSuppliersPage />} />
          <Route path="suppliers/new" element={<AdminSupplierFormPage />} />
          <Route path="suppliers/edit/:id" element={<AdminSupplierFormPage />} />
          <Route path="suppliers/orders" element={<AdminPurchaseOrdersPage />} />
          <Route path="suppliers/orders/new" element={<AdminPurchaseOrderFormPage />} />
          <Route path="suppliers/orders/edit/:id" element={<AdminPurchaseOrderFormPage />} />
        </Route>

        {/* Ruta comodín para 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
};
