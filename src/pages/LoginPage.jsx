import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Zap, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Completá todos los campos.')
      return
    }
    const result = await login(form.email, form.password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Credenciales incorrectas.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
      >
        {/* Card */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border2)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#10B981,#059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: '#000',
            }}>N</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--txt)' }}>
              Nexa<span style={{ color: 'var(--em)' }}>Panel</span>
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24,
            color: 'var(--txt)', letterSpacing: '-0.5px', marginBottom: 6,
          }}>
            Bienvenido de vuelta
          </h1>
          <p style={{ fontSize: 14, color: 'var(--txt2)', marginBottom: 28 }}>
            Ingresá a tu panel para gestionar tus órdenes.
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                borderRadius: 10, background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)', marginBottom: 20,
                fontSize: 13, color: '#FCA5A5',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="tu@email.com"
              icon={Mail}
              focused={focused === 'email'}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
            />

            {/* Password */}
            <PasswordField
              label="Contraseña"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              focused={focused === 'password'}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
            />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              style={{
                marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, width: '100%', padding: '12px', borderRadius: 11,
                fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                background: 'var(--em)', color: '#000', border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1, transition: 'background .15s',
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Ingresando…
                </span>
              ) : (
                <><Zap size={15} /> Iniciar sesión <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--txt3)' }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color: 'var(--em3)', textDecoration: 'none', fontWeight: 600 }}>
              Registrate gratis
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--txt3)' }}>
          <Link to="/" style={{ color: 'var(--txt3)', textDecoration: 'none' }}>← Volver al inicio</Link>
        </p>
      </motion.div>
    </div>
  )
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function Field({ label, type = 'text', value, onChange, placeholder, icon: Icon, focused, onFocus, onBlur }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt2)' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: 'var(--bg3)', borderRadius: 10,
        border: `1px solid ${focused ? 'rgba(16,185,129,0.4)' : 'var(--border2)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
        transition: 'border-color .2s, box-shadow .2s',
      }}>
        {Icon && (
          <div style={{ paddingLeft: 12, display: 'flex', alignItems: 'center', color: focused ? 'var(--em3)' : 'var(--txt3)', transition: 'color .2s', flexShrink: 0 }}>
            <Icon size={15} />
          </div>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={onFocus} onBlur={onBlur}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--txt)', fontSize: 14, padding: '10px 12px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder, focused, onFocus, onBlur }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt2)' }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg3)', borderRadius: 10,
        border: `1px solid ${focused ? 'rgba(16,185,129,0.4)' : 'var(--border2)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(16,185,129,0.08)' : 'none',
        transition: 'border-color .2s, box-shadow .2s',
      }}>
        <div style={{ paddingLeft: 12, display: 'flex', alignItems: 'center', color: focused ? 'var(--em3)' : 'var(--txt3)', transition: 'color .2s', flexShrink: 0 }}>
          <Lock size={15} />
        </div>
        <input
          type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={onFocus} onBlur={onBlur}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--txt)', fontSize: 14, padding: '10px 10px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button type="button" onClick={() => setShow(v => !v)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px',
          color: 'var(--txt3)', display: 'flex', alignItems: 'center',
          fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
        }}>
          {show ? 'Ocultar' : 'Ver'}
        </button>
      </div>
    </div>
  )
}
