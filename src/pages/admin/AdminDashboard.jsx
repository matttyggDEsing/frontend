import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, Activity, Clock, CheckCircle, XCircle } from 'lucide-react'

const CHART_DATA = [
  { day: 'Lun', revenue: 840,  orders: 42, users: 8  },
  { day: 'Mar', revenue: 1260, orders: 63, users: 15 },
  { day: 'Mié', revenue: 980,  orders: 49, users: 11 },
  { day: 'Jue', revenue: 1580, orders: 79, users: 22 },
  { day: 'Vie', revenue: 2140, orders: 107,users: 31 },
  { day: 'Sáb', revenue: 1720, orders: 86, users: 19 },
  { day: 'Dom', revenue: 1340, orders: 67, users: 14 },
]

const RECENT_ACTIVITY = [
  { type: 'order',  text: 'Nueva orden #24182 — Instagram Seguidores 5K', time: 'hace 2 min',  color: '#10B981' },
  { type: 'user',   text: 'Nuevo usuario registrado: martin@email.com',    time: 'hace 5 min',  color: '#60A5FA' },
  { type: 'order',  text: 'Orden #24179 completada',                        time: 'hace 8 min',  color: '#A78BFA' },
  { type: 'ticket', text: 'Ticket #891 — Problema con pago abierto',        time: 'hace 12 min', color: '#F59E0B' },
  { type: 'order',  text: 'Nueva orden #24181 — TikTok Views 50K',          time: 'hace 15 min', color: '#10B981' },
  { type: 'user',   text: 'Usuario carlos@email.com recargó $50',           time: 'hace 22 min', color: '#34D399' },
]

const TOP_SERVICES = [
  { name: 'Instagram Seguidores',  orders: 284, revenue: 1240 },
  { name: 'TikTok Views Premium',  orders: 219, revenue: 680  },
  { name: 'YouTube Views',         orders: 148, revenue: 2100 },
  { name: 'Spotify Streams',       orders: 97,  revenue: 540  },
  { name: 'Twitter Seguidores',    orders: 73,  revenue: 390  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm" style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <p className="font-medium mb-1" style={{ color: 'var(--txt)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'revenue' ? `$${p.value}` : p.value} {p.name}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const stats = [
    { icon: DollarSign, label: 'Ingresos hoy',    value: '$2,140',  change: '+18%', color: '#10B981' },
    { icon: ShoppingCart,  label: 'Órdenes hoy',  value: '107',     change: '+12%', color: '#60A5FA' },
    { icon: Users,         label: 'Usuarios tot.', value: '4,821',  change: '+5%',  color: '#A78BFA' },
    { icon: TrendingUp,    label: 'Margen prom.',  value: '34%',    change: '+2%',  color: '#F59E0B' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>
          Dashboard Admin
        </h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>Visión general del sistema en tiempo real</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, change, color }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
            className="rounded-2xl border p-5 relative overflow-hidden"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5"
              style={{ background: color, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399' }}>
                <ArrowUpRight size={11} />{change}
              </div>
            </div>
            <div className="font-display font-bold text-2xl mb-0.5" style={{ color: 'var(--txt)', letterSpacing: '-1px' }}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--txt3)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
          className="lg:col-span-2 rounded-2xl border p-5"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--txt)' }}>Ingresos esta semana</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity=".2" />
                  <stop offset="95%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
          className="rounded-2xl border p-5"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base mb-4" style={{ color: 'var(--txt)' }}>Órdenes diarias</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--txt3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="orders" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border2)' }}>
            <Activity size={15} style={{ color: 'var(--em)' }} />
            <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Actividad reciente</h2>
          </div>
          <div className="divide-y" style={{ '--tw-divide-color': 'var(--border2)' }}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--txt)' }}>{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--txt3)' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top services */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border2)' }}>
            <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Top servicios</h2>
          </div>
          <div className="p-5 space-y-3">
            {TOP_SERVICES.map((s, i) => {
              const maxOrders = TOP_SERVICES[0].orders
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--txt)' }}>{s.name}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--em3)' }}>${s.revenue}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg4)' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(s.orders / maxOrders) * 100}%` }}
                      transition={{ delay: .4 + i * .05, duration: .6, ease: [.25, .46, .45, .94] }}
                      className="h-full rounded-full" style={{ background: 'var(--em)' }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--txt3)' }}>{s.orders} órdenes</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
