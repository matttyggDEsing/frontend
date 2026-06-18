import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

/**
 * Input component — supports:
 *  - label, hint, error
 *  - left/right icon
 *  - password toggle
 *  - textarea variant
 *  - disabled / readOnly states
 */
const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    icon: Icon,
    iconRight: IconRight,
    type = 'text',
    textarea = false,
    rows = 4,
    disabled = false,
    readOnly = false,
    className = '',
    containerClassName = '',
    style = {},
    value,
    onChange,
    placeholder,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const wrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: textarea ? 'flex-start' : 'center',
    background: 'var(--bg3)',
    border: `1px solid ${
      error ? 'rgba(239,68,68,0.5)' :
      focused ? 'rgba(16,185,129,0.4)' :
      'var(--border2)'
    }`,
    borderRadius: '10px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused && !error
      ? '0 0 0 3px rgba(16,185,129,0.08)'
      : error && focused
      ? '0 0 0 3px rgba(239,68,68,0.08)'
      : 'none',
    opacity: disabled ? 0.5 : 1,
  }

  const inputStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--txt)',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    padding: Icon ? '9px 10px 9px 0' : '9px 12px',
    paddingRight: (isPassword || IconRight) ? '40px' : '12px',
    resize: textarea ? 'vertical' : 'none',
    width: '100%',
    lineHeight: 1.6,
    ...style,
  }

  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--txt2)',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {label}
        </label>
      )}

      <div style={wrapperStyle}>
        {Icon && (
          <div style={{
            paddingLeft: '12px',
            display: 'flex',
            alignItems: 'center',
            color: focused ? 'var(--em3)' : 'var(--txt3)',
            transition: 'color 0.2s',
            paddingTop: textarea ? '10px' : 0,
            flexShrink: 0,
          }}>
            <Icon size={15} />
          </div>
        )}

        <Tag
          ref={ref}
          type={textarea ? undefined : inputType}
          rows={textarea ? rows : undefined}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
          className={className}
          {...props}
        />

        {/* Right icons */}
        {(isPassword || IconRight || error) && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {error && <AlertCircle size={14} style={{ color: '#FCA5A5' }} />}
            {!error && IconRight && <IconRight size={14} style={{ color: 'var(--txt3)' }} />}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'var(--txt3)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
          </div>
        )}
      </div>

      {(error || hint) && (
        <p style={{
          fontSize: '12px',
          color: error ? '#FCA5A5' : 'var(--txt3)',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default Input



