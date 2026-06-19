import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import PublicLayout    from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AdminLayout     from '@/components/layout/AdminLayout'
import SellerLayout, { SellerRoute } from '@/components/layout/SellerLayout'

// Public pages
import LandingPage     from '@/pages/LandingPage'
import LoginPage       from '@/pages/LoginPage'
import RegisterPage    from '@/pages/RegisterPage'
import MaintenancePage from '@/pages/MaintenancePage'

// Dashboard pages
import DashboardHome from '@/pages/dashboard/DashboardHome'
import NewOrderPage  from '@/pages/dashboard/NewOrderPage'
import OrdersPage    from '@/pages/dashboard/OrdersPage'
import ServicesPage  from '@/pages/dashboard/ServicesPage'
import WalletPage    from '@/pages/dashboard/WalletPage'
import TicketsPage   from '@/pages/dashboard/TicketsPage'
import ApiPage       from '@/pages/dashboard/ApiPage'
import SettingsPage  from '@/pages/dashboard/SettingsPage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers     from '@/pages/admin/AdminUsers'
import AdminOrders    from '@/pages/admin/AdminOrders'
import AdminServices  from '@/pages/admin/AdminServices'
import AdminProviders from '@/pages/admin/AdminProviders'
import AdminTickets   from '@/pages/admin/AdminTickets'
import AdminDeposits  from '@/pages/admin/AdminDeposits'
import AdminSettings  from '@/pages/admin/AdminSettings'

// Seller pages
import SellerDashboard     from '@/pages/seller/SellerDashboard'
import SellerCustomers     from '@/pages/seller/SellerCustomers'
import SellerNewSale       from '@/pages/seller/SellerNewSale'
import SellerSales         from '@/pages/seller/SellerSales'
import SellerBulkOrders    from '@/pages/seller/SellerBulkOrders'
import SellerCalculator    from '@/pages/seller/SellerCalculator'
import SellerReceipts      from '@/pages/seller/SellerReceipts'
import SellerPaymentMethods from '@/pages/seller/SellerPaymentMethods'
import SellerSettings      from '@/pages/seller/SellerSettings'

// ── Guards ────────────────────────────────────────────────────────────────────
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
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return children
  // Redirigir al panel correcto si ya está logueado
  if (user?.role === 'admin')  return <Navigate to="/admin"    replace />
  if (user?.role === 'seller') return <Navigate to="/vendedor" replace />
  return <Navigate to="/dashboard" replace />
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login"       element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"    element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/maintenance" element={<MaintenancePage />} />

      {/* Dashboard (usuarios) */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index                  element={<DashboardHome />} />
        <Route path="new-order"       element={<NewOrderPage />} />
        <Route path="orders"          element={<OrdersPage />} />
        <Route path="services"        element={<ServicesPage />} />
        <Route path="wallet"          element={<WalletPage />} />
        <Route path="tickets"         element={<TicketsPage />} />
        <Route path="api"             element={<ApiPage />} />
        <Route path="settings"        element={<SettingsPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index              element={<AdminDashboard />} />
        <Route path="users"       element={<AdminUsers />} />
        <Route path="orders"      element={<AdminOrders />} />
        <Route path="services"    element={<AdminServices />} />
        <Route path="providers"   element={<AdminProviders />} />
        <Route path="tickets"     element={<AdminTickets />} />
        <Route path="deposits"    element={<AdminDeposits />} />
        <Route path="settings"    element={<AdminSettings />} />
      </Route>

      {/* Vendedor */}
      <Route path="/vendedor" element={<SellerRoute><SellerLayout /></SellerRoute>}>
        <Route index                    element={<SellerDashboard />} />
        <Route path="clientes"          element={<SellerCustomers />} />
        <Route path="nueva-venta"       element={<SellerNewSale />} />
        <Route path="ventas"            element={<SellerSales />} />
        <Route path="ordenes-masivas"   element={<SellerBulkOrders />} />
        <Route path="calculadora"       element={<SellerCalculator />} />
        <Route path="recibos"           element={<SellerReceipts />} />
        <Route path="metodos-pago"      element={<SellerPaymentMethods />} />
        <Route path="configuracion"     element={<SellerSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
