import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Plus, RefreshCw, Eye, EyeOff, Edit2, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const PROVIDERS = [
  { id: 1, name: 'SMM King',      url: 'https://smmking.com/api/v2',   apiKey: 'sk_live_abc123xxx', balance: 842.50, services: 142, status: 'active', synced: 'hace 2h'  },
  { id: 2, name: 'JustAnotherPanel', url: 'https://justanotherpanel.com/api/v2', apiKey: 'jap_key_xyz789', balance: 210.00, services: 88, status: 'active', synced: 'hace 5h' },
  { id: 3, name: 'SMMFollow',     url: 'https://smmfollow.com/api',    apiKey: 'smf_test_key_001', balance: 0,      services: 0,   status: 'error',  synced: 'nunca'    },
]

function ProviderModal({ provider, onClose, onSave }) {
  const [form, setForm] = useState(provider || { name: '', url: '', apiKey: '' })
  const [showKey, setShowKey] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.url || !form.apiKey) { toast.error('Completa todos los campos'); return }
    onSave({ ...form, id: form.id || Date.now(), balance: form.balance || 0, services: form.services || 0, status: 'active', synced: 'nunca' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border p-6 space-y-4"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>{provider ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>
          <button onClick={onClose} style={{ color: 'var(--txt3)' }}><X size={16} /></button>
        </div>
        {[
          { label: 'Nombre del proveedor', key: 'name', type: 'text', placeholder: 'SMM King' },
          { label: 'URL de la API', key: 'url', type: 'text', placeholder: 'https://proveedor.com/api/v2' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>API Key</label>
          <div className="relative">
            <input type={showKey ? 'text' : 'password'} value={form.apiKey} onChange={e => set('apiKey', e.target.value)} placeholder="sk_live_..."
              className="w-full px-4 pr-10 py-2.5 rounded-xl text-sm outline-none font-mono"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }} />
            <button type="button" onClick={() => setShowKey(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt3)' }}>
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <button onClick={handleSave} className="w-full py-2.5 rounded-xl text-sm font-semibold font-display" style={{ background: 'var(--em)', color: '#000' }}>
          {provider ? 'Guardar cambios' : 'Agregar proveedor'}
        </button>
      </motion.div>
    </div>
  )
}

export default function AdminProviders() {
  const [providers, setProviders] = useState(PROVIDERS)
  const [modal, setModal] = useState(null)
  const [syncing, setSyncing] = useState(null)
  const [showKeys, setShowKeys] = useState({})

  const syncProvider = async (id) => {
    setSyncing(id)
    await new Promise(r => setTimeout(r, 1500))
    setSyncing(null)
    setProviders(prev => prev.map(p => p.id === id ? { ...p, synced: 'hace un momento', status: 'active' } : p))
    toast.success('Servicios sincronizados exitosamente')
  }

  const deleteProvider = (id) => {
    setProviders(prev => prev.filter(p => p.id !== id))
    toast.success('Proveedor eliminado')
  }

  const handleSave = (prov) => {
    setProviders(prev => {
      const exists = prev.find(p => p.id === prov.id)
      return exists ? prev.map(p => p.id === prov.id ? prov : p) : [...prev, prov]
    })
    toast.success(modal?.id ? 'Proveedor actualizado' : 'Proveedor agregado')
  }

  const toggleKey = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AnimatePresence>
        {modal !== null && <ProviderModal provider={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Proveedores</h1>
          <p className="text-sm" style={{ color: 'var(--txt2)' }}>Gestiona las APIs de proveedores SMM</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-display"
          style={{ background: 'var(--em)', color: '#000' }}>
          <Plus size={15} /> Agregar proveedor
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        {providers.map((prov, i) => (
          <motion.div key={prov.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}
            className="rounded-2xl border p-5"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: prov.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${prov.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  {prov.status === 'active' ? <CheckCircle size={18} style={{ color: 'var(--em3)' }} /> : <AlertCircle size={18} style={{ color: '#FCA5A5' }} />}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>{prov.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--txt3)' }}>{prov.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: .95 }} onClick={() => syncProvider(prov.id)} disabled={syncing === prov.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: 'var(--bg3)', color: 'var(--txt2)', border: '1px solid var(--border2)' }}>
                  <motion.div animate={{ rotate: syncing === prov.id ? 360 : 0 }} transition={{ duration: 1, repeat: syncing === prov.id ? Infinity : 0, ease: 'linear' }}>
                    <RefreshCw size={12} />
                  </motion.div>
                  {syncing === prov.id ? 'Sincronizando...' : 'Sincronizar'}
                </motion.button>
                <button onClick={() => setModal(prov)} className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--txt3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#93C5FD'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteProvider(prov.id)} className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--txt3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FCA5A5'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Balance', value: `$${prov.balance.toFixed(2)}`, color: 'var(--em3)' },
                { label: 'Servicios', value: prov.services, color: 'var(--txt)' },
                { label: 'Sincronizado', value: prov.synced, color: 'var(--txt2)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg3)' }}>
                  <p className="font-display font-bold text-lg" style={{ color, letterSpacing: '-0.5px' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--txt3)' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 px-3 py-2 rounded-xl font-mono text-xs"
                style={{ background: 'var(--bg3)', color: 'var(--txt3)', border: '1px solid var(--border2)' }}>
                {showKeys[prov.id] ? prov.apiKey : prov.apiKey.slice(0, 8) + '••••••••••••••••'}
              </div>
              <button onClick={() => toggleKey(prov.id)} style={{ color: 'var(--txt3)' }}>
                {showKeys[prov.id] ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
