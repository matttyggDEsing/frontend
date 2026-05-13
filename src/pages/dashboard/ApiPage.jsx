import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, RefreshCw, Eye, EyeOff, CheckCircle, Zap, Code2 } from 'lucide-react'
import toast from 'react-hot-toast'

const API_KEY = '3a5b447a9075d52f4829617b7bc3a935'

const ENDPOINTS = [
  {
    action: 'services',
    method: 'POST',
    desc: 'Obtener todos los servicios disponibles',
    body: `key=TU_API_KEY&action=services`,
    response: `[
  {
    "service": 1,
    "name": "Instagram Seguidores — Real",
    "type": "Default",
    "rate": "0.90",
    "min": "100",
    "max": "100000",
    "refill": true,
    "cancel": false
  }
]`,
  },
  {
    action: 'add',
    method: 'POST',
    desc: 'Crear una nueva orden',
    body: `key=TU_API_KEY&action=add&service=1&link=https://instagram.com/user&quantity=1000`,
    response: `{
  "order": 23841
}`,
  },
  {
    action: 'status',
    method: 'POST',
    desc: 'Ver estado de una orden',
    body: `key=TU_API_KEY&action=status&order=23841`,
    response: `{
  "charge": "0.90",
  "start_count": "847",
  "status": "Active",
  "remains": "153",
  "currency": "USD"
}`,
  },
  {
    action: 'balance',
    method: 'POST',
    desc: 'Consultar balance de cuenta',
    body: `key=TU_API_KEY&action=balance`,
    response: `{
  "balance": "102.20",
  "currency": "USD"
}`,
  },
]

const CODE_EXAMPLES = {
  javascript: `const response = await fetch('https://nexapanel.io/api/v2', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    key: 'TU_API_KEY',
    action: 'add',
    service: 1042,
    link: 'https://instagram.com/p/xxx',
    quantity: 5000
  })
})
const data = await response.json()
console.log(data) // { order: 23841 }`,

  php: `<?php
$response = file_get_contents('https://nexapanel.io/api/v2', false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-Type: application/x-www-form-urlencoded',
    'content' => http_build_query([
      'key'      => 'TU_API_KEY',
      'action'   => 'add',
      'service'  => 1042,
      'link'     => 'https://instagram.com/p/xxx',
      'quantity' => 5000
    ])
  ]])
);
$data = json_decode($response, true);
echo $data['order']; // 23841`,

  python: `import requests

response = requests.post('https://nexapanel.io/api/v2', data={
    'key':      'TU_API_KEY',
    'action':   'add',
    'service':  1042,
    'link':     'https://instagram.com/p/xxx',
    'quantity': 5000
})
data = response.json()
print(data['order'])  # 23841`,
}

const LOGS = [
  { id: 1, action: 'services', status: 200, time: '14:32:01', ms: 42  },
  { id: 2, action: 'add',      status: 200, time: '14:31:18', ms: 88  },
  { id: 3, action: 'status',   status: 200, time: '14:28:44', ms: 35  },
  { id: 4, action: 'balance',  status: 200, time: '14:15:20', ms: 29  },
  { id: 5, action: 'add',      status: 400, time: '13:52:11', ms: 18  },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado al portapapeles')
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
      style={{ background: 'var(--bg4)', color: copied ? 'var(--em3)' : 'var(--txt3)', border: '1px solid var(--border2)' }}>
      {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

export default function ApiPage() {
  const [showKey, setShowKey]     = useState(false)
  const [activeTab, setActiveTab] = useState('javascript')
  const [activeEp, setActiveEp]   = useState(0)
  const [regen, setRegen]         = useState(false)

  const handleRegen = async () => {
    setRegen(true)
    await new Promise(r => setTimeout(r, 1200))
    setRegen(false)
    toast.success('API Key regenerada exitosamente')
  }

  const maskedKey = API_KEY.slice(0, 8) + '••••••••••••••••••••••••'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>
          API
        </h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>
          Integra NexaPanel en tu sistema. Endpoint base: <code style={{ color: 'var(--em3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: '4px' }}>https://nexapanel.io/api/v2</code>
        </p>
      </motion.div>

      {/* API Key card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: 'var(--em)' }} />
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Tu API Key</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)' }}>
            <Code2 size={15} style={{ color: 'var(--txt3)' }} />
            <code className="flex-1 text-sm font-mono" style={{ color: 'var(--txt)' }}>
              {showKey ? API_KEY : maskedKey}
            </code>
            <button onClick={() => setShowKey(v => !v)} style={{ color: 'var(--txt3)' }}>
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <CopyButton text={API_KEY} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
            onClick={handleRegen} disabled={regen}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: 'var(--bg3)', color: 'var(--txt2)', border: '1px solid var(--border2)' }}>
            <motion.div animate={{ rotate: regen ? 360 : 0 }} transition={{ duration: 1, repeat: regen ? Infinity : 0, ease: 'linear' }}>
              <RefreshCw size={14} />
            </motion.div>
            Regenerar
          </motion.button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--txt3)' }}>
          ⚠️ Nunca compartas tu API key. Si la regeneras, la key anterior dejará de funcionar inmediatamente.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Requests hoy',    value: '1,842', color: 'var(--em)' },
          { label: 'Tiempo promedio', value: '38ms',  color: '#60A5FA'   },
          { label: 'Tasa de éxito',   value: '99.7%', color: '#A78BFA'   },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .05 }}
            className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
            <p className="font-display font-bold text-2xl mb-1" style={{ color, letterSpacing: '-1px' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--txt3)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Endpoints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Endpoints</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Endpoint list */}
          <div className="border-r" style={{ borderColor: 'var(--border2)' }}>
            {ENDPOINTS.map((ep, i) => (
              <div key={ep.action} onClick={() => setActiveEp(i)}
                className="px-5 py-4 cursor-pointer transition-colors border-b"
                style={{
                  borderColor: 'var(--border2)',
                  background: activeEp === i ? 'rgba(16,185,129,0.06)' : 'transparent',
                  borderLeft: activeEp === i ? '2px solid var(--em)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (activeEp !== i) e.currentTarget.style.background = 'var(--bg3)' }}
                onMouseLeave={e => { if (activeEp !== i) e.currentTarget.style.background = 'transparent' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-bold"
                    style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--em3)' }}>{ep.method}</span>
                  <code className="text-sm font-mono" style={{ color: 'var(--txt)' }}>action={ep.action}</code>
                </div>
                <p className="text-xs" style={{ color: 'var(--txt3)' }}>{ep.desc}</p>
              </div>
            ))}
          </div>

          {/* Endpoint detail */}
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--txt3)' }}>REQUEST BODY</p>
                <CopyButton text={ENDPOINTS[activeEp].body} />
              </div>
              <pre className="p-3 rounded-xl text-xs overflow-x-auto"
                style={{ background: 'var(--bg)', color: 'var(--em3)', border: '1px solid var(--border2)', fontFamily: 'SF Mono, Menlo, monospace', lineHeight: 1.7 }}>
                {ENDPOINTS[activeEp].body}
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--txt3)' }}>RESPONSE</p>
                <CopyButton text={ENDPOINTS[activeEp].response} />
              </div>
              <pre className="p-3 rounded-xl text-xs overflow-x-auto"
                style={{ background: 'var(--bg)', color: '#93C5FD', border: '1px solid var(--border2)', fontFamily: 'SF Mono, Menlo, monospace', lineHeight: 1.7 }}>
                {ENDPOINTS[activeEp].response}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code examples */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Ejemplos de código</h2>
          <div className="flex gap-1">
            {Object.keys(CODE_EXAMPLES).map(lang => (
              <button key={lang} onClick={() => setActiveTab(lang)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: activeTab === lang ? 'rgba(16,185,129,0.12)' : 'var(--bg3)',
                  color: activeTab === lang ? 'var(--em3)' : 'var(--txt3)',
                  border: `1px solid ${activeTab === lang ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                }}>{lang}</button>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-3 right-4 z-10">
            <CopyButton text={CODE_EXAMPLES[activeTab]} />
          </div>
          <pre className="p-5 text-xs overflow-x-auto"
            style={{ color: 'var(--txt2)', fontFamily: 'SF Mono, Menlo, monospace', lineHeight: 1.8, maxHeight: '280px' }}>
            {CODE_EXAMPLES[activeTab]}
          </pre>
        </div>
      </motion.div>

      {/* Recent logs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border2)' }}>
          <h2 className="font-display font-semibold text-base" style={{ color: 'var(--txt)' }}>Logs recientes</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border2)', background: 'var(--bg3)' }}>
              {['Acción', 'Estado', 'Tiempo respuesta', 'Hora'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--txt3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, i) => (
              <motion.tr key={log.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .04 }}
                style={{ borderBottom: '1px solid var(--border2)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td className="px-5 py-3">
                  <code className="text-sm" style={{ color: 'var(--em3)' }}>action={log.action}</code>
                </td>
                <td className="px-5 py-3">
                  <span className={`badge ${log.status === 200 ? 'badge-completed' : 'badge-cancelled'}`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-mono" style={{ color: log.ms < 50 ? 'var(--em3)' : 'var(--txt2)' }}>
                  {log.ms}ms
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: 'var(--txt3)' }}>{log.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
