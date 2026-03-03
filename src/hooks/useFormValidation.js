/**
 * FORM VALIDATION HOOK
 * Provides real-time validation with error handling
 */

import { useState, useCallback } from 'react'
import { validateData, validateField } from '../schemas/validationSchemas'

/**
 * useFormValidation Hook
 * 
 * Usage:
 * const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormValidation(
 *   initialValues,
 *   validationSchema,
 *   onSubmit
 * )
 */
export function useFormValidation(initialValues, validationSchema, onSubmit) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Handle field change with real-time validation
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Real-time validation if field has been touched
    if (touched[name]) {
      const error = validateField(validationSchema, name, newValue)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }, [touched, validationSchema])

  // Handle field blur - mark as touched and validate
  const handleBlur = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate on blur
    const error = validateField(validationSchema, name, fieldValue)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [validationSchema])

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Validate all fields
    const validation = validateData(validationSchema, values)

    if (!validation.valid) {
      setErrors(validation.errors)
      // Mark all fields as touched
      const allTouched = {}
      Object.keys(values).forEach(key => {
        allTouched[key] = true
      })
      setTouched(allTouched)
      return
    }

    // All fields valid, call onSubmit
    try {
      setIsSubmitting(true)
      await onSubmit(validation.data)
    } catch (error) {
      setSubmitError(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validationSchema, onSubmit])

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitError('')
  }, [initialValues])

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  // Get field props for input elements
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur
    }
  }, [values, handleChange, handleBlur])

  // Get field error if touched
  const getFieldError = useCallback((name) => {
    return touched[name] ? errors[name] : null
  }, [errors, touched])

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
    setFieldError,
    getFieldProps,
    getFieldError,
    isValid
  }
}

export default useFormValidation
