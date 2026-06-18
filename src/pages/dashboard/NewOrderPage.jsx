import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Link as LinkIcon, Hash, CheckCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/services/api'
import { useAuthStore } from '@/store/authStore'

const CATEGORIES = [
  { id: 'all',       label: 'Todos',     emoji: '✨' },
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok',    label: 'TikTok',    emoji: '🎵' },
  { id: 'youtube',   label: 'YouTube',   emoji: '▶️' },
  { id: 'facebook',  label: 'Facebook',  emoji: '👥' },
  { id: 'telegram',  label: 'Telegram',  emoji: '✈️' },
  { id: 'twitter',   label: 'Twitter/X', emoji: '𝕏'  },
  { id: 'spotify',   label: 'Spotify',   emoji: '🎧' },
]

function ServiceCard({ service, selected, onSelect }) {
  const price1k = Number(service.rate ?? 0).toFixed(2)
  return (
    <motion.div whileHover={{ y:-2 }} onClick={() => onSelect(service)}
      className="p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden"
      style={{
        background: selected ? 'rgba(16,185,129,0.06)' : 'var(--bg3)',
        borderColor: selected ? 'rgba(16,185,129,0.35)' : 'var(--border2)',
        boxShadow: selected ? '0 0 20px rgba(16,185,129,0.08)' : 'none',
      }}>
      {selected && (
        <div className="absolute top-3 right-3"><CheckCircle size={16} style={{ color:'var(--em)' }} /></div>
      )}
      <div className="flex items-start gap-3">
        <div className="text-xs font-mono px-2 py-1 rounded-md flex-shrink-0"
          style={{ background:'var(--bg4)', color:'var(--txt3)' }}>
          #{service.id}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1 pr-6" style={{ color:'var(--txt)' }}>{service.name}</p>
          {service.description && (
            <p className="text-xs mb-2" style={{ color:'var(--txt3)' }}>{service.description}</p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color:'var(--txt3)' }}>
              Min: <span style={{ color:'var(--txt2)' }}>{Number(service.min_order ?? 0).toLocaleString()}</span>
            </span>
            <span className="text-xs" style={{ color:'var(--txt3)' }}>
              Max: <span style={{ color:'var(--txt2)' }}>{Number(service.max_order ?? 0).toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-sm" style={{ color:'var(--em3)' }}>${price1k}</p>
          <p className="text-xs" style={{ color:'var(--txt3)' }}>/ 1K</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function NewOrderPage() {
  const { user, updateUser } = useAuthStore()
  const [services, setServices]           = useState([])
  const [categories, setCategories]       = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedService, setSelectedService] = useState(null)
  const [link, setLink]         = useState('')
  const [quantity, setQuantity] = useState('')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const [svcRes, catRes] = await Promise.all([
        api.get('/services', { params: { perPage: 500 } }),
        api.get('/services/categories'),
      ])
      const svcs = svcRes.data?.data ?? svcRes.data?.services ?? []
      const cats = catRes.data?.data ?? catRes.data?.categories ?? []
      setServices(svcs)
      setCategories(cats)
    } catch {
      // handled globally
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  // Build category list: API cats + fallback to slug detection
  const allCategories = [
    { id: 'all', label: 'Todos', slug: 'all', emoji: '✨' },
    ...CATEGORIES.slice(1).map(c => {
      const found = categories.find(cat => cat.slug === c.id)
      return found ? { ...c, id: found.slug ?? c.id } : c
    }),
  ]

  const filtered = services.filter(s => {
    const slug = s.category_slug ?? s.category ?? ''
    const matchCat = activeCategory === 'all' || slug === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search)
    return matchCat && matchSearch && s.is_active !== 0
  })

  const price = selectedService && quantity
    ? ((Number(selectedService.rate) / 1000) * parseInt(quantity || 0)).toFixed(2)
    : '0.00'

  const isValid = selectedService && link.trim() && quantity
    && parseInt(quantity) >= Number(selectedService.min_order)
    && parseInt(quantity) <= Number(selectedService.max_order)
    && Number(price) <= Number(user?.balance ?? 0)

  const handleSubmit = async () => {
    if (!isValid) return
    setSubmitting(true)
    try {
      await api.post('/orders', {
        service_id: selectedService.id,
        link: link.trim(),
        quantity: parseInt(quantity),
      })
      setSubmitted(true)
      toast.success('¡Orden creada exitosamente!')
      // Refresh balance
      const balRes = await api.get('/wallet/balance')
      const bal = balRes.data?.data?.balance ?? balRes.data?.balance
      if (bal !== undefined) updateUser({ balance: Number(bal) })
      setTimeout(() => {
        setSubmitted(false)
        setLink('')
        setQuantity('')
        setSelectedService(null)
      }, 3000)
    } catch {
      // handled globally
    } finally {
      setSubmitting(false)
    }
  }

  const insufficientBalance = selectedService && quantity && Number(price) > Number(user?.balance ?? 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
          Nueva Orden
        </h1>
        <p className="text-sm" style={{ color:'var(--txt2)' }}>
          Selecciona un servicio, ingresa el enlace y la cantidad.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: service selector */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category tabs */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
            className="flex gap-2 overflow-x-auto pb-1">
            {allCategories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSelectedService(null) }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium flex-shrink-0 transition-all"
                style={{
                  background: activeCategory===cat.id ? 'rgba(16,185,129,0.1)' : 'var(--bg2)',
                  border:`1px solid ${activeCategory===cat.id ? 'rgba(16,185,129,0.25)' : 'var(--border2)'}`,
                  color: activeCategory===cat.id ? 'var(--em3)' : 'var(--txt2)',
                }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
            <button onClick={fetchServices}
              className="p-2 rounded-xl flex-shrink-0 transition-all"
              style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
              <RefreshCw size={14} />
            </button>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.1 }}
            className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar servicio o ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
              onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
              onBlur={e => e.target.style.borderColor='var(--border2)'}
            />
          </motion.div>

          {/* Services list */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.15 }}
            className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background:'var(--bg4)' }} />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12" style={{ color:'var(--txt3)' }}>
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm">
                  {search ? `No se encontraron servicios para "${search}"` : 'Sin servicios en esta categoría'}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((s, i) => (
                  <motion.div key={s.id}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, scale:.95 }} transition={{ duration:.2, delay:i*.02 }}>
                    <ServiceCard service={s} selected={selectedService?.id===s.id} onSelect={setSelectedService} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>

        {/* Right: order form */}
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.2 }}
          className="space-y-4">
          <div className="rounded-2xl border p-5 space-y-4"
            style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
            <h2 className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>
              Detalles de la Orden
            </h2>

            {/* Balance chip */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)' }}>
              <span className="text-xs" style={{ color:'var(--txt2)' }}>Balance disponible</span>
              <span className="font-display font-bold text-sm" style={{ color:'var(--em3)' }}>
                ${Number(user?.balance ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Selected service */}
            <div>
              <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider" style={{ color:'var(--txt3)' }}>SERVICIO</label>
              <div className="p-3 rounded-xl text-sm"
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color: selectedService?'var(--txt)':'var(--txt3)' }}>
                {selectedService ? selectedService.name : '← Selecciona un servicio'}
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider" style={{ color:'var(--txt3)' }}>ENLACE</label>
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
                <input value={link} onChange={e => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
                  onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor='var(--border2)'}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider" style={{ color:'var(--txt3)' }}>
                CANTIDAD
                {selectedService && (
                  <span className="ml-2 font-normal normal-case" style={{ color:'var(--txt3)' }}>
                    (min {Number(selectedService.min_order).toLocaleString()} — max {Number(selectedService.max_order).toLocaleString()})
                  </span>
                )}
              </label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                  placeholder="1000"
                  min={selectedService?.min_order} max={selectedService?.max_order}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
                  onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor='var(--border2)'}
                />
              </div>
              {selectedService && (
                <div className="flex gap-1.5 mt-2">
                  {[selectedService.min_order, 1000, 5000, 10000]
                    .filter((v,i,a) => v <= selectedService.max_order && a.indexOf(v)===i)
                    .slice(0,4).map(v => (
                    <button key={v} onClick={() => setQuantity(String(v))}
                      className="flex-1 py-1 rounded-lg text-xs transition-all"
                      style={{
                        background: quantity===String(v) ? 'rgba(16,185,129,0.12)' : 'var(--bg4)',
                        border:`1px solid ${quantity===String(v) ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                        color: quantity===String(v) ? 'var(--em3)' : 'var(--txt3)',
                      }}>
                      {v >= 1000 ? `${v/1000}K` : v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price summary */}
            <div className="rounded-xl p-4 space-y-2"
              style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}>
              <div className="flex justify-between text-xs" style={{ color:'var(--txt3)' }}>
                <span>Precio por 1,000</span>
                <span style={{ color:'var(--txt2)' }}>
                  {selectedService ? `$${Number(selectedService.rate).toFixed(4)}` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ color:'var(--txt3)' }}>
                <span>Cantidad</span>
                <span style={{ color:'var(--txt2)' }}>{quantity ? parseInt(quantity).toLocaleString() : '—'}</span>
              </div>
              <div className="h-px" style={{ background:'var(--border2)' }} />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color:'var(--txt)' }}>Total</span>
                <span className="font-display font-bold text-xl"
                  style={{ color: insufficientBalance ? '#F87171' : 'var(--em3)', letterSpacing:'-0.5px' }}>
                  ${price}
                </span>
              </div>
              {insufficientBalance && (
                <p className="text-xs text-center" style={{ color:'#F87171' }}>
                  Balance insuficiente. Recarga tu wallet.
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button whileHover={isValid ? { scale:1.02 } : {}} whileTap={isValid ? { scale:.98 } : {}}
              onClick={handleSubmit} disabled={!isValid || submitting}
              className="w-full py-3 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: isValid ? 'var(--em)' : 'var(--bg4)',
                color: isValid ? '#000' : 'var(--txt3)',
                cursor: isValid ? 'pointer' : 'not-allowed',
                boxShadow: isValid ? '0 4px 20px rgba(16,185,129,0.3)' : 'none',
              }}>
              {submitted ? (
                <><CheckCircle size={16} /> ¡Orden enviada!</>
              ) : submitting ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Procesando...</>
              ) : (
                <><Zap size={16} /> Crear Orden — ${price}</>
              )}
            </motion.button>

            <p className="text-center text-xs" style={{ color:'var(--txt3)' }}>
              ✓ Entrega automática · ✓ Garantía incluida
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



