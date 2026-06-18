import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Shield, Globe, TrendingUp, ChevronRight,
  Instagram, Twitter, Youtube, Music, Send, Check,
  ArrowRight, Star, Users, ShoppingCart, Clock
} from 'lucide-react'

const NETWORKS = [
  { icon: Instagram, label: 'Instagram', color: '#E1306C' },
  { icon: Twitter,   label: 'TikTok',    color: '#69C9D0' },
  { icon: Youtube,   label: 'YouTube',   color: '#FF0000' },
  { icon: Music,     label: 'Spotify',   color: '#1DB954' },
  { icon: Send,      label: 'Telegram',  color: '#2AABEE' },
  { icon: Globe,     label: 'Facebook',  color: '#1877F2' },
]

const FEATURES = [
  { icon: Zap,        title: 'Entrega Instantánea',   desc: 'Las órdenes comienzan en segundos. Sin demoras, sin esperas.' },
  { icon: Shield,     title: 'Panel Seguro',          desc: 'Autenticación JWT, cifrado en tránsito y datos protegidos.' },
  { icon: TrendingUp, title: 'Alta Calidad',          desc: 'Seguidores, vistas y likes de fuentes verificadas.' },
  { icon: Globe,      title: '30+ Plataformas',       desc: 'Todas las redes sociales en un solo lugar.' },
  { icon: Clock,      title: 'Soporte 24/7',          desc: 'Tickets respondidos en menos de 2 horas.' },
  { icon: Users,      title: 'API Pública',           desc: 'Integra NexaPanel en tu propio sistema vía REST API.' },
]

const PLANS = [
  {
    name: 'Starter',
    price: '9',
    period: 'mes',
    color: 'var(--txt2)',
    features: ['500 créditos / mes', 'Todas las plataformas', 'Soporte por ticket', 'API básica'],
  },
  {
    name: 'Pro',
    price: '29',
    period: 'mes',
    color: 'var(--em)',
    highlight: true,
    badge: 'Popular',
    features: ['2 000 créditos / mes', 'Todas las plataformas', 'Soporte prioritario', 'API completa', 'Panel de analytics'],
  },
  {
    name: 'Enterprise',
    price: '99',
    period: 'mes',
    color: '#A78BFA',
    features: ['Créditos ilimitados', 'Todas las plataformas', 'Soporte dedicado', 'API sin límites', 'SLA garantizado', 'Facturación B2B'],
  },
]

const STATS = [
  { value: '2M+',   label: 'Órdenes completadas' },
  { value: '50K+',  label: 'Clientes activos' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '< 2h',  label: 'Tiempo de soporte' },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ color: 'var(--txt)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,10,14,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border2)',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, gap: 12 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: 13, color: '#000', background: 'linear-gradient(135deg,#10B981,#059669)',
            }}>N</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--txt)' }}>
              Nexa<span style={{ color: 'var(--em)' }}>Panel</span>
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 6 }}>
            {['Funciones', 'Precios', 'API'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: 'var(--txt2)', textDecoration: 'none', transition: 'color .15s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--txt)'}
              onMouseLeave={e => e.target.style.color = 'var(--txt2)'}
              >{item}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: 'transparent', border: '1px solid var(--border2)',
              color: 'var(--txt2)', cursor: 'pointer', transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.color = 'var(--txt)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--txt2)' }}
            >Iniciar sesión</button>
            <button onClick={() => navigate('/register')} style={{
              padding: '7px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              background: 'var(--em)', color: '#000', border: 'none', cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--em2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--em)'}
            >Registrarse</button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
          <motion.div {...fade(0)}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
              borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              color: 'var(--em3)', marginBottom: 28, textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--em)', animation: 'pulse-dot 2s infinite' }} />
              Panel SMM #1 en Latinoamérica
            </span>
          </motion.div>

          <motion.h1 {...fade(0.07)} style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(36px,6vw,64px)',
            lineHeight: 1.08, letterSpacing: '-2px', color: 'var(--txt)', marginBottom: 24,
          }}>
            Impulsa tus redes<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--em), var(--em4), var(--em))',
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}>al siguiente nivel</span>
          </motion.h1>

          <motion.p {...fade(0.12)} style={{
            fontSize: 18, color: 'var(--txt2)', maxWidth: 520, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Seguidores, vistas, likes y más — para Instagram, TikTok, YouTube, Spotify y 30+ plataformas. Todo desde un solo panel.
          </motion.p>

          <motion.div {...fade(0.17)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 11, fontSize: 15, fontWeight: 700,
              background: 'var(--em)', color: '#000', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 0 32px rgba(16,185,129,0.25)',
              transition: 'background .15s, box-shadow .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--em2)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--em)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(16,185,129,0.25)' }}
            >
              <Zap size={16} /> Empezar gratis <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/login')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 24px', borderRadius: 11, fontSize: 15, fontWeight: 600,
              background: 'var(--bg3)', color: 'var(--txt2)', cursor: 'pointer',
              border: '1px solid var(--border2)', fontFamily: "'DM Sans', sans-serif",
              transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)'; e.currentTarget.style.color = 'var(--txt)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--txt2)' }}
            >
              Ver precios
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div {...fade(0.22)} style={{ marginTop: 48, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FCD34D" color="#FCD34D" />)}
            <span style={{ fontSize: 13, color: 'var(--txt2)', marginLeft: 6 }}>
              <strong style={{ color: 'var(--txt)' }}>4.9/5</strong> · +50,000 clientes satisfechos
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1,
          background: 'var(--border2)', borderRadius: 16, overflow: 'hidden',
          border: '1px solid var(--border2)',
        }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fade(0.05 * i)} style={{
              padding: '32px 24px', textAlign: 'center', background: 'var(--bg2)',
            }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32,
                color: 'var(--em3)', letterSpacing: '-1px', marginBottom: 6,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--txt2)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Networks ────────────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px', textAlign: 'center' }}>
        <motion.p {...fade()} style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--txt3)', marginBottom: 20 }}>
          Compatible con las principales plataformas
        </motion.p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}>
          {NETWORKS.map(({ icon: Icon, label, color }, i) => (
            <motion.div key={label} {...fade(0.04 * i)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
              borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border2)',
              fontSize: 13, fontWeight: 500, color: 'var(--txt2)',
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.color = color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--txt2)' }}
            >
              <Icon size={15} style={{ color }} />{label}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section id="funciones" style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-1px', color: 'var(--txt)', marginBottom: 12 }}>
              Todo lo que necesitás en un panel
            </h2>
            <p style={{ fontSize: 16, color: 'var(--txt2)', maxWidth: 480, margin: '0 auto' }}>
              Diseñado para agencias, creadores y resellers que necesitan velocidad y confiabilidad.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...fade(0.06 * i)} style={{
                padding: '24px', borderRadius: 14, background: 'var(--bg3)',
                border: '1px solid var(--border2)', transition: 'border-color .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(16,185,129,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 11, marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <Icon size={18} style={{ color: 'var(--em3)' }} />
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--txt)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="precios" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div {...fade()} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(26px,4vw,40px)', letterSpacing: '-1px', color: 'var(--txt)', marginBottom: 12 }}>
              Precios simples y transparentes
            </h2>
            <p style={{ fontSize: 16, color: 'var(--txt2)' }}>Sin sorpresas. Cancelá cuando quieras.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(({ name, price, period, color, highlight, badge, features }, i) => (
              <motion.div key={name} {...fade(0.08 * i)} style={{
                padding: '28px', borderRadius: 16,
                background: highlight ? 'linear-gradient(160deg, var(--bg3), var(--bg2))' : 'var(--bg2)',
                border: highlight ? '1px solid rgba(16,185,129,0.35)' : '1px solid var(--border2)',
                boxShadow: highlight ? '0 0 40px rgba(16,185,129,0.1)' : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
                {highlight && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--em), var(--em4))' }} />
                )}
                {badge && (
                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: 'rgba(16,185,129,0.15)', color: 'var(--em3)',
                  }}>{badge}</span>
                )}
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--txt)', marginBottom: 6 }}>{name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 13, color: 'var(--txt3)' }}>$</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 40, color, letterSpacing: '-2px' }}>{price}</span>
                  <span style={{ fontSize: 13, color: 'var(--txt3)' }}>/{period}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--txt2)' }}>
                      <Check size={13} style={{ color: 'var(--em3)', flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>

                <button onClick={() => navigate('/register')} style={{
                  width: '100%', padding: '10px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all .15s',
                  background: highlight ? 'var(--em)' : 'var(--bg3)',
                  color: highlight ? '#000' : 'var(--txt)',
                  border: highlight ? 'none' : '1px solid var(--border2)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Comenzar con {name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <motion.div {...fade()}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 24px',
              animation: 'glow-pulse 3s ease infinite',
            }}>
              <Zap size={24} style={{ color: 'var(--em3)' }} />
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,4vw,38px)', letterSpacing: '-1px', color: 'var(--txt)', marginBottom: 14 }}>
              Listo para crecer?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--txt2)', marginBottom: 36, lineHeight: 1.7 }}>
              Unite a más de 50,000 creadores y agencias que ya usan NexaPanel para escalar su presencia digital.
            </p>
            <button onClick={() => navigate('/register')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
              background: 'var(--em)', color: '#000', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 0 40px rgba(16,185,129,0.3)',
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--em2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--em)'}
            >
              Crear cuenta gratis <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#10B981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#000' }}>N</div>
          <span style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--txt)' }}>NexaPanel</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--txt3)' }}>© {new Date().getFullYear()} NexaPanel. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Términos', 'Privacidad', 'API'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'var(--txt3)', textDecoration: 'none', transition: 'color .15s' }}
            onMouseEnter={e => e.target.style.color = 'var(--txt2)'}
            onMouseLeave={e => e.target.style.color = 'var(--txt3)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}



