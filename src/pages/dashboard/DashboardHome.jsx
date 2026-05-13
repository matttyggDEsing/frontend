import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  ShoppingCart, TrendingUp, Clock, CheckCircle,
  Wallet, Zap, ArrowUpRight, ArrowDownRight, Plus
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

// Mock data — replace with real API calls
const CHART_DATA = [
  { day: 'Lun', orders: 12, revenue: 48 },
  { day: 'Mar', orders: 19, revenue: 76 },
  { day: 'Mié', orders: 8,  revenue: 32 },
  { day: 'Jue', orders: 24, revenue: 96 },
  { day: 'Vie', orders: 31, revenue: 124 },
  { day: 'Sáb', orders: 18, revenue: 72 },
  { day: 'Dom', orders: 22, revenue: 88 },
]

const RECENT_ORDERS = [
  { id: 23841, service: 'Instagram Seguidores — Real', link: 'instagram.com/user', qty: 1000, status: 'completed', amount: 4.50 },
  { id: 23840, service: 'TikTok Views — Premium',     link: 'tiktok.com/@user',   qty: 50000, status: 'active',    amount: 12.00 },
  { id: 23839, service: 'YouTube Views Retenidos',    link: 'youtube.com/watch',  qty: 10000, status: 'pending',   amount: 28.00 },
  { id: 23838, service: 'Spotify Streams',            link: 'open.spotify.com',   qty: 5000,  status: 'completed', amount: 6.50 },
  { id: 23837, service: 'Twitter/X Seguidores',       link: 'twitter.com/user',   qty: 500,   status: 'cancelled', amount: 3.20 },
]

const STATUS_CFG = {
  completed:  { label: 'Completada',  cls: 'badge-completed' },
  active:     { label: 'Activa',      cls: 'badge-active' },
  pending:    { label: 'Pendiente',   cls: 'badge-pending' },
  cancelled:  { label: 'Cancelada',   cls: 'badge-cancelled' },
  processing: { label: 'Procesando',  cls: 'badge-processing' },
}

function StatCard({ icon: Icon, label, value, change, changeType, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4, delay, ease: [.25,.46,.45,.94] }}
      className="rounded-2xl p-5 border relative overflow-hidden hover-glow transition-all"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{ background: color, transform: 'translate(30%,-30%)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
            changeType === 'up' ? 'text-emerald-400' : 'text-red-400'
          }`} style={{
            background: changeType === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
          }}>
            {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}%
          </div>
        )}
      </div>
      <div className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-1px' }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: 'var(--txt2)' }}>{label}</div>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm" style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      <p className="font-medium mb-2" style={{ color: 'var(--txt)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'orders' ? `${p.value} órdenes` : `$${p.value}`}
        </p>
      ))}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const [timeRange, setTimeRange] = useState('7d')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
            {greeting}, {user?.name?.split(' ')[0] || 'Usuario'} 👋
          </h1>
          <p className="text-sm" style={{ color:'var(--txt2)' }}>
            Aquí está el resumen de tu actividad hoy.
          </p>
        </div>
        <Link to="/dashboard/new-order">
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold transition-all"
            style={{ background:'var(--em)', color:'#000', boxShadow:'0 4px 20px rgba(16,185,129,0.3)' }}>
            <Plus size={16} />
            Nueva Orden
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet}       label="Balance disponible"  value={`$${user?.balance?.toFixed(2) || '0.00'}`} color="#10B981" delay={0} />
        <StatCard icon={ShoppingCart} label="Total órdenes"       value="142"   change={12}  changeType="up"   color="#60A5FA" delay={.05} />
        <StatCard icon={Clock}        label="Pendientes"          value="3"     color="#FCD34D" delay={.1} />
        <StatCard icon={CheckCircle}  label="Completadas"         value="138"   change={8}   changeType="up"   color="#A78BFA" delay={.15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay:.2 }}
          className="lg:col-span-2 rounded-2xl p-5 border"
          style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>Órdenes y Revenue</h2>
              <p className="text-xs mt-0.5" style={{ color:'var(--txt2)' }}>Últimos 7 días</p>
            </div>
            <div className="flex gap-1">
              {['7d','30d','90d'].map(r => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: timeRange === r ? 'rgba(16,185,129,0.12)' : 'transparent',
                    color: timeRange === r ? 'var(--em3)' : 'var(--txt3)',
                    border: `1px solid ${timeRange === r ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                  }}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top:0, right:0, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#60A5FA" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize:12, fill:'var(--txt3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fill:'var(--txt3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="orders"  name="orders"  stroke="#10B981" strokeWidth={2} fill="url(#ordersGrad)" dot={false} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#60A5FA" strokeWidth={2} fill="url(#revenueGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2 text-xs" style={{ color:'var(--txt2)' }}>
              <div className="w-3 h-0.5 rounded" style={{ background:'#10B981' }} />
              Órdenes
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color:'var(--txt2)' }}>
              <div className="w-3 h-0.5 rounded" style={{ background:'#60A5FA' }} />
              Revenue ($)
            </div>
          </div>
        </motion.div>

        {/* Bar chart — top services */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay:.25 }}
          className="rounded-2xl p-5 border"
          style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base mb-1" style={{ color:'var(--txt)' }}>Top Servicios</h2>
          <p className="text-xs mb-4" style={{ color:'var(--txt2)' }}>Por cantidad de órdenes</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name:'Instagram', value:48 },
              { name:'TikTok',    value:37 },
              { name:'YouTube',   value:22 },
              { name:'Twitter',   value:18 },
              { name:'Spotify',   value:10 },
            ]} margin={{ top:0, right:0, left:-30, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'var(--txt3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'var(--txt3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="orders" fill="#10B981" radius={[4,4,0,0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4, delay:.3 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:'var(--border2)' }}>
          <div>
            <h2 className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>Órdenes Recientes</h2>
            <p className="text-xs mt-0.5" style={{ color:'var(--txt2)' }}>Actividad de las últimas 24 horas</p>
          </div>
          <Link to="/dashboard/orders"
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color:'var(--em3)' }}>
            Ver todas <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)' }}>
                {['ID','Servicio','Enlace','Cant.','Estado','Monto'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color:'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => (
                <motion.tr key={order.id}
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:.3, delay: i * .05 }}
                  className="transition-colors"
                  style={{ borderBottom:'1px solid var(--border2)' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td className="px-5 py-3.5 text-sm font-mono" style={{ color:'var(--txt3)' }}>#{order.id}</td>
                  <td className="px-5 py-3.5 text-sm max-w-48" style={{ color:'var(--txt)' }}>
                    <div className="truncate">{order.service}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs max-w-32" style={{ color:'var(--txt3)' }}>
                    <div className="truncate">{order.link}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color:'var(--txt2)' }}>
                    {order.qty.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${STATUS_CFG[order.status].cls}`}>
                      {STATUS_CFG[order.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold font-display" style={{ color:'var(--em3)' }}>
                    ${order.amount.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Nueva Orden',   icon:Plus,         to:'/dashboard/new-order', color:'var(--em)' },
          { label:'Agregar Saldo', icon:Wallet,       to:'/dashboard/wallet',    color:'#60A5FA'   },
          { label:'Ver API',       icon:Zap,          to:'/dashboard/api',       color:'#A78BFA'   },
          { label:'Soporte',       icon:TrendingUp,   to:'/dashboard/tickets',   color:'#FCD34D'   },
        ].map(({ label, icon:Icon, to, color }, i) => (
          <motion.div key={to}
            initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:.3, delay:.35 + i*.05 }}>
            <Link to={to}>
              <motion.div whileHover={{ y:-3, borderColor:color + '50' }} whileTap={{ scale:.97 }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all"
                style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="text-xs font-medium" style={{ color:'var(--txt2)' }}>{label}</span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
