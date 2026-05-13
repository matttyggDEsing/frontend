import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Public pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

// Dashboard pages
import DashboardHome from '@/pages/dashboard/DashboardHome'
import NewOrderPage from '@/pages/dashboard/NewOrderPage'
import OrdersPage from '@/pages/dashboard/OrdersPage'
import ServicesPage from '@/pages/dashboard/ServicesPage'
import WalletPage from '@/pages/dashboard/WalletPage'
import TicketsPage from '@/pages/dashboard/TicketsPage'
import ApiPage from '@/pages/dashboard/ApiPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminServices from '@/pages/admin/AdminServices'
import AdminProviders from '@/pages/admin/AdminProviders'
import AdminTickets from '@/pages/admin/AdminTickets'
import AdminSettings from '@/pages/admin/AdminSettings'

// Guards
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="new-order" element={<NewOrderPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="api" element={<ApiPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
