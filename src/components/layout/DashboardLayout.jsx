import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, Package, Wallet, Ticket,
  Code2, Settings, LogOut, Bell, Search, ChevronLeft,
  Zap, Menu, X, TrendingUp, Plus, Shield
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'

const NAV = [
  { to: '/dashboard',            icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/dashboard/new-order',  icon: Plus,            label: 'Nueva Orden',  badge: 'hot' },
  { to: '/dashboard/orders',     icon: ShoppingCart,    label: 'Mis Órdenes' },
  { to: '/dashboard/services',   icon: Package,         label: 'Servicios' },
  { to: '/dashboard/wallet',     icon: Wallet,          label: 'Wallet' },
  { to: '/dashboard/tickets',    icon: Ticket,          label: 'Tickets' },
  { to: '/dashboard/api',        icon: Code2,           label: 'API' },
  { to: '/dashboard/settings',   icon: Settings,        label: 'Ajustes' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, collapseSidebar, unreadCount } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = ({ collapsed }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border2)' }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm text-black"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>N</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              className="font-display font-bold text-base" style={{ color: 'var(--txt)' }}>
              Nexa<span style={{ color: 'var(--em)' }}>Panel</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, badge, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: .97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative cursor-pointer"
                style={{
                  background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                  color: isActive ? 'var(--em3)' : 'var(--txt2)',
                }}>
                <Icon size={17} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1">{label}</motion.span>
                  )}
                </AnimatePresence>
                {badge === 'hot' && !collapsed && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md font-semibold"
                    style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--em3)', fontSize: '10px' }}>HOT</span>
                )}
                {isActive && (
                  <motion.div layoutId="active-pill" className="absolute right-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--em)' }} />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}

        {/* Admin link */}
        {user?.role === 'admin' && (
          <NavLink to="/admin">
            {({ isActive }) => (
              <motion.div whileHover={{ x: 2 }} whileTap={{ scale: .97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mt-2"
                style={{
                  background: isActive ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.04)',
                  border: '1px solid rgba(139,92,246,0.15)',
                  color: '#A78BFA',
                }}>
                <Shield size={17} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium">Admin Panel</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border2)' }}>
        {/* Balance chip */}
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
            <Wallet size={13} style={{ color: 'var(--em)' }} />
            <span className="text-xs" style={{ color: 'var(--txt2)' }}>Balance</span>
            <span className="text-xs font-display font-bold ml-auto" style={{ color: 'var(--em3)' }}>
              ${user?.balance?.toFixed(2) || '0.00'}
            </span>
          </motion.div>
        )}

        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--txt)' }}>{user?.name || 'Usuario'}</p>
                <p className="text-xs truncate" style={{ color: 'var(--txt3)' }}>{user?.email || ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleLogout}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: 'var(--txt3)' }} title="Cerrar sesión">
                <LogOut size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 68 : 240 }}
        transition={{ duration: .25, ease: [.25,.46,.45,.94] }}
        className="hidden md:flex flex-col flex-shrink-0 border-r relative"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <SidebarContent collapsed={sidebarCollapsed} />
        {/* Collapse button */}
        <button onClick={collapseSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10"
          style={{ background: 'var(--bg4)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
          <motion.div animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: .25 }}>
            <ChevronLeft size={12} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: .25, ease: [.25,.46,.45,.94] }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 flex flex-col md:hidden"
              style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border2)' }}>
              <SidebarContent collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          {/* Mobile menu */}
          <button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--txt2)' }}
            onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Search */}
          <button onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm text-left transition-all"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt3)' }}>
            <Search size={14} />
            <span className="text-sm">Buscar servicios...</span>
            <kbd className="ml-auto text-xs px-1.5 py-0.5 rounded"
              style={{ background: 'var(--bg4)', color: 'var(--txt3)', fontFamily: 'monospace' }}>⌘K</kbd>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <span className="live-dot" />
              <span className="text-xs" style={{ color: 'var(--em3)' }}>Sistema activo</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl transition-colors"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: 'var(--em)', fontSize: '9px' }}>{unreadCount}</span>
              )}
            </button>

            {/* New order CTA */}
            <button onClick={() => navigate('/dashboard/new-order')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-display transition-all"
              style={{ background: 'var(--em)', color: '#000' }}>
              <Zap size={14} />
              Nueva Orden
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg)' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .3, ease: [.25,.46,.45,.94] }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}






