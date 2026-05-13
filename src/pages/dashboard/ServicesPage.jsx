import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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

const SERVICES = [
  { id:1001, category:'instagram', name:'Instagram Seguidores — Real Alta Calidad', min:100,   max:100000,  rate:0.90, speed:'~2min', popular:true  },
  { id:1002, category:'instagram', name:'Instagram Likes — Premium',                min:50,    max:50000,   rate:0.30, speed:'~1min', popular:true  },
  { id:1003, category:'instagram', name:'Instagram Views Reel',                     min:1000,  max:1000000, rate:0.10, speed:'~30seg',popular:false },
  { id:1004, category:'instagram', name:'Instagram Comentarios Random',             min:10,    max:500,     rate:5.00, speed:'~5min', popular:false },
  { id:1005, category:'instagram', name:'Instagram Story Views',                    min:100,   max:100000,  rate:0.15, speed:'~1min', popular:false },
  { id:2001, category:'tiktok',    name:'TikTok Views — Máxima Velocidad',          min:1000,  max:5000000, rate:0.05, speed:'~1min', popular:true  },
  { id:2002, category:'tiktok',    name:'TikTok Seguidores Reales',                 min:100,   max:50000,   rate:1.20, speed:'~3min', popular:true  },
  { id:2003, category:'tiktok',    name:'TikTok Likes',                             min:100,   max:100000,  rate:0.40, speed:'~1min', popular:false },
  { id:2004, category:'tiktok',    name:'TikTok Shares',                            min:100,   max:50000,   rate:0.60, speed:'~2min', popular:false },
  { id:3001, category:'youtube',   name:'YouTube Views Retenidos 60%+',             min:500,   max:500000,  rate:2.80, speed:'~5min', popular:true  },
  { id:3002, category:'youtube',   name:'YouTube Suscriptores',                     min:50,    max:20000,   rate:3.50, speed:'~5min', popular:false },
  { id:3003, category:'youtube',   name:'YouTube Likes',                            min:50,    max:50000,   rate:1.20, speed:'~3min', popular:false },
  { id:4001, category:'twitter',   name:'Twitter/X Seguidores Reales',              min:100,   max:50000,   rate:1.50, speed:'~3min', popular:false },
  { id:4002, category:'twitter',   name:'Twitter/X Likes',                          min:50,    max:50000,   rate:0.50, speed:'~1min', popular:false },
  { id:5001, category:'spotify',   name:'Spotify Streams',                          min:1000,  max:1000000, rate:0.80, speed:'~5min', popular:true  },
  { id:5002, category:'spotify',   name:'Spotify Seguidores de Artista',            min:100,   max:10000,   rate:4.00, speed:'~10min',popular:false },
  { id:6001, category:'telegram',  name:'Telegram Miembros de Canal',               min:100,   max:100000,  rate:1.10, speed:'~2min', popular:false },
  { id:6002, category:'telegram',  name:'Telegram Views de Posts',                  min:100,   max:500000,  rate:0.20, speed:'~1min', popular:false },
  { id:7001, category:'facebook',  name:'Facebook Page Likes',                      min:100,   max:50000,   rate:1.80, speed:'~3min', popular:false },
  { id:7002, category:'facebook',  name:'Facebook Post Likes',                      min:50,    max:50000,   rate:0.60, speed:'~2min', popular:false },
]

export default function ServicesPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('popular')
  const navigate = useNavigate()

  let filtered = SERVICES.filter(s => {
    const matchCat    = category === 'all' || s.category === category
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search)
    return matchCat && matchSearch
  })

  if (sort === 'popular') filtered = [...filtered].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
  if (sort === 'price-asc')  filtered = [...filtered].sort((a, b) => a.rate - b.rate)
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.rate - a.rate)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
          Catálogo de Servicios
        </h1>
        <p className="text-sm" style={{ color:'var(--txt2)' }}>
          {SERVICES.length} servicios disponibles en {CATEGORIES.length - 1} plataformas.
        </p>
      </motion.div>

      {/* Category tabs */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
        className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium flex-shrink-0 transition-all"
            style={{
              background: category === cat.id ? 'rgba(16,185,129,0.1)' : 'var(--bg2)',
              border:`1px solid ${category === cat.id ? 'rgba(16,185,129,0.25)' : 'var(--border2)'}`,
              color: category === cat.id ? 'var(--em3)' : 'var(--txt2)',
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Search + sort */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.1 }}
        className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar servicio o ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
            onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
          <option value="popular">Más populares</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </motion.div>

      {/* Count */}
      <p className="text-xs" style={{ color:'var(--txt3)' }}>
        Mostrando {filtered.length} servicios
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => (
            <motion.div key={s.id}
              layout
              initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:.95 }} transition={{ duration:.2, delay: i * .02 }}
              className="rounded-2xl border p-5 relative overflow-hidden group hover-glow transition-all"
              style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>

              {s.popular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
                  style={{ background:'rgba(252,211,77,0.1)', color:'#FCD34D' }}>
                  <Star size={10} fill="currentColor" /> Popular
                </div>
              )}

              <div className="flex items-start gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded-md flex-shrink-0"
                  style={{ background:'var(--bg4)', color:'var(--txt3)' }}>#{s.id}</span>
              </div>

              <h3 className="text-sm font-semibold mb-3 pr-16" style={{ color:'var(--txt)', lineHeight:1.4 }}>
                {s.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background:'var(--bg3)', color:'var(--txt3)' }}>
                  Min: {s.min.toLocaleString()}
                </span>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background:'var(--bg3)', color:'var(--txt3)' }}>
                  Max: {s.max.toLocaleString()}
                </span>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background:'rgba(16,185,129,0.06)', color:'var(--em3)' }}>
                  ⚡ {s.speed}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-xl" style={{ color:'var(--em3)', letterSpacing:'-0.5px' }}>
                    ${s.rate.toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color:'var(--txt3)' }}>por 1,000 unidades</p>
                </div>
                <motion.button
                  whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
                  onClick={() => navigate('/dashboard/new-order')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold font-display transition-all"
                  style={{ background:'var(--em)', color:'#000' }}>
                  <Zap size={13} /> Ordenar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color:'var(--txt3)' }}>
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-sm">No se encontraron servicios para "{search}"</p>
        </div>
      )}
    </div>
  )
}
