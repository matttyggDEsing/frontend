import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/services/api'

export default function AdminServices() {
  const [services, setServices]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [pagination, setPagination] = useState({ page:1, totalPages:1, total:0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [svcRes, catRes] = await Promise.all([
        api.get('/admin/services', {
          params: { page: pagination.page, perPage: 20, search: search || undefined, category: catFilter || undefined }
        }),
        api.get('/services/categories'),
      ])
      setServices(svcRes.data?.data ?? svcRes.data?.services ?? [])
      if (svcRes.data?.pagination) setPagination(svcRes.data.pagination)
      setCategories(catRes.data?.data ?? catRes.data?.categories ?? [])
    } catch {
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, catFilter])

  useEffect(() => { fetchData() }, [pagination.page, search, catFilter]) // eslint-disable-line

  const toggleActive = async (service) => {
    try {
      await api.patch(`/admin/services/${service.id}`, { is_active: service.is_active ? 0 : 1 })
      toast.success(service.is_active ? 'Servicio desactivado' : 'Servicio activado')
      fetchData()
    } catch {}
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
          Servicios
        </h1>
        <p className="text-sm" style={{ color:'var(--txt2)' }}>
          {loading ? '—' : `${pagination.total} servicios en total`}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--txt3)' }}/>
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter') { setSearch(searchInput); setPagination(p=>({...p,page:1})) } }}
            placeholder="Nombre o ID (Enter)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
            onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
            onBlur={e => e.target.style.borderColor='var(--border2)'}
          />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPagination(p=>({...p,page:1})) }}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug ?? c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={fetchData} className="p-2.5 rounded-xl transition-all"
          style={{ background:'var(--bg2)', border:'1px solid var(--border2)', color:'var(--txt2)' }}>
          <RefreshCw size={14}/>
        </button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border2)', background:'var(--bg3)' }}>
                {['ID','Nombre','Categoría','Proveedor','Precio/1K','Min','Max','Activo'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color:'var(--txt3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border2)' }}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background:'var(--bg4)', width:j===1?'140px':'60px' }}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16" style={{ color:'var(--txt3)' }}>
                    <p className="text-sm">No se encontraron servicios</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {services.map((s, i) => (
                    <motion.tr key={s.id}
                      initial={{ opacity:0 }} animate={{ opacity:1 }}
                      transition={{ delay:i*.02 }}
                      style={{ borderBottom:'1px solid var(--border2)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--txt3)' }}>#{s.id}</td>
                      <td className="px-4 py-3 max-w-52">
                        <p className="text-sm truncate" style={{ color:'var(--txt)' }}>{s.name}</p>
                        {s.type && <p className="text-xs mt-0.5" style={{ color:'var(--txt3)' }}>{s.type}</p>}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:'var(--txt2)' }}>
                        {s.category_name ?? s.category_slug ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:'var(--txt2)' }}>
                        {s.provider_name ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-display font-bold text-sm" style={{ color:'var(--em3)' }}>
                        ${Number(s.rate).toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:'var(--txt2)' }}>
                        {Number(s.min_order).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color:'var(--txt2)' }}>
                        {Number(s.max_order).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(s)}
                          className="transition-all"
                          style={{ color: s.is_active ? 'var(--em3)' : 'var(--txt3)' }}>
                          {s.is_active
                            ? <ToggleRight size={22}/>
                            : <ToggleLeft  size={22}/>}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:'var(--border2)' }}>
            <p className="text-xs" style={{ color:'var(--txt3)' }}>Página {pagination.page} de {pagination.totalPages}</p>
            <div className="flex gap-1">
              <button onClick={() => setPagination(p=>({...p,page:p.page-1}))} disabled={pagination.page===1}
                className="p-1.5 rounded-lg disabled:opacity-30" style={{ background:'var(--bg3)', color:'var(--txt2)' }}>
                <ChevronLeft size={14}/>
              </button>
              <button onClick={() => setPagination(p=>({...p,page:p.page+1}))} disabled={pagination.page===pagination.totalPages}
                className="p-1.5 rounded-lg disabled:opacity-30" style={{ background:'var(--bg3)', color:'var(--txt2)' }}>
                <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
