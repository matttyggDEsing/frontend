import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const ORDERS = [
  { id: 24182, user: 'carlos@email.com',  service: 'Instagram Seguidores — Real', link: 'instagram.com/user1',  qty: 5000,  status: 'active',     amount: 4.50,  date: '12/05/2025 14:32' },
  { id: 24181, user: 'sofia@email.com',   service: 'TikTok Views Premium',        link: 'tiktok.com/@sofia',    qty: 50000, status: 'pending',    amount: 2.50,  date: '12/05/2025 14:28' },
  { id: 24180, user: 'matias@email.com',  service: 'YouTube Views Retenidos',     link: 'youtube.com/watch?v=x',qty: 10000, status: 'processing', amount: 28.00, date: '12/05/2025 14:15' },
  { id: 24179, user: 'laura@email.com',   service: 'Spotify Streams',             link: 'open.spotify.com/t/x', qty: 5000,  status: 'completed',  amount: 4.00,  date: '12/05/2025 13:50' },
  { id: 24178, user: 'diego@email.com',   service: 'Twitter/X Seguidores',        link: 'twitter.com/diegoL',   qty: 500,   status: 'completed',  amount: 0.75,  date: '12/05/2025 13:20' },
  { id: 24177, user: 'carlos@email.com',  service: 'Instagram Likes — Premium',   link: 'instagram.com/p/abc',  qty: 2000,  status: 'cancelled',  amount: 0.60,  date: '12/05/2025 12:45' },
  { id: 24176, user: 'sofia@email.com',   service: 'Telegram Miembros',           link: 't.me/channel',         qty: 1000,  status: 'completed',  amount: 1.10,  date: '12/05/2025 11:30' },
  { id: 24175, user: 'ana@email.com',     service: 'Facebook Page Likes',         link: 'fb.com/page',          qty: 500,   status: 'completed',  amount: 0.90,  date: '12/05/2025 10:15' },
]

const STATUS_OPTS = ['all', 'pending', 'active', 'processing', 'completed', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(ORDERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = orders.filter(o => {
    const matchSearch = String(o.id).includes(search) || o.user.includes(search) || o.service.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    toast.success(`Orden #${id} marcada como ${newStatus}`)
  }

  const statusCls = { pending: 'badge-pending', active: 'badge-active', processing: 'badge-processing', completed: 'badge-completed', cancelled: 'badge-cancelled' }
  const statusLabel = { pending: 'Pendiente', active: 'Activa', processing: 'Procesando', completed: 'Completada', cancelled: 'Cancelada' }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Órdenes</h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>Todas las órdenes del sistema</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por ID, usuario, servicio..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none capitalize"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
          {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'all' ? 'Todos' : statusLabel[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border2)', background: 'var(--bg3)' }}>
                {['ID', 'Usuario', 'Servicio', 'Link', 'Cantidad', 'Estado', 'Monto', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .03 }}
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3">
                    <code className="text-sm" style={{ color: 'var(--em3)' }}>#{order.id}</code>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--txt3)' }}>{order.user}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm" style={{ color: 'var(--txt)' }}>{order.service}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs truncate max-w-[120px] block" style={{ color: 'var(--txt3)' }}>{order.link}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--txt2)' }}>{order.qty.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusCls[order.status]}`}>{statusLabel[order.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono font-bold" style={{ color: 'var(--em3)' }}>${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--txt3)' }}>{order.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {order.status !== 'completed' && (
                        <button onClick={() => updateStatus(order.id, 'completed')}
                          className="p-1.5 rounded-lg transition-colors" title="Completar"
                          style={{ color: 'var(--txt3)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#34D399'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')}
                          className="p-1.5 rounded-lg transition-colors" title="Cancelar"
                          style={{ color: 'var(--txt3)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#FCA5A5'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                          <XCircle size={14} />
                        </button>
                      )}
                      {['pending', 'active'].includes(order.status) && (
                        <button onClick={() => updateStatus(order.id, 'processing')}
                          className="p-1.5 rounded-lg transition-colors" title="Marcar procesando"
                          style={{ color: 'var(--txt3)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#93C5FD'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--txt3)' }}>
            <p className="text-3xl mb-3">📦</p>
            <p className="text-sm">No se encontraron órdenes</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
