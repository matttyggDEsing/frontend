import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Plus, ShoppingBag, ListOrdered,
  Calculator, FileText, CreditCard, Settings, LogOut,
  ChevronLeft, Store, Menu, X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

// ── Guard ────────────────────────────────────────────────────────────────────
export function SellerRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'seller' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const SELLER_NAV = [
  { to: '/vendedor',              icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/vendedor/clientes',     icon: Users,           label: 'Clientes' },
  { to: '/vendedor/nueva-venta',  icon: Plus,            label: 'Nueva Venta' },
  { to: '/vendedor/ventas',       icon: ShoppingBag,     label: 'Ventas' },
  { to: '/vendedor/ordenes-masivas', icon: ListOrdered,  label: 'Órdenes Masivas' },
  { to: '/vendedor/calculadora',  icon: Calculator,      label: 'Calculadora' },
  { to: '/vendedor/recibos',      icon: FileText,        label: 'Recibos' },
  { to: '/vendedor/metodos-pago', icon: CreditCard,      label: 'Métodos de Pago' },
  { to: '/vendedor/configuracion', icon: Settings,       label: 'Configuración' },
]

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent({ collapsed, onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
          <Store size={14} className="text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }}>
              <span className="font-display font-bold text-sm" style={{ color:'var(--em3)' }}>
                Panel Vendedor
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Mobile close */}
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1" style={{ color:'var(--txt3)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {SELLER_NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <motion.div whileHover={{ x:2 }} whileTap={{ scale:.97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: isActive ? 'rgba(16,185,129,0.10)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(16,185,129,0.22)' : 'transparent'}`,
                  color: isActive ? 'var(--em3)' : 'var(--txt2)',
                }}>
                <Icon size={17} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className="text-sm font-medium">{label}</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
        {/* User info */}
        {!collapsed && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-black"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color:'var(--txt)' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color:'var(--txt3)' }}>Vendedor</p>
            </div>
          </motion.div>
        )}

        <motion.button whileHover={{ x:2 }} onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all"
          style={{ color:'var(--txt3)' }}>
          <LogOut size={17} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="text-sm">Cerrar sesión</motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}

// ── Layout principal ──────────────────────────────────────────────────────────
export default function SellerLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  // Nombre de la página activa
  const activeNav = SELLER_NAV.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--bg)' }}>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration:.25, ease:[.25,.46,.45,.94] }}
        className="hidden md:flex flex-col flex-shrink-0 border-r relative"
        style={{ background:'var(--bg2)', borderColor:'rgba(16,185,129,0.15)' }}>
        <SidebarContent collapsed={collapsed} />
        <button onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background:'var(--bg4)', border:'1px solid rgba(16,185,129,0.2)', color:'var(--em3)' }}>
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration:.25 }}>
            <ChevronLeft size={12} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-40 md:hidden" style={{ background:'rgba(0,0,0,0.7)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x:-240 }} animate={{ x:0 }} exit={{ x:-240 }}
              transition={{ duration:.25, ease:[.25,.46,.45,.94] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col md:hidden"
              style={{ background:'var(--bg2)', borderRight:'1px solid rgba(16,185,129,0.15)' }}>
              <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ background:'var(--bg2)', borderColor:'rgba(16,185,129,0.15)' }}>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg" style={{ color:'var(--txt2)' }}
            onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2">
            <Store size={16} style={{ color:'var(--em)' }} />
            <span className="font-display font-semibold text-sm" style={{ color:'var(--em3)' }}>
              {activeNav?.label || 'Panel Vendedor'}
            </span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)' }}>
              <span className="live-dot" />
              <span className="text-xs" style={{ color:'var(--em3)' }}>Vendedor activo</span>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-black"
                style={{ background:'var(--em)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
              <span className="text-xs hidden sm:block" style={{ color:'var(--em4)' }}>{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background:'var(--bg)' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.3, ease:[.25,.46,.45,.94] }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
