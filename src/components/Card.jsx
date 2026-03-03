/**
 * CARD COMPONENT
 * Reusable card container with header, body, and footer
 */

import './Card.css'

export default function Card({
  children,
  header,
  footer,
  title,
  subtitle,
  icon,
  className = '',
  hoverable = true,
  ...props
}) {
  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} {...props}>
      {(header || title) && (
        <div className="card-header">
          <div className="card-header-content">
            {icon && <i className={`card-icon ${icon}`} />}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {header && <div className="card-header-action">{header}</div>}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  )
}
