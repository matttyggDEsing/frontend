import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, RefreshCw, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const MOCK_ORDERS = [
  { id: 23841, service: 'Instagram Seguidores — Real Alta Calidad', link: 'instagram.com/user1', qty: 1000,  start: 847,   remains: 153,   status: 'active',     amount: 4.50,  date: '2025-01-15 14:32' },
  { id: 23840, service: 'TikTok Views — Máxima Velocidad',          link: 'tiktok.com/@user2',  qty: 50000, start: 50000, remains: 0,     status: 'completed',  amount: 12.00, date: '2025-01-15 13:10' },
  { id: 23839, service: 'YouTube Views Retenidos 60%+',             link: 'youtube.com/watchXX', qty: 10000, start: 3200,  remains: 6800,  status: 'processing', amount: 28.00, date: '2025-01-15 12:45' },
  { id: 23838, service: 'Spotify Streams',                          link: 'open.spotify.com/t', qty: 5000,  start: 5000,  remains: 0,     status: 'completed',  amount: 6.50,  date: '2025-01-15 11:20' },
  { id: 23837, service: 'Twitter/X Seguidores Reales',              link: 'twitter.com/user3',  qty: 500,   start: 0,     remains: 500,   status: 'cancelled',  amount: 3.20,  date: '2025-01-15 10:05' },
  { id: 23836, service: 'Instagram Likes — Premium',                link: 'instagram.com/p/XX', qty: 2000,  start: 2000,  remains: 0,     status: 'completed',  amount: 2.40,  date: '2025-01-14 22:18' },
  { id: 23835, service: 'Telegram Miembros de Canal',               link: 't.me/channel',       qty: 1000,  start: 0,     remains: 1000,  status: 'pending',    amount: 5.50,  date: '2025-01-14 21:00' },
  { id: 23834, service: 'Facebook Page Likes',                      link: 'facebook.com/page',  qty: 3000,  start: 3000,  remains: 0,     status: 'completed',  amount: 9.00,  date: '2025-01-14 18:44' },
]

const STATUS_CFG = {
  completed:  { label: 'Completada',  cls: 'badge-completed' },
  active:     { label: 'Activa',      cls: 'badge-active' },
  pending:    { label: 'Pendiente',   cls: 'badge-pending' },
  cancelled:  { label: 'Cancelada',   cls: 'badge-cancelled' },
  processing: { label: 'Procesando',  cls: 'badge-processing' },
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 6

  const filtered = MOCK_ORDERS.filter(o => {
    const matchSearch = o.service.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search) || o.link.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
          Mis Órdenes
        </h1>
        <p className="text-sm" style={{ color:'var(--txt2)' }}>Historial completo de todas tus órdenes.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
        className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID, servicio o enlace..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
            onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color:'var(--txt3)' }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { key:'all',        label:'Todas' },
            { key:'active',     label:'Activas' },
            { key:'pending',    label:'Pendientes' },
            { key:'processing', label:'Procesando' },
            { key:'completed',  label:'Completadas' },
            { key:'cancelled',  label:'Canceladas' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => { setStatusFilter(key); setPage(1) }}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: statusFilter === key ? 'rgba(16,185,129,0.1)' : 'var(--bg2)',
                border: `1px solid ${statusFilter === key ? 'rgba(16,185,129,0.25)' : 'var(--border2)'}`,
                color: statusFilter === key ? 'var(--em3)' : 'var(--txt2)',
              }}>{label}</button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ml-auto"
          style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg3)' }}>
                {['ID','Servicio','Enlace','Progreso','Estado','Monto','Fecha',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color:'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((order, i) => {
                  const pct = order.qty > 0 ? Math.round(((order.qty - order.remains) / order.qty) * 100) : 0
                  return (
                    <motion.tr key={order.id}
                      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0 }} transition={{ duration:.2, delay:i*.04 }}
                      className="transition-colors"
                      style={{ borderBottom:'1px solid var(--border2)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td className="px-4 py-3.5 text-xs font-mono" style={{ color:'var(--txt3)' }}>#{order.id}</td>
                      <td className="px-4 py-3.5 max-w-40">
                        <p className="text-sm truncate" style={{ color:'var(--txt)' }}>{order.service}</p>
                        <p className="text-xs mt-0.5" style={{ color:'var(--txt3)' }}>Cant: {order.qty.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-3.5 max-w-28">
                        <div className="flex items-center gap-1">
                          <span className="text-xs truncate" style={{ color:'var(--txt3)' }}>{order.link}</span>
                          <ExternalLink size={10} style={{ color:'var(--txt3)', flexShrink:0 }} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 min-w-28">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'var(--bg4)' }}>
                            <motion.div
                              initial={{ width:0 }} animate={{ width:`${pct}%` }}
                              transition={{ duration:.8, delay:.2 + i*.05 }}
                              className="h-full rounded-full"
                              style={{ background: pct === 100 ? '#10B981' : pct > 50 ? '#60A5FA' : '#FCD34D' }} />
                          </div>
                          <span className="text-xs font-mono flex-shrink-0" style={{ color:'var(--txt3)' }}>{pct}%</span>
                        </div>
                        <p className="text-xs mt-1" style={{ color:'var(--txt3)' }}>
                          Resto: {order.remains.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`badge ${STATUS_CFG[order.status].cls}`}>
                          {STATUS_CFG[order.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-display font-bold text-sm" style={{ color:'var(--em3)' }}>
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color:'var(--txt3)' }}>
                        {order.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="text-xs px-2.5 py-1 rounded-lg transition-all"
                          style={{ background:'var(--bg4)', color:'var(--txt3)', border:'1px solid var(--border2)' }}
                          onMouseEnter={e => { e.target.style.borderColor='rgba(16,185,129,0.3)'; e.target.style.color='var(--em3)' }}
                          onMouseLeave={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--txt3)' }}>
                          Ver
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16" style={{ color:'var(--txt3)' }}>
                    <p className="text-sm">No se encontraron órdenes</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:'var(--border2)' }}>
            <p className="text-xs" style={{ color:'var(--txt3)' }}>
              Mostrando {(page-1)*perPage+1}–{Math.min(page*perPage, filtered.length)} de {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
                style={{ background:'var(--bg3)', color:'var(--txt2)' }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: p === page ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                    color: p === page ? 'var(--em3)' : 'var(--txt2)',
                    border: `1px solid ${p === page ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                  }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
                style={{ background:'var(--bg3)', color:'var(--txt2)' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
