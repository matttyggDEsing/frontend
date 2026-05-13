import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, CreditCard, Bitcoin, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const TRANSACTIONS = [
  { id: 1, type: 'credit',  desc: 'Depósito via PayPal',           amount: 50.00,  date: '2025-01-15 14:00', method: 'PayPal' },
  { id: 2, type: 'debit',   desc: 'Orden #23841 — IG Seguidores',  amount: -4.50,  date: '2025-01-15 14:32', method: 'Wallet' },
  { id: 3, type: 'debit',   desc: 'Orden #23840 — TikTok Views',   amount: -12.00, date: '2025-01-15 13:10', method: 'Wallet' },
  { id: 4, type: 'credit',  desc: 'Depósito via Crypto (USDT)',     amount: 100.00, date: '2025-01-14 20:00', method: 'Crypto' },
  { id: 5, type: 'debit',   desc: 'Orden #23839 — YT Views',       amount: -28.00, date: '2025-01-14 18:45', method: 'Wallet' },
  { id: 6, type: 'credit',  desc: 'Reembolso Orden #23837',         amount: 3.20,   date: '2025-01-14 11:30', method: 'Sistema' },
  { id: 7, type: 'debit',   desc: 'Orden #23838 — Spotify',        amount: -6.50,  date: '2025-01-14 09:20', method: 'Wallet' },
  { id: 8, type: 'credit',  desc: 'Depósito via Tarjeta',           amount: 25.00,  date: '2025-01-13 16:00', method: 'Card' },
]

const PAYMENT_METHODS = [
  { id: 'card',    label: 'Tarjeta de Crédito/Débito', icon: CreditCard, fee: '3%',    min: 5  },
  { id: 'paypal',  label: 'PayPal',                     icon: DollarSign, fee: '2%',    min: 5  },
  { id: 'crypto',  label: 'Criptomonedas (BTC/USDT)',   icon: Bitcoin,    fee: '0%',    min: 10 },
  { id: 'mercado', label: 'Mercado Pago',                icon: Wallet,     fee: '3.5%',  min: 5  },
]

const QUICK_AMOUNTS = [5, 10, 25, 50, 100, 200]

export default function WalletPage() {
  const [amount, setAmount]   = useState('')
  const [method, setMethod]   = useState('card')
  const [loading, setLoading] = useState(false)
  const balance = 102.20

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method)
  const fee = amount ? (parseFloat(amount) * (parseFloat(selectedMethod?.fee) / 100)).toFixed(2) : '0.00'
  const total = amount ? (parseFloat(amount) + parseFloat(fee)).toFixed(2) : '0.00'

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < selectedMethod.min) {
      toast.error(`Monto mínimo: $${selectedMethod.min}`)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    toast.success(`Redirigiendo a ${selectedMethod.label}...`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-0.5px' }}>
          Wallet
        </h1>
        <p className="text-sm" style={{ color:'var(--txt2)' }}>Gestiona tu saldo y pagos.</p>
      </motion.div>

      {/* Balance card */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.05 }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06))', border:'1px solid rgba(16,185,129,0.2)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle, #10B981, transparent)', transform:'translate(30%,-30%)' }} />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm mb-2" style={{ color:'var(--em4)' }}>Balance disponible</p>
            <p className="font-display font-bold text-5xl mb-1" style={{ color:'var(--txt)', letterSpacing:'-2px' }}>
              ${balance.toFixed(2)}
            </p>
            <p className="text-sm" style={{ color:'var(--em3)' }}>USD</p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.25)' }}>
            <Wallet size={24} style={{ color:'var(--em3)' }} />
          </div>
        </div>
        <div className="flex gap-4 mt-6 pt-4" style={{ borderTop:'1px solid rgba(16,185,129,0.15)' }}>
          <div>
            <p className="text-xs mb-1" style={{ color:'var(--em4)' }}>Total depositado</p>
            <p className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>$178.20</p>
          </div>
          <div style={{ borderLeft:'1px solid rgba(16,185,129,0.15)', paddingLeft:'16px' }}>
            <p className="text-xs mb-1" style={{ color:'var(--em4)' }}>Total gastado</p>
            <p className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>$76.00</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add funds */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1 }}
          className="rounded-2xl border p-5 space-y-5"
          style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
          <div className="flex items-center gap-2">
            <Plus size={16} style={{ color:'var(--em)' }} />
            <h2 className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>Agregar Saldo</h2>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color:'var(--txt3)' }}>MONTO (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-bold"
                style={{ color:'var(--txt3)' }}>$</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00" min="1"
                className="w-full pl-7 pr-4 py-3 rounded-xl text-lg font-display font-bold outline-none transition-all"
                style={{ background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--txt)', caretColor:'var(--em)' }}
                onFocus={e => e.target.style.borderColor='rgba(16,185,129,0.35)'}
                onBlur={e => e.target.style.borderColor='var(--border2)'}
              />
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {QUICK_AMOUNTS.map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: amount === String(v) ? 'rgba(16,185,129,0.12)' : 'var(--bg4)',
                    border:`1px solid ${amount === String(v) ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                    color: amount === String(v) ? 'var(--em3)' : 'var(--txt3)',
                  }}>${v}</button>
              ))}
            </div>
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs mb-2 font-medium" style={{ color:'var(--txt3)' }}>MÉTODO DE PAGO</label>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                  style={{
                    background: method === m.id ? 'rgba(16,185,129,0.06)' : 'var(--bg3)',
                    border:`1px solid ${method === m.id ? 'rgba(16,185,129,0.25)' : 'var(--border2)'}`,
                  }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: method === m.id ? 'rgba(16,185,129,0.12)' : 'var(--bg4)' }}>
                    <m.icon size={15} style={{ color: method === m.id ? 'var(--em3)' : 'var(--txt3)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: method === m.id ? 'var(--txt)' : 'var(--txt2)' }}>
                      {m.label}
                    </p>
                    <p className="text-xs" style={{ color:'var(--txt3)' }}>
                      Comisión: {m.fee} · Min: ${m.min}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: method === m.id ? 'var(--em)' : 'var(--txt3)' }}>
                    {method === m.id && (
                      <div className="w-2 h-2 rounded-full" style={{ background:'var(--em)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {amount && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              className="rounded-xl p-4 space-y-2"
              style={{ background:'var(--bg3)', border:'1px solid var(--border2)' }}>
              <div className="flex justify-between text-xs" style={{ color:'var(--txt3)' }}>
                <span>Monto</span><span style={{ color:'var(--txt2)' }}>${parseFloat(amount||0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color:'var(--txt3)' }}>
                <span>Comisión ({selectedMethod?.fee})</span><span style={{ color:'var(--txt2)' }}>${fee}</span>
              </div>
              <div className="h-px" style={{ background:'var(--border2)' }} />
              <div className="flex justify-between">
                <span className="text-sm font-medium" style={{ color:'var(--txt)' }}>Total</span>
                <span className="font-display font-bold text-lg" style={{ color:'var(--em3)' }}>${total}</span>
              </div>
            </motion.div>
          )}

          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
            onClick={handleDeposit} disabled={loading}
            className="w-full py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background:'var(--em)', color:'#000', boxShadow:'0 4px 20px rgba(16,185,129,0.25)' }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Procesando...</>
              : <><Plus size={16}/>Depositar ${total}</>}
          </motion.button>
        </motion.div>

        {/* Transactions */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.15 }}
          className="rounded-2xl border overflow-hidden"
          style={{ background:'var(--bg2)', borderColor:'var(--border2)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor:'var(--border2)' }}>
            <h2 className="font-display font-semibold text-base" style={{ color:'var(--txt)' }}>Historial</h2>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity':1 }}>
            {TRANSACTIONS.map((tx, i) => (
              <motion.div key={tx.id}
                initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
                transition={{ duration:.25, delay:i*.04 }}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                onMouseEnter={e => e.currentTarget.style.background='var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: tx.type === 'credit' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                  {tx.type === 'credit'
                    ? <ArrowDownLeft size={14} style={{ color:'var(--em3)' }} />
                    : <ArrowUpRight  size={14} style={{ color:'#F87171' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color:'var(--txt)' }}>{tx.desc}</p>
                  <p className="text-xs" style={{ color:'var(--txt3)' }}>{tx.date} · {tx.method}</p>
                </div>
                <span className="font-display font-bold text-sm flex-shrink-0"
                  style={{ color: tx.type === 'credit' ? 'var(--em3)' : '#F87171' }}>
                  {tx.type === 'credit' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
