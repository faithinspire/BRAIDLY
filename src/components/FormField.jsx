/**
 * FORM FIELD COMPONENT
 * Reusable form field with validation, error display, and accessibility
 */

import './FormField.css'

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = false,
  hint,
  icon,
  maxLength,
  min,
  max,
  step,
  options, // For select fields
  rows, // For textarea
  autoComplete,
  pattern,
  children // For custom content
}) {
  const hasError = touched && error
  const isValid = touched && !error

  const baseProps = {
    name,
    value: value || '',
    onChange,
    onBlur,
    disabled,
    className: `form-field-input ${hasError ? 'error' : ''} ${isValid ? 'valid' : ''}`,
    'aria-label': label,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': hasError ? `${name}-error` : hint ? `${name}-hint` : undefined
  }

  return (
    <div className="form-field">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="form-field-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="form-field-container">
        {/* Icon */}
        {icon && <span className="form-field-icon">{icon}</span>}

        {/* Input Field */}
        {type === 'textarea' ? (
          <textarea
            {...baseProps}
            placeholder={placeholder}
            rows={rows || 4}
            maxLength={maxLength}
          />
        ) : type === 'select' ? (
          <select {...baseProps} placeholder={placeholder}>
            <option value="">Select {label?.toLowerCase() || 'option'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <input
            {...baseProps}
            type="checkbox"
            checked={value || false}
            className="form-field-checkbox"
          />
        ) : type === 'radio' ? (
          <input
            {...baseProps}
            type="radio"
            className="form-field-radio"
          />
        ) : (
          <input
            {...baseProps}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            pattern={pattern}
          />
        )}

        {/* Validation Icons */}
        {hasError && (
          <span className="form-field-icon-error" aria-hidden="true">
            <i className="fas fa-exclamation-circle"></i>
          </span>
        )}
        {isValid && (
          <span className="form-field-icon-valid" aria-hidden="true">
            <i className="fas fa-check-circle"></i>
          </span>
        )}

        {/* Custom Content */}
        {children}
      </div>

      {/* Hint Text */}
      {hint && !hasError && (
        <p id={`${name}-hint`} className="form-field-hint">
          {hint}
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <p id={`${name}-error`} className="form-field-error" role="alert">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </p>
      )}

      {/* Character Count */}
      {maxLength && type === 'textarea' && (
        <p className="form-field-count">
          {value?.length || 0} / {maxLength}
        </p>
      )}
    </div>
  )
}
