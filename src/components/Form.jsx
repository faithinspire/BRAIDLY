export function FormGroup({ label, error, required, children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-900 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Input({
  label,
  error,
  required,
  className = '',
  ...props
}) {
  return (
    <FormGroup label={label} error={error} required={required}>
      <input
        className={`w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all ${
          error ? 'border-red-600' : ''
        } ${className}`}
        {...props}
      />
    </FormGroup>
  )
}

export function Textarea({
  label,
  error,
  required,
  className = '',
  ...props
}) {
  return (
    <FormGroup label={label} error={error} required={required}>
      <textarea
        className={`w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all resize-vertical min-h-32 ${
          error ? 'border-red-600' : ''
        } ${className}`}
        {...props}
      />
    </FormGroup>
  )
}

export function Select({
  label,
  error,
  required,
  options = [],
  className = '',
  ...props
}) {
  return (
    <FormGroup label={label} error={error} required={required}>
      <select
        className={`w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all ${
          error ? 'border-red-600' : ''
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormGroup>
  )
}

export function Checkbox({ label, className = '', ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        className={`w-5 h-5 border-2 border-neutral-300 rounded accent-purple-600 cursor-pointer ${className}`}
        {...props}
      />
      <span className="text-neutral-900">{label}</span>
    </label>
  )
}

export function RadioGroup({ label, options = [], value, onChange, error, required }) {
  return (
    <FormGroup label={label} error={error} required={required}>
      <div className="space-y-3">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 border-2 border-neutral-300 accent-purple-600 cursor-pointer"
            />
            <span className="text-neutral-900">{opt.label}</span>
          </label>
        ))}
      </div>
    </FormGroup>
  )
}
