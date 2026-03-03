/**
 * BUTTON COMPONENT V2 - COMPLETE REWRITE
 * Production-grade button with Framer Motion animations
 * Variants: primary, secondary, success, danger, ghost
 * Sizes: sm, md, lg
 * States: loading, disabled, active
 */

import { motion } from 'framer-motion'
import { buttonVariants } from '../animations/framerMotionAnimations'
import './ButtonV2.css'

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
    'btn-v2',
    `btn-v2-${variant}`,
    `btn-v2-${size}`,
    fullWidth && 'btn-v2-block',
    loading && 'btn-v2-loading',
    disabled && 'btn-v2-disabled',
    className
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled && !loading ? 'hover' : 'rest'}
      whileTap={!disabled && !loading ? 'tap' : 'rest'}
      {...props}
    >
      {loading && (
        <span className="btn-v2-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </span>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <i className={`btn-v2-icon ${icon}`}></i>
      )}
      
      <span className="btn-v2-text">{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <i className={`btn-v2-icon ${icon}`}></i>
      )}
    </motion.button>
  )
}
