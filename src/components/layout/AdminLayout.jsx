import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, ShoppingCart, Package, DollarSign, 
  Server, Ticket, Settings, LogOut, ChevronLeft, Shield
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const ADMIN_NAV = [
  { to: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/admin/users',     icon: Users,           label: 'Usuarios' },
  { to: '/admin/orders',    icon: ShoppingCart,    label: 'Órdenes' },
  { to: '/admin/services',  icon: Package,         label: 'Servicios' },
  { to: '/admin/providers', icon: Server,          label: 'Proveedores' },
  { to: '/admin/tickets',   icon: Ticket,          label: 'Tickets' },
  { to: '/admin/settings',  icon: Settings,        label: 'Ajustes' },
  { to: '/admin/deposits', icon: DollarSign, label: 'Depósitos' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: .25, ease: [.25,.46,.45,.94] }}
        className="flex flex-col flex-shrink-0 border-r relative"
        style={{ background: 'var(--bg2)', borderColor: 'rgba(139,92,246,0.15)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}>
            <Shield size={14} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }}
                className="font-display font-bold text-sm" style={{ color:'#A78BFA' }}>
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {ADMIN_NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {({ isActive }) => (
                <motion.div whileHover={{ x:2 }} whileTap={{ scale:.97 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(139,92,246,0.25)' : 'transparent'}`,
                    color: isActive ? '#A78BFA' : 'var(--txt2)',
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

        {/* Back to dashboard */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
          <motion.button whileHover={{ x:2 }} onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all"
            style={{ color: 'var(--txt3)' }}>
            <LogOut size={17} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="text-sm">Volver al panel</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <button onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background: 'var(--bg4)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}>
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration:.25 }}>
            <ChevronLeft size={12} />
          </motion.div>
        </button>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ background: 'var(--bg2)', borderColor: 'rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: '#A78BFA' }} />
            <span className="font-display font-semibold text-sm" style={{ color: '#A78BFA' }}>
              Admin — {user?.name}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6' }} />
            <span className="text-xs" style={{ color: '#A78BFA' }}>Panel Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg)' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}






