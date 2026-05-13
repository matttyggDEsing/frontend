import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, X, MessageSquare, User, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const TICKETS = [
  { id: 891, user: 'carlos@email.com', subject: 'Problema con mi pago', status: 'open',    priority: 'high',   created: '12/05/2025 10:30', agent: null,
    messages: [
      { from: 'user', text: 'Realicé un pago pero no me acreditó el saldo.', time: '10:30' },
      { from: 'support', text: 'Hola Carlos, estamos revisando tu caso. ¿Puedes enviarnos el comprobante?', time: '10:45' },
      { from: 'user', text: 'Acá está el comprobante: [comprobante.pdf]', time: '10:50' },
    ]
  },
  { id: 890, user: 'laura@email.com', subject: 'Orden cancelada sin motivo', status: 'open',    priority: 'medium', created: '12/05/2025 09:15', agent: 'Admin',
    messages: [
      { from: 'user', text: 'Mi orden #24150 fue cancelada automáticamente.', time: '09:15' },
    ]
  },
  { id: 889, user: 'matias@email.com', subject: 'Consulta sobre reposición', status: 'resolved', priority: 'low',    created: '11/05/2025 16:00', agent: 'Admin',
    messages: [
      { from: 'user', text: '¿Cuánto tiempo demora la reposición?', time: '16:00' },
      { from: 'support', text: 'La reposición demora entre 24-72 horas hábiles.', time: '16:10' },
      { from: 'user', text: 'Gracias, lo tendré en cuenta.', time: '16:15' },
    ]
  },
  { id: 888, user: 'sofia@email.com', subject: 'API Key no funciona', status: 'open',    priority: 'high',   created: '11/05/2025 14:30', agent: null,
    messages: [
      { from: 'user', text: 'Mi API Key genera error 401 en todas las peticiones.', time: '14:30' },
    ]
  },
]

const PRIORITY_CFG = {
  high:   { label: 'Alta',   bg: 'rgba(239,68,68,0.1)',   color: '#FCA5A5' },
  medium: { label: 'Media',  bg: 'rgba(245,158,11,0.1)',  color: '#FCD34D' },
  low:    { label: 'Baja',   bg: 'rgba(99,102,241,0.1)',  color: '#A5B4FC' },
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState(TICKETS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.includes(search) || String(t.id).includes(search)
    const matchStatus = filterStatus === 'all' || t.status === filterStatus
    return matchSearch && matchStatus
  })

  const sendReply = () => {
    if (!reply.trim()) return
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    const msg = { from: 'support', text: reply, time: now }
    setTickets(prev => prev.map(t =>
      t.id === selected.id ? { ...t, messages: [...t.messages, msg], agent: 'Admin' } : t
    ))
    setSelected(prev => ({ ...prev, messages: [...prev.messages, msg], agent: 'Admin' }))
    setReply('')
    toast.success('Respuesta enviada')
  }

  const resolveTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'resolved' }))
    toast.success('Ticket marcado como resuelto')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Tickets</h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>{tickets.filter(t => t.status === 'open').length} tickets abiertos</p>
      </motion.div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar tickets..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
          <option value="all">Todos</option>
          <option value="open">Abiertos</option>
          <option value="resolved">Resueltos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket list */}
        <div className="space-y-3">
          {filtered.map((t, i) => {
            const p = PRIORITY_CFG[t.priority]
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}
                onClick={() => setSelected(t)}
                className="rounded-xl border p-4 cursor-pointer transition-all"
                style={{
                  background: selected?.id === t.id ? 'rgba(16,185,129,0.05)' : 'var(--bg2)',
                  borderColor: selected?.id === t.id ? 'rgba(16,185,129,0.25)' : 'var(--border2)',
                }}
                onMouseEnter={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'var(--bg3)' }}
                onMouseLeave={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'var(--bg2)' }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-mono" style={{ color: 'var(--txt3)' }}>#{t.id}</span>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--txt)' }}>{t.subject}</h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: p.bg, color: p.color }}>{p.label}</span>
                    <span className={`badge ${t.status === 'open' ? 'badge-active' : 'badge-completed'}`}>{t.status === 'open' ? 'Abierto' : 'Resuelto'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--txt3)' }}>
                  <span>{t.user}</span>
                  <span>{t.created}</span>
                </div>
                {t.agent && <p className="text-xs mt-1" style={{ color: 'var(--em3)' }}>Asignado: {t.agent}</p>}
              </motion.div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--txt3)' }}>
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay tickets</p>
            </div>
          )}
        </div>

        {/* Ticket detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key={selected.id}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              className="rounded-2xl border flex flex-col overflow-hidden"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border2)', height: 'fit-content', maxHeight: '600px' }}>
              {/* Header */}
              <div className="px-5 py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: 'var(--border2)' }}>
                <div>
                  <h3 className="font-display font-semibold text-sm" style={{ color: 'var(--txt)' }}>{selected.subject}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--txt3)' }}>{selected.user}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status === 'open' && (
                    <button onClick={() => resolveTicket(selected.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--em3)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      Resolver
                    </button>
                  )}
                  <button onClick={() => setSelected(null)} style={{ color: 'var(--txt3)' }}><X size={15} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ maxHeight: '380px' }}>
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'support' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm`}
                      style={{
                        background: msg.from === 'support' ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                        border: `1px solid ${msg.from === 'support' ? 'rgba(16,185,129,0.2)' : 'var(--border2)'}`,
                        color: 'var(--txt)',
                      }}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--txt3)' }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              {selected.status === 'open' && (
                <div className="p-4 border-t" style={{ borderColor: 'var(--border2)' }}>
                  <div className="flex gap-2">
                    <textarea value={reply} onChange={e => setReply(e.target.value)}
                      placeholder="Escribir respuesta..."
                      rows={2}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none resize-none"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)', caretColor: 'var(--em)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                    />
                    <motion.button whileTap={{ scale: .95 }} onClick={sendReply}
                      className="px-3 rounded-xl self-end mb-0.5"
                      style={{ background: 'var(--em)', color: '#000', padding: '8px 12px' }}>
                      <Send size={15} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl border flex items-center justify-center py-24"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
              <div className="text-center" style={{ color: 'var(--txt3)' }}>
                <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Seleccioná un ticket para ver los detalles</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
