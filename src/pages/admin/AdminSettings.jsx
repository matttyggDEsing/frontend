import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, DollarSign, CreditCard, Wrench, Save, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const SECTIONS = [
  { id: 'general',   icon: Globe,        label: 'General' },
  { id: 'payments',  icon: CreditCard,   label: 'Pagos' },
  { id: 'rates',     icon: DollarSign,   label: 'Tasas de cambio' },
  { id: 'maintenance', icon: Wrench,     label: 'Mantenimiento' },
]

export default function AdminSettings() {
  const [section, setSection] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'NexaPanel',
    siteUrl: 'https://nexapanel.io',
    supportEmail: 'soporte@nexapanel.io',
    defaultCurrency: 'USD',
    minDeposit: '5',
    maxDeposit: '10000',
    registrationEnabled: true,
    emailVerification: false,
    maintenance: false,
    maintenanceMsg: 'El panel está en mantenimiento. Volvemos pronto.',
    mpEnabled: true,
    cryptoEnabled: false,
    paypalEnabled: false,
    arsRate: '1250',
    brlRate: '5.10',
    eurRate: '0.92',
  })

  const set = (k, v) => setSettings(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente')
  }

  const ToggleSwitch = ({ value, onChange, label, desc }) => (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--txt)' }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: 'var(--txt3)' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} className="flex-shrink-0 mt-0.5"
        style={{ color: value ? 'var(--em)' : 'var(--txt3)' }}>
        {value ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
      </button>
    </div>
  )

  const Input = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
        style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
        onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
    </div>
  )

  const renderSection = () => {
    switch (section) {
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>Configuración general</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre del sitio" value={settings.siteName} onChange={v => set('siteName', v)} placeholder="NexaPanel" />
              <Input label="URL del sitio" value={settings.siteUrl} onChange={v => set('siteUrl', v)} placeholder="https://..." />
              <Input label="Email de soporte" value={settings.supportEmail} onChange={v => set('supportEmail', v)} placeholder="soporte@..." />
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>Moneda base</label>
                <select value={settings.defaultCurrency} onChange={e => set('defaultCurrency', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt2)' }}>
                  {['USD', 'EUR', 'ARS', 'BRL'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--border2)', '--tw-divide-color': 'var(--border2)' }}>
              <div className="px-4">
                <ToggleSwitch value={settings.registrationEnabled} onChange={v => set('registrationEnabled', v)}
                  label="Registro de nuevos usuarios" desc="Permite que nuevos usuarios se registren" />
              </div>
              <div className="px-4">
                <ToggleSwitch value={settings.emailVerification} onChange={v => set('emailVerification', v)}
                  label="Verificación de email" desc="Requiere verificación de email al registrarse" />
              </div>
            </div>
          </div>
        )

      case 'payments':
        return (
          <div className="space-y-4">
            <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>Métodos de pago</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Depósito mínimo (USD)" type="number" value={settings.minDeposit} onChange={v => set('minDeposit', v)} placeholder="5" />
              <Input label="Depósito máximo (USD)" type="number" value={settings.maxDeposit} onChange={v => set('maxDeposit', v)} placeholder="10000" />
            </div>
            <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--border2)' }}>
              <div className="px-4">
                <ToggleSwitch value={settings.mpEnabled} onChange={v => set('mpEnabled', v)}
                  label="MercadoPago" desc="Pagos con MercadoPago (ARS)" />
              </div>
              <div className="px-4">
                <ToggleSwitch value={settings.cryptoEnabled} onChange={v => set('cryptoEnabled', v)}
                  label="Criptomonedas" desc="USDT, BTC, ETH via CoinPayments" />
              </div>
              <div className="px-4">
                <ToggleSwitch value={settings.paypalEnabled} onChange={v => set('paypalEnabled', v)}
                  label="PayPal" desc="Pagos con PayPal" />
              </div>
            </div>
          </div>
        )

      case 'rates':
        return (
          <div className="space-y-4">
            <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>Tasas de cambio</h3>
            <p className="text-sm" style={{ color: 'var(--txt2)' }}>Configura las tasas respecto a USD</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="USD → ARS" type="number" value={settings.arsRate} onChange={v => set('arsRate', v)} placeholder="1250" />
              <Input label="USD → BRL" type="number" value={settings.brlRate} onChange={v => set('brlRate', v)} placeholder="5.10" />
              <Input label="USD → EUR" type="number" value={settings.eurRate} onChange={v => set('eurRate', v)} placeholder="0.92" />
            </div>
            <div className="rounded-xl border p-4" style={{ background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.15)' }}>
              <p className="text-xs" style={{ color: 'var(--txt3)' }}>
                💡 Podés actualizar estas tasas manualmente o configurar sincronización automática con una API de tipo de cambio.
              </p>
            </div>
          </div>
        )

      case 'maintenance':
        return (
          <div className="space-y-4">
            <h3 className="font-display font-semibold" style={{ color: 'var(--txt)' }}>Mantenimiento</h3>
            {settings.maintenance && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#FCD34D' }}>
                <AlertTriangle size={16} />
                <p className="text-sm">El modo mantenimiento está activo. Los usuarios no pueden acceder al panel.</p>
              </motion.div>
            )}
            <div className="rounded-xl border px-4" style={{ borderColor: 'var(--border2)' }}>
              <ToggleSwitch value={settings.maintenance} onChange={v => set('maintenance', v)}
                label="Modo mantenimiento" desc="Bloquea el acceso de usuarios al panel" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--txt2)' }}>Mensaje de mantenimiento</label>
              <textarea value={settings.maintenanceMsg} onChange={e => set('maintenanceMsg', e.target.value)} rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--txt)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.35)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'} />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--txt)', letterSpacing: '-0.5px' }}>Configuración global</h1>
        <p className="text-sm" style={{ color: 'var(--txt2)' }}>Administra la configuración del panel</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="space-y-1">
          {SECTIONS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setSection(id)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: section === id ? 'rgba(139,92,246,0.1)' : 'transparent',
                color: section === id ? '#A78BFA' : 'var(--txt2)',
                border: `1px solid ${section === id ? 'rgba(139,92,246,0.2)' : 'transparent'}`,
              }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <motion.div key={section} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border p-5"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border2)' }}>
            {renderSection()}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border2)' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-display"
                style={{ background: 'var(--em)', color: '#000' }}>
                <Save size={14} /> Guardar cambios
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
