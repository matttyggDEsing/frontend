import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserX, UserCheck, Eye, DollarSign, Edit2, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const USERS = [
  { id: 1, name: 'Carlos Mendoza',   email: 'carlos@email.com',   balance: 84.50,  orders: 142, spent: 620.80, status: 'active',  role: 'user',  joined: '12/01/2025' },
  { id: 2, name: 'Laura García',     email: 'laura@email.com',    balance: 210.00, orders: 88,  spent: 410.20, status: 'active',  role: 'user',  joined: '15/02/2025' },
  { id: 3, name: 'Matías Rodríguez', email: 'matias@email.com',   balance: 5.20,   orders: 31,  spent: 145.00, status: 'active',  role: 'user',  joined: '03/03/2025' },
  { id: 4, name: 'Ana Martínez',     email: 'ana@email.com',      balance: 0,      orders: 5,   spent: 22.40,  status: 'banned',  role: 'user',  joined: '20/03/2025' },
  { id: 5, name: 'Diego López',      email: 'diego@email.com',    balance: 48.90,  orders: 67,  spent: 280.60, status: 'active',  role: 'user',  joined: '01/04/2025' },
  { id: 6, name: 'Sofía Torres',     email: 'sofia@email.com',    balance: 120.00, orders: 203, spent: 890.40, status: 'active',  role: 'reseller', joined: '10/01/2025' },
  { id: 7, name: 'Admin User',       email: 'admin@nexapanel.io', balance: 0,      orders: 0,   spent: 0,      status: 'active',  role: 'admin', joined: '01/01/2025' },
]

function BalanceModal({ user, onClose, onSave }) {
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState('add')

  const handleSave = () => {
    if (!amount || isNaN(amount)) { toast.error('Ingresá un monto válido'); return }
    onSave(user.id, action, parseFloat(amount))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border p-5"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>Editar balance — {user.name}</h3>
          <button onClick={onClose} style={{ color: 'var(--txt3)' }}><X size={16} /></button>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--txt2)' }}>Balance actual: <span style={{ color: 'var(--em3)' }}>${user.balance.toFixed(2)}</span></p>
        <div className="flex gap-2 mb-4">
          {['add', 'subtract', 'set'].map(a => (
            <button key={a} onClick={() => setAction(a)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize"
              style={{ background: action === a ? 'rgba(16,185,129,0.12)' : 'var(--bg3)', color: action === a ? 'var(--em3)' : 'var(--txt3)', border: `1px solid ${action === a ? 'rgba(16,185,129,0.25)' : 'transparent'}` }}>
              {a === 'add' ? 'Agregar' : a === 'subtract' ? 'Restar' : 'Establecer'}
            </button>
          ))}
        </div>
        <input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="0.00"
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none mb-4"
          style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)', caretColor: 'var(--em)' }} />
        <button onClick={handleSave}
          className="w-full py-2.5 rounded-xl text-sm font-semibold font-display"
          style={{ background: 'var(--em)', color: '#000' }}>
          Guardar cambios
        </button>
      </motion.div>
    </div>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState(USERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [balanceModal, setBalanceModal] = useState(null)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    return matchSearch && matchStatus
  })

  const toggleBan = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u))
    const user = users.find(u => u.id === id)
    toast.success(user.status === 'banned' ? `${user.name} desbaneado` : `${user.name} baneado`)
  }

  const handleBalanceSave = (id, action, amount) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u
      let newBalance = u.balance
      if (action === 'add') newBalance += amount
      else if (action === 'subtract') newBalance = Math.max(0, newBalance - amount)
      else newBalance = amount
      return { ...u, balance: newBalance }
    }))
    toast.success('Balance actualizado')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AnimatePresence>
        {balanceModal && <BalanceModal user={balanceModal} onClose={() => setBalanceModal(null)} onSave={handleBalanceSave} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Usuarios</h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>{users.length} usuarios registrados</p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="banned">Baneados</option>
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
                {['Usuario', 'Balance', 'Órdenes', 'Gastado', 'Rol', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .03 }}
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--txt)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--txt3)' }}>{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-sm font-bold" style={{ color: 'var(--em3)' }}>${user.balance.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--txt2)' }}>{user.orders}</td>
                  <td className="px-5 py-3 text-sm font-mono" style={{ color: 'var(--txt2)' }}>${user.spent.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-md capitalize"
                      style={{
                        background: user.role === 'admin' ? 'rgba(139,92,246,0.12)' : user.role === 'reseller' ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)',
                        color: user.role === 'admin' ? '#A78BFA' : user.role === 'reseller' ? '#FCD34D' : 'var(--txt3)'
                      }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-cancelled'}`}>
                      {user.status === 'active' ? 'Activo' : 'Baneado'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setBalanceModal(user)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--txt3)' }}
                        title="Editar balance"
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--em3)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                        <DollarSign size={14} />
                      </button>
                      <button onClick={() => toggleBan(user.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--txt3)' }}
                        title={user.status === 'banned' ? 'Desbanear' : 'Banear'}
                        onMouseEnter={e => e.currentTarget.style.color = user.status === 'banned' ? '#34D399' : '#FCA5A5'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                        {user.status === 'banned' ? <UserCheck size={14} /> : <UserX size={14} />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--txt3)' }}>
            <p className="text-3xl mb-3">👥</p>
            <p className="text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
