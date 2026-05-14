import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, RefreshCw, Server, X, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/services/api'

function ProviderModal({ provider, onClose, onSaved }) {
  const isEdit = !!provider?.id
  const [form, setForm] = useState({
    name:    provider?.name    ?? '',
    api_url: provider?.api_url ?? '',
    api_key: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.api_url || (!isEdit && !form.api_key)) {
      toast.error('Completa todos los campos'); return
    }
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/admin/providers/${provider.id}`, form)
        toast.success('Proveedor actualizado')
      } else {
        await api.post('/admin/providers', form)
        toast.success('Proveedor creado')
      }
      onSaved()
      onClose()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
        className="relative z-10 w-full max-w-md rounded-2xl border p-6 space-y-4"
        style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg" style={{ color:'var(--txt)' }}>
            {isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h3>
          <button onClick={onClose} style={{ color:'var(--txt3)' }}><X size={18}/></button>
        </div>
        {[
          { key:'name',    label:'Nombre',   placeholder:'Mi Proveedor SMM' },
          { key:'api_url', label:'API URL',  placeholder:'https://proveedor.com/api/v2' },
          { key:'api_key', label:'API Key',  placeholder: isEdit ? '(dejar vacío para no cambiar)' : 'tu_api_key_aqui' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider" style={{ color:'var(--txt3)' }}>
              {label}
            </label>
            <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder}
              type={key === 'api_key' ? 'password' : 'text'}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)' }}
              onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
              onBlur={e => e.target.style.borderColor='var(--border2)'}
            />
          </div>
        ))}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
          onClick={handleSave} disabled={loading}
          className="w-full py-3 rounded-xl font-display font-bold text-sm disabled:opacity-50"
          style={{ background:'var(--em)', color:'#000' }}>
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear proveedor'}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default function AdminProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modalData, setModalData] = useState(null)
  const [syncing, setSyncing]     = useState({})

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/providers')
      setProviders(data?.data ?? data?.providers ?? [])
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProviders() }, [fetchProviders])

  const syncServices = async (providerId) => {
    setSyncing(p => ({ ...p, [providerId]: true }))
    try {
      const { data } = await api.post(`/admin/providers/${providerId}/sync`)
      const count = data?.data?.synced ?? data?.synced ?? '?'
      toast.success(`${count} servicios sincronizados`)
      fetchProviders()
    } catch {
    } finally {
      setSyncing(p => ({ ...p, [providerId]: false }))
    }
  }

  const checkBalance = async (providerId) => {
    try {
      const { data } = await api.get(`/admin/providers/${providerId}/balance`)
      const bal = data?.data?.balance ?? data?.balance ?? '—'
      toast.success(`Balance del proveedor: $${bal}`)
      fetchProviders()
    } catch {}
  }

  const deleteProvider = async (id) => {
    if (!window.confirm('¿Eliminar este proveedor? Sus servicios se desactivarán.')) return
    try {
      await api.delete(`/admin/providers/${id}`)
      toast.success('Proveedor eliminado')
      fetchProviders()
    } catch {}
  }

  const STATUS_COLOR = {
    active:   { bg:'rgba(16,185,129,0.1)',  color:'var(--em3)',  label:'Activo'  },
    inactive: { bg:'rgba(100,116,139,0.1)', color:'var(--txt3)', label:'Inactivo'},
    error:    { bg:'rgba(239,68,68,0.1)',   color:'#F87171',     label:'Error'   },
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
            Proveedores SMM
          </h1>
          <p className="text-sm" style={{ color:'var(--txt2)' }}>
            Gestiona las APIs de proveedores y sincroniza servicios.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProviders} className="p-2 rounded-xl transition-all"
            style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
            <RefreshCw size={15}/>
          </button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}
            onClick={() => setModalData({})}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-semibold"
            style={{ background:'var(--em)', color:'#000' }}>
            <Plus size={16}/> Nuevo Proveedor
          </motion.button>
        </div>
      </motion.div>

      {/* Providers grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background:'var(--bg4)' }}/>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20" style={{ color:'var(--txt3)' }}>
          <Server size={40} className="mx-auto mb-4 opacity-30"/>
          <p className="text-sm mb-2">No hay proveedores configurados</p>
          <button onClick={() => setModalData({})}
            className="text-sm" style={{ color:'var(--em3)' }}>
            Agregar el primero →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {providers.map((p, i) => {
              const sc = STATUS_COLOR[p.status] ?? STATUS_COLOR.inactive
              return (
                <motion.div key={p.id}
                  initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }} transition={{ duration:.2, delay:i*.05 }}
                  className="rounded-2xl border p-5"
                  style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)' }}>
                        <Server size={18} style={{ color:'var(--em3)' }}/>
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm" style={{ color:'var(--txt)' }}>{p.name}</p>
                        <p className="text-xs truncate max-w-40" style={{ color:'var(--txt3)' }}>{p.api_url}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{ background:sc.bg, color:sc.color }}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl" style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}>
                      <p className="text-xs mb-1" style={{ color:'var(--txt3)' }}>Balance</p>
                      <p className="font-display font-bold text-base" style={{ color:'var(--em3)' }}>
                        ${Number(p.balance ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}>
                      <p className="text-xs mb-1" style={{ color:'var(--txt3)' }}>Última sync</p>
                      <p className="text-xs font-medium" style={{ color:'var(--txt2)' }}>
                        {p.last_sync
                          ? new Date(p.last_sync).toLocaleString('es', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
                          : 'Nunca'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => syncServices(p.id)} disabled={syncing[p.id]}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                      style={{ background:'rgba(16,185,129,0.08)', color:'var(--em3)', border:'1px solid rgba(16,185,129,0.15)' }}>
                      <motion.div animate={{ rotate: syncing[p.id] ? 360 : 0 }}
                        transition={{ duration:1, repeat: syncing[p.id] ? Infinity : 0, ease:'linear' }}>
                        <RefreshCw size={12}/>
                      </motion.div>
                      {syncing[p.id] ? 'Sincronizando...' : 'Sync servicios'}
                    </button>
                    <button onClick={() => checkBalance(p.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{ background:'rgba(96,165,250,0.08)', color:'#93C5FD', border:'1px solid rgba(96,165,250,0.15)' }}>
                      <Zap size={12}/> Ver balance
                    </button>
                    <button onClick={() => setModalData(p)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{ background:'var(--bg3)', color:'var(--txt2)', border:'1px solid var(--border2)' }}>
                      Editar
                    </button>
                    <button onClick={() => deleteProvider(p.id)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{ background:'rgba(239,68,68,0.06)', color:'#F87171', border:'1px solid rgba(239,68,68,0.15)' }}>
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {modalData !== null && (
        <ProviderModal
          provider={modalData?.id ? modalData : null}
          onClose={() => setModalData(null)}
          onSaved={fetchProviders}
        />
      )}
    </div>
  )
}
