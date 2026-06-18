import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Modal component
 *
 * Props:
 *  open        — boolean
 *  onClose     — fn
 *  title       — string
 *  subtitle    — string (optional)
 *  size        — 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 *  closeOnOverlay — bool (default: true)
 *  footer      — ReactNode (optional)
 */
const SIZES = {
  sm: '400px',
  md: '520px',
  lg: '680px',
  xl: '860px',
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  closeOnOverlay = true,
  footer,
  children,
}) {
  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Esc to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: SIZES[size] || SIZES.md,
              maxHeight: 'calc(100vh - 32px)',
              background: 'var(--bg2)',
              border: '1px solid var(--border2)',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            {(title || onClose) && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '20px 24px 0',
                gap: '12px',
              }}>
                <div>
                  {title && (
                    <h2 style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: '17px',
                      color: 'var(--txt)',
                      margin: 0,
                      letterSpacing: '-0.3px',
                    }}>
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--txt2)',
                      marginTop: '3px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {subtitle}
                    </p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border2)',
                      color: 'var(--txt3)',
                      cursor: 'pointer',
                      transition: 'color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--txt)'
                      e.currentTarget.style.background = 'var(--bg4)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--txt3)'
                      e.currentTarget.style.background = 'var(--bg3)'
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Divider */}
            {title && (
              <div style={{
                height: '1px',
                background: 'var(--border2)',
                margin: '16px 0 0',
              }} />
            )}

            {/* Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: title ? '20px 24px' : '24px',
            }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <>
                <div style={{ height: '1px', background: 'var(--border2)' }} />
                <div style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}>
                  {footer}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}



