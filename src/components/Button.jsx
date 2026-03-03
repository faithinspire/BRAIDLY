/**
 * BUTTON COMPONENT
 * Unified, accessible button with multiple variants and states
 */

import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-block',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && iconPosition === 'left' && !loading && <i className={`btn-icon ${icon}`} />}
      <span>{children}</span>
      {icon && iconPosition === 'right' && !loading && <i className={`btn-icon ${icon}`} />}
    </button>
  )
}
