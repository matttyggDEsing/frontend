import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Link as LinkIcon, Hash, DollarSign, ChevronDown, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { id: 'instagram', label: 'Instagram', emoji: '📸' },
  { id: 'tiktok',    label: 'TikTok',    emoji: '🎵' },
  { id: 'youtube',   label: 'YouTube',   emoji: '▶️' },
  { id: 'facebook',  label: 'Facebook',  emoji: '👥' },
  { id: 'telegram',  label: 'Telegram',  emoji: '✈️' },
  { id: 'twitter',   label: 'Twitter/X', emoji: '𝕏' },
  { id: 'spotify',   label: 'Spotify',   emoji: '🎧' },
]

const SERVICES = [
  { id: 1001, category: 'instagram', name: 'Instagram Seguidores — Real Alta Calidad', min: 100,  max: 100000, rate: 0.90, description: 'Seguidores reales de alta retención. Garantía de 30 días.', speed: '~2min' },
  { id: 1002, category: 'instagram', name: 'Instagram Likes — Premium',               min: 50,   max: 50000,  rate: 0.30, description: 'Likes instantáneos de cuentas reales.', speed: '~1min' },
  { id: 1003, category: 'instagram', name: 'Instagram Views Reel',                    min: 1000, max: 1000000, rate: 0.10, description: 'Views masivos para Reels. Boost orgánico.', speed: '~30seg' },
  { id: 1004, category: 'instagram', name: 'Instagram Comentarios Random',            min: 10,   max: 500,    rate: 5.00, description: 'Comentarios variados en español e inglés.', speed: '~5min' },
  { id: 2001, category: 'tiktok',    name: 'TikTok Views — Máxima Velocidad',         min: 1000, max: 5000000, rate: 0.05, description: 'Views turbo para cualquier video TikTok.', speed: '~1min' },
  { id: 2002, category: 'tiktok',    name: 'TikTok Seguidores Reales',                min: 100,  max: 50000,  rate: 1.20, description: 'Seguidores reales con buena retención.', speed: '~3min' },
  { id: 2003, category: 'tiktok',    name: 'TikTok Likes',                            min: 100,  max: 100000, rate: 0.40, description: 'Likes de alta calidad para tus videos.', speed: '~1min' },
  { id: 3001, category: 'youtube',   name: 'YouTube Views Retenidos 60%+',            min: 500,  max: 500000, rate: 2.80, description: 'Views con retención real. Ayuda al algoritmo.', speed: '~5min' },
  { id: 3002, category: 'youtube',   name: 'YouTube Suscriptores',                    min: 50,   max: 20000,  rate: 3.50, description: 'Suscriptores reales para tu canal.', speed: '~5min' },
  { id: 4001, category: 'twitter',   name: 'Twitter Seguidores Reales',               min: 100,  max: 50000,  rate: 1.50, description: 'Seguidores de alta calidad. Perfiles con actividad.', speed: '~3min' },
  { id: 4002, category: 'twitter',   name: 'Twitter Likes',                           min: 50,   max: 50000,  rate: 0.50, description: 'Likes rápidos para tus tweets.', speed: '~1min' },
  { id: 5001, category: 'spotify',   name: 'Spotify Streams',                         min: 1000, max: 1000000, rate: 0.80, description: 'Streams reales para impulsar tu canción en el algoritmo.', speed: '~5min' },
  { id: 5002, category: 'spotify',   name: 'Spotify Seguidores de Artista',           min: 100,  max: 10000,  rate: 4.00, description: 'Seguidores reales para tu perfil de artista.', speed: '~10min' },
  { id: 6001, category: 'telegram',  name: 'Telegram Miembros de Canal',              min: 100,  max: 100000, rate: 1.10, description: 'Miembros reales de alta calidad para canales.', speed: '~2min' },
  { id: 7001, category: 'facebook',  name: 'Facebook Page Likes',                     min: 100,  max: 50000,  rate: 1.80, description: 'Likes reales para tu página de Facebook.', speed: '~3min' },
]

function ServiceCard({ service, selected, onSelect }) {
  const price1k = ((service.rate / 1000) * 1000).toFixed(2)
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onSelect(service)}
      className="p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden"
      style={{
        background: selected ? 'rgba(16,185,129,0.06)' : 'var(--bg3)',
        borderColor: selected ? 'rgba(16,185,129,0.35)' : 'var(--border2)',
        boxShadow: selected ? '0 0 20px rgba(16,185,129,0.08)' : 'none',
      }}>
      {selected && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={16} style={{ color: 'var(--em)' }} />
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="text-xs font-mono px-2 py-1 rounded-md flex-shrink-0"
          style={{ background: 'var(--bg4)', color: 'var(--txt3)' }}>#{service.id}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1 pr-6" style={{ color: 'var(--txt)' }}>{service.name}</p>
          <p className="text-xs mb-2" style={{ color: 'var(--txt3)' }}>{service.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--txt3)' }}>
              Min: <span style={{ color: 'var(--txt2)' }}>{service.min.toLocaleString()}</span>
            </span>
            <span className="text-xs" style={{ color: 'var(--txt3)' }}>
              Max: <span style={{ color: 'var(--txt2)' }}>{service.max.toLocaleString()}</span>
            </span>
            <span className="text-xs" style={{ color: 'var(--em3)' }}>⚡ {service.speed}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-sm" style={{ color: 'var(--em3)' }}>${price1k}</p>
          <p className="text-xs" style={{ color: 'var(--txt3)' }}>/ 1K</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function NewOrderPage() {
  const [activeCategory, setActiveCategory] = useState('instagram')
  const [selectedService, setSelectedService] = useState(null)
  const [link, setLink]     = useState('')
  const [quantity, setQuantity] = useState('')
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const filtered = SERVICES.filter(s =>
    s.category === activeCategory &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const price = selectedService && quantity
    ? ((selectedService.rate / 1000) * parseInt(quantity || 0)).toFixed(2)
    : '0.00'

  const isValid = selectedService && link.trim() && quantity &&
    parseInt(quantity) >= selectedService.min &&
    parseInt(quantity) <= selectedService.max

  const handleSubmit = async () => {
    if (!isValid) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
    toast.success('¡Orden creada exitosamente!')
    setTimeout(() => {
      setSubmitted(false)
      setLink('')
      setQuantity('')
      setSelectedService(null)
    }, 3000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSelectedService(null) }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium flex-shrink-0 transition-all"
                style={{
                  background: activeCategory === cat.id ? 'rgba(16,185,129,0.1)' : 'var(--bg2)',
                  border: `1px solid ${activeCategory === cat.id ? 'rgba(16,185,129,0.25)' : 'var(--border2)'}`,
                  color: activeCategory === cat.id ? 'var(--em3)' : 'var(--txt2)',
                }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.1 }}
            className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar servicio..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background:'var(--bg2)', border:'1px solid var(--border2)',
                color:'var(--txt)', caretColor:'var(--em)',
              }}
              onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
              onBlur={e => e.target.style.borderColor='var(--border2)'}
            />
          </motion.div>

          {/* Services list */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.15 }}
            className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, scale:.95 }} transition={{ duration:.2, delay:i*.03 }}>
                  <ServiceCard service={s} selected={selectedService?.id === s.id} onSelect={setSelectedService} />
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="text-center py-12" style={{ color:'var(--txt3)' }}>
                <p className="text-sm">No se encontraron servicios para "{search}"</p>
              </div>
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

            {/* Selected service */}
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color:'var(--txt3)' }}>SERVICIO</label>
              <div className="p-3 rounded-xl text-sm"
                style={{
                  background:'var(--bg3)', border:'1px solid var(--border2)',
                  color: selectedService ? 'var(--txt)' : 'var(--txt3)',
                }}>
                {selectedService ? selectedService.name : 'Selecciona un servicio →'}
              </div>
            </div>

            {/* Link */}
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color:'var(--txt3)' }}>ENLACE</label>
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
                <input
                  value={link} onChange={e => setLink(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
                  onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor='var(--border2)'}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color:'var(--txt3)' }}>
                CANTIDAD
                {selectedService && (
                  <span className="ml-2 font-normal" style={{ color:'var(--txt3)' }}>
                    (min {selectedService.min.toLocaleString()} — max {selectedService.max.toLocaleString()})
                  </span>
                )}
              </label>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
                <input
                  type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
                  placeholder="1000"
                  min={selectedService?.min} max={selectedService?.max}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
                  onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
                  onBlur={e => e.target.style.borderColor='var(--border2)'}
                />
              </div>
              {/* Quick fill buttons */}
              {selectedService && (
                <div className="flex gap-1.5 mt-2">
                  {[selectedService.min, 1000, 5000, 10000].filter(v => v <= selectedService.max).slice(0,4).map(v => (
                    <button key={v} onClick={() => setQuantity(String(v))}
                      className="flex-1 py-1 rounded-lg text-xs transition-all"
                      style={{
                        background: quantity === String(v) ? 'rgba(16,185,129,0.12)' : 'var(--bg4)',
                        border: `1px solid ${quantity === String(v) ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                        color: quantity === String(v) ? 'var(--em3)' : 'var(--txt3)',
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
                  {selectedService ? `$${selectedService.rate.toFixed(2)}` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-xs" style={{ color:'var(--txt3)' }}>
                <span>Cantidad</span>
                <span style={{ color:'var(--txt2)' }}>{quantity ? parseInt(quantity).toLocaleString() : '—'}</span>
              </div>
              <div className="h-px" style={{ background:'var(--border2)' }} />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color:'var(--txt)' }}>Total</span>
                <span className="font-display font-bold text-xl" style={{ color:'var(--em3)', letterSpacing:'-0.5px' }}>
                  ${price}
                </span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={isValid ? { scale:1.02 } : {}}
              whileTap={isValid ? { scale:.98 } : {}}
              onClick={handleSubmit}
              disabled={!isValid || submitting}
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
