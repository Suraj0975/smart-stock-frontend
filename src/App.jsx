
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";

import CategoriesPage from "./pages/CategoriesPage";
import InventoryPage from "./pages/InventoryPage";
import SuppliersPage from "./pages/SuppliersPage";


import AddPurchasePage from "./pages/AddPurchasePage";

import SalesPage from "./pages/SalesPage";
import NewSalePage from "./pages/NewSalePage";
import InvoicesPage from "./pages/InvoicesPage";

import AnalyticsPage from "./pages/AnalyticsPage";
import AIPredictionsPage from "./pages/AIPredictionsPage";
import ReportsPage from "./pages/ReportsPage";

import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import MarketWatchlistPage from "./pages/MarketWatchlistPage";

export default function App() {
  return (
    <Routes>
      {/* Public authentication pages */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected application pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Market Watchlist */}
          <Route
            path="/market-watchlist"
            element={<MarketWatchlistPage />}
          />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />

          
          <Route path="/purchases/new" element={<AddPurchasePage />} />

          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sales/new" element={<NewSalePage />} />
          <Route path="/invoices" element={<InvoicesPage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-predictions" element={<AIPredictionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Unknown URLs */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
