import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

const INITIAL_SERVICES = [
  { id: 1001, category: 'instagram', name: 'Instagram Seguidores — Real Alta Calidad', min: 100, max: 100000, rate: 0.90, active: true },
  { id: 1002, category: 'instagram', name: 'Instagram Likes — Premium',               min: 50,  max: 50000,  rate: 0.30, active: true },
  { id: 1003, category: 'instagram', name: 'Instagram Views Reel',                    min: 1000,max: 1000000,rate: 0.10, active: true },
  { id: 2001, category: 'tiktok',    name: 'TikTok Views — Máxima Velocidad',         min: 1000,max: 5000000,rate: 0.05, active: true },
  { id: 2002, category: 'tiktok',    name: 'TikTok Seguidores Reales',                min: 100, max: 50000,  rate: 1.20, active: false },
  { id: 3001, category: 'youtube',   name: 'YouTube Views Retenidos 60%+',            min: 500, max: 500000, rate: 2.80, active: true },
  { id: 5001, category: 'spotify',   name: 'Spotify Streams',                         min: 1000,max: 1000000,rate: 0.80, active: true },
]

const CATEGORIES = ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'spotify', 'telegram']

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState(service || { id: '', category: 'instagram', name: '', min: '', max: '', rate: '', active: true })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.min || !form.max || !form.rate) { toast.error('Completa todos los campos'); return }
    onSave({ ...form, id: form.id || Date.now(), min: Number(form.min), max: Number(form.max), rate: parseFloat(form.rate) })
    onClose()
  }

  const isEdit = !!service

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border p-6 space-y-4"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>{isEdit ? 'Editar servicio' : 'Nuevo servicio'}</h3>
          <button onClick={onClose} style={{ color: 'var(--txt3)' }}><X size={16} /></button>
        </div>

        {[
          { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Instagram Seguidores...' },
          { label: 'Precio por 1K (USD)', key: 'rate', type: 'number', placeholder: '0.90' },
          { label: 'Mínimo', key: 'min', type: 'number', placeholder: '100' },
          { label: 'Máximo', key: 'max', type: 'number', placeholder: '100000' },
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
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>Categoría</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none capitalize"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={handleSave}
          className="w-full py-2.5 rounded-xl text-sm font-semibold font-display"
          style={{ background: 'var(--em)', color: '#000' }}>
          {isEdit ? 'Guardar cambios' : 'Crear servicio'}
        </button>
      </motion.div>
    </div>
  )
}

export default function AdminServices() {
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'new' | service object

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search)
  )

  const toggleActive = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
    const s = services.find(s => s.id === id)
    toast.success(`${s.name} ${s.active ? 'desactivado' : 'activado'}`)
  }

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id))
    toast.success('Servicio eliminado')
  }

  const handleSave = (svc) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === svc.id)
      if (exists) return prev.map(s => s.id === svc.id ? svc : s)
      return [...prev, svc]
    })
    toast.success(modal === 'new' ? 'Servicio creado' : 'Servicio actualizado')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AnimatePresence>
        {modal && <ServiceModal service={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Servicios</h1>
          <p className="text-sm" style={{ color: 'var(--txt2)' }}>{services.length} servicios en el catálogo</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-display"
          style={{ background: 'var(--em)', color: '#000' }}>
          <Plus size={15} /> Nuevo servicio
        </motion.button>
      </motion.div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o ID..."
          className="w-full max-w-sm pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border2)', background: 'var(--bg3)' }}>
                {['ID', 'Nombre', 'Categoría', 'Precio/1K', 'Min', 'Max', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .03 }}
                  style={{ borderBottom: '1px solid var(--border2)', opacity: s.active ? 1 : .6 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-3"><code className="text-sm" style={{ color: 'var(--txt3)' }}>#{s.id}</code></td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--txt)' }}>{s.name}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-md capitalize" style={{ background: 'var(--bg4)', color: 'var(--txt3)' }}>{s.category}</span>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-sm" style={{ color: 'var(--em3)' }}>${s.rate.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm font-mono" style={{ color: 'var(--txt2)' }}>{s.min.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm font-mono" style={{ color: 'var(--txt2)' }}>{s.max.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${s.active ? 'badge-active' : 'badge-cancelled'}`}>{s.active ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(s.id)} className="p-1.5 rounded-lg transition-colors" title={s.active ? 'Desactivar' : 'Activar'}
                        style={{ color: s.active ? 'var(--em3)' : 'var(--txt3)' }}>
                        {s.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => setModal(s)} className="p-1.5 rounded-lg transition-colors" title="Editar"
                        style={{ color: 'var(--txt3)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#93C5FD'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteService(s.id)} className="p-1.5 rounded-lg transition-colors" title="Eliminar"
                        style={{ color: 'var(--txt3)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FCA5A5'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--txt3)'}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
