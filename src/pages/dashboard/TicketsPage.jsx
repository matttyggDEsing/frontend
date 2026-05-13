import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Send, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const TICKETS = [
  { id: 'TK-001', subject: 'Mi orden no inició después de 1 hora', status: 'open',   priority: 'high',   updated: 'hace 5 min',  unread: 2 },
  { id: 'TK-002', subject: 'Solicitud de reembolso orden #23837',  status: 'closed', priority: 'medium', updated: 'ayer',        unread: 0 },
  { id: 'TK-003', subject: 'Consulta sobre panel reseller',         status: 'open',   priority: 'low',    updated: 'hace 2 días', unread: 0 },
]

const MESSAGES_DB = {
  'TK-001': [
    { id: 1, from: 'user',    text: 'Hola, hice una orden hace más de 1 hora y todavía no ha iniciado. El ID es #23835.',       time: '14:10' },
    { id: 2, from: 'support', text: 'Hola! Gracias por contactarnos. Estamos verificando el estado de tu orden.', time: '14:12', agent: 'Soporte NexaPanel' },
    { id: 3, from: 'support', text: 'Revisamos tu orden #23835. Hubo un pequeño retraso con el proveedor. La orden comenzará en los próximos 10 minutos. Disculpa las molestias.', time: '14:15', agent: 'Soporte NexaPanel' },
    { id: 4, from: 'user',    text: 'Gracias, espero que sea así.',                                                               time: '14:16' },
  ],
  'TK-002': [
    { id: 1, from: 'user',    text: 'Quiero solicitar un reembolso por la orden #23837 que fue cancelada.',                      time: '10:00' },
    { id: 2, from: 'support', text: 'El reembolso de $3.20 ya fue procesado a tu wallet.', time: '10:05', agent: 'Soporte NexaPanel' },
    { id: 3, from: 'user',    text: 'Perfecto, gracias!',                                                                          time: '10:08' },
  ],
  'TK-003': [
    { id: 1, from: 'user',    text: '¿Cómo puedo activar el panel reseller? ¿Necesito un plan específico?',                      time: '09:00' },
  ],
}

const PRIORITY_CFG = {
  high:   { label: 'Alta',  color: '#F87171', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Media', color: '#FCD34D', bg: 'rgba(245,158,11,0.1)' },
  low:    { label: 'Baja',  color: '#93C5FD', bg: 'rgba(59,130,246,0.1)' },
}

export default function TicketsPage() {
  const [tickets, setTickets]   = useState(TICKETS)
  const [messages, setMessages] = useState(MESSAGES_DB)
  const [selected, setSelected] = useState(TICKETS[0])
  const [input, setInput]       = useState('')
  const [showNew, setShowNew]   = useState(false)
  const [newSubject, setNewSubject]   = useState('')
  const [newMsg, setNewMsg]           = useState('')
  const [newPriority, setNewPriority] = useState('medium')

  const sendMessage = () => {
    if (!input.trim()) return
    const msg = {
      id: Date.now(), from: 'user', text: input.trim(),
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), msg] }))
    setInput('')
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1, from: 'support',
        text: 'Gracias por tu mensaje. Un agente revisará tu caso y te responderá pronto.',
        time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
        agent: 'Soporte NexaPanel',
      }
      setMessages(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] || []), reply] }))
    }, 1500)
  }

  const createTicket = () => {
    if (!newSubject.trim() || !newMsg.trim()) { toast.error('Completa todos los campos'); return }
    const id = `TK-00${tickets.length + 1}`
    const ticket = { id, subject: newSubject, status: 'open', priority: newPriority, updated: 'ahora', unread: 0 }
    setTickets(prev => [ticket, ...prev])
    setMessages(prev => ({
      ...prev,
      [id]: [{ id: 1, from: 'user', text: newMsg, time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }) }],
    }))
    setSelected(ticket)
    setShowNew(false)
    setNewSubject('')
    setNewMsg('')
    toast.success('Ticket creado exitosamente')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Tickets de Soporte</h1>
          <p className="text-sm" style={{ color: 'var(--txt2)' }}>Tiempo de respuesta promedio: 8 minutos.</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold"
          style={{ background: 'var(--em)', color: '#000', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
          <Plus size={16} /> Nuevo Ticket
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: '600px' }}>
        {/* Ticket list */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 }}
          className="rounded-2xl border overflow-hidden flex flex-col"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border2)' }}>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--txt3)' }}>
              {tickets.length} tickets
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .05 }}
                onClick={() => setSelected(t)}
                className="px-4 py-3.5 cursor-pointer transition-colors border-b relative"
                style={{
                  borderColor: 'var(--border2)',
                  background: selected?.id === t.id ? 'rgba(16,185,129,0.06)' : 'transparent',
                  borderLeft: selected?.id === t.id ? '2px solid var(--em)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'var(--bg3)' }}
                onMouseLeave={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'transparent' }}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--txt)' }}>{t.subject}</p>
                  {t.unread > 0 && (
                    <span className="flex-shrink-0 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-black"
                      style={{ background: 'var(--em)', fontSize: '9px' }}>{t.unread}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono" style={{ color: 'var(--txt3)' }}>{t.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: PRIORITY_CFG[t.priority].bg, color: PRIORITY_CFG[t.priority].color }}>
                    {PRIORITY_CFG[t.priority].label}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--txt3)' }}>{t.updated}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {t.status === 'open'
                    ? <><Clock size={10} style={{ color: 'var(--em)' }} /><span className="text-xs" style={{ color: 'var(--em)' }}>Abierto</span></>
                    : <><CheckCircle size={10} style={{ color: 'var(--txt3)' }} /><span className="text-xs" style={{ color: 'var(--txt3)' }}>Cerrado</span></>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat window */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
          className="lg:col-span-2 rounded-2xl border flex flex-col overflow-hidden"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
          {selected ? (
            <>
              {/* Chat header */}
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border2)' }}>
                <div>
                  <p className="font-display font-semibold text-sm" style={{ color: 'var(--txt)' }}>{selected.subject}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono" style={{ color: 'var(--txt3)' }}>{selected.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: PRIORITY_CFG[selected.priority].bg, color: PRIORITY_CFG[selected.priority].color }}>
                      {PRIORITY_CFG[selected.priority].label}
                    </span>
                  </div>
                </div>
                {selected.status === 'open' && (
                  <button onClick={() => { setTickets(prev => prev.map(t => t.id === selected.id ? { ...t, status: 'closed' } : t)); setSelected(prev => ({ ...prev, status: 'closed' })); toast.success('Ticket cerrado') }}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'var(--bg4)', color: 'var(--txt2)', border: '1px solid var(--border2)' }}>
                    Cerrar ticket
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <AnimatePresence>
                  {(messages[selected.id] || []).map((msg, i) => (
                    <motion.div key={msg.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: i * .04 }}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div style={{ maxWidth: '75%' }}>
                        {msg.from === 'support' && (
                          <p className="text-xs mb-1.5 ml-1" style={{ color: 'var(--em3)' }}>{msg.agent}</p>
                        )}
                        <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                          style={{
                            background: msg.from === 'user' ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                            border: `1px solid ${msg.from === 'user' ? 'rgba(16,185,129,0.2)' : 'var(--border2)'}`,
                            color: 'var(--txt)',
                            borderBottomRightRadius: msg.from === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.from === 'support' ? '4px' : '16px',
                          }}>
                          {msg.text}
                        </div>
                        <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-right mr-1' : 'ml-1'}`} style={{ color: 'var(--txt3)' }}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input */}
              {selected.status === 'open' ? (
                <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border2)' }}>
                  <div className="flex gap-2">
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Escribe tu mensaje... (Enter para enviar)"
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)', caretColor: 'var(--em)' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                    />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
                      onClick={sendMessage}
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--em)', color: '#000' }}>
                      <Send size={15} />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 border-t text-center" style={{ borderColor: 'var(--border2)' }}>
                  <p className="text-sm" style={{ color: 'var(--txt3)' }}>Este ticket está cerrado.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--txt3)' }}>
              <p className="text-sm">Selecciona un ticket para ver la conversación</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* New ticket modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowNew(false)}>
            <motion.div initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .95 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-4"
              style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg" style={{ color: 'var(--txt)' }}>Nuevo Ticket</h2>
                <button onClick={() => setShowNew(false)} style={{ color: 'var(--txt3)' }}><X size={18} /></button>
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--txt3)' }}>ASUNTO</label>
                <input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                  placeholder="Describe brevemente tu problema..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--txt3)' }}>PRIORIDAD</label>
                <div className="flex gap-2">
                  {Object.entries(PRIORITY_CFG).map(([key, cfg]) => (
                    <button key={key} onClick={() => setNewPriority(key)}
                      className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: newPriority === key ? cfg.bg : 'var(--bg3)',
                        color: newPriority === key ? cfg.color : 'var(--txt3)',
                        border: `1px solid ${newPriority === key ? cfg.color + '40' : 'var(--border2)'}`,
                      }}>{cfg.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--txt3)' }}>MENSAJE</label>
                <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} rows={4}
                  placeholder="Describe tu problema en detalle..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border2)'}
                />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                onClick={createTicket}
                className="w-full py-3 rounded-xl font-display font-bold text-sm"
                style={{ background: 'var(--em)', color: '#000' }}>
                Crear Ticket
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
