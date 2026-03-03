/**
 * FORM VALIDATION SCHEMAS
 * Using Zod for runtime type checking and validation
 */

import { z } from 'zod'

// ============================================================================
// BRAIDER PROFILE SCHEMA
// ============================================================================

export const braiderProfileSchema = z.object({
  business_name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .trim(),
  
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters')
    .trim(),
  
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters'),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
  
  zip_code: z
    .string()
    .regex(/^[\d\-]+$/, 'Invalid zip code format')
    .min(5, 'Zip code must be at least 5 characters')
    .max(10, 'Zip code must be less than 10 characters'),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),
  
  base_price: z
    .number()
    .min(10, 'Base price must be at least $10')
    .max(500, 'Base price must be less than $500'),
  
  travel_radius: z
    .number()
    .min(0, 'Travel radius must be 0 or more')
    .max(100, 'Travel radius must be less than 100 miles'),
  
  mobile_service: z.boolean(),
  salon_service: z.boolean(),
  
  salon_name: z
    .string()
    .max(100, 'Salon name must be less than 100 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  salon_address: z
    .string()
    .max(200, 'Salon address must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  avatar_url: z
    .string()
    .url('Invalid avatar URL')
    .optional()
    .or(z.literal(''))
})

// ============================================================================
// CUSTOMER PROFILE SCHEMA
// ============================================================================

export const customerProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters'),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  
  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .trim(),
  
  zip_code: z
    .string()
    .regex(/^[\d\-]+$/, 'Invalid zip code format')
    .min(5, 'Zip code must be at least 5 characters')
    .max(10, 'Zip code must be less than 10 characters'),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),
  
  avatar_url: z
    .string()
    .url('Invalid avatar URL')
    .optional()
    .or(z.literal(''))
})

// ============================================================================
// BOOKING SCHEMA
// ============================================================================

export const bookingSchema = z.object({
  braider_id: z
    .string()
    .uuid('Invalid braider ID'),
  
  service_type: z
    .enum(['Box Braids', 'Knotless Braids', 'Cornrows', 'Twists', 'Kids Braids'], {
      errorMap: () => ({ message: 'Please select a valid service type' })
    }),
  
  appointment_date: z
    .string()
    .refine(
      (date) => new Date(date) > new Date(),
      'Appointment date must be in the future'
    ),
  
  appointment_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  
  duration_hours: z
    .number()
    .min(0.5, 'Duration must be at least 30 minutes')
    .max(8, 'Duration must be less than 8 hours'),
  
  location: z
    .string()
    .min(5, 'Location must be at least 5 characters')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
  
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  
  estimated_price: z
    .number()
    .min(0, 'Price must be 0 or more')
    .max(10000, 'Price must be less than $10,000')
})

// ============================================================================
// REVIEW SCHEMA
// ============================================================================

export const reviewSchema = z.object({
  braider_id: z
    .string()
    .uuid('Invalid braider ID'),
  
  booking_id: z
    .string()
    .uuid('Invalid booking ID'),
  
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must be at most 5 stars')
    .int('Rating must be a whole number'),
  
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters')
    .trim(),
  
  would_recommend: z.boolean()
})

// ============================================================================
// PAYMENT SCHEMA
// ============================================================================

export const paymentSchema = z.object({
  booking_id: z
    .string()
    .uuid('Invalid booking ID'),
  
  amount: z
    .number()
    .min(0.01, 'Amount must be at least $0.01')
    .max(10000, 'Amount must be less than $10,000'),
  
  payment_method: z
    .enum(['card', 'bank_transfer', 'cash'], {
      errorMap: () => ({ message: 'Please select a valid payment method' })
    }),
  
  card_number: z
    .string()
    .regex(/^\d{16}$/, 'Card number must be 16 digits')
    .optional()
    .or(z.literal('')),
  
  card_expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Expiry must be MM/YY format')
    .optional()
    .or(z.literal('')),
  
  card_cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3-4 digits')
    .optional()
    .or(z.literal(''))
})

// ============================================================================
// AUTHENTICATION SCHEMA
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
})

export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  confirm_password: z
    .string(),
  
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  
  user_type: z
    .enum(['customer', 'braider', 'admin'], {
      errorMap: () => ({ message: 'Please select a valid user type' })
    })
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password']
})

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validate data against a schema
 * Returns { valid: boolean, errors: object, data: object }
 */
export function validateData(schema, data) {
  try {
    const validated = schema.parse(data)
    return {
      valid: true,
      errors: {},
      data: validated
    }
  } catch (error) {
    if (error.errors) {
      const errors = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        valid: false,
        errors,
        data: null
      }
    }
    return {
      valid: false,
      errors: { general: error.message },
      data: null
    }
  }
}

/**
 * Validate a single field
 * Returns error message or null
 */
export function validateField(schema, fieldName, value) {
  try {
    const fieldSchema = schema.pick({ [fieldName]: true })
    fieldSchema.parse({ [fieldName]: value })
    return null
  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      return error.errors[0].message
    }
    return 'Invalid value'
  }
}

/**
 * Get all validation errors as an object
 */
export function getValidationErrors(schema, data) {
  const result = validateData(schema, data)
  return result.errors
}

/**
 * Check if data is valid
 */
export function isValid(schema, data) {
  const result = validateData(schema, data)
  return result.valid
}

export default {
  braiderProfileSchema,
  customerProfileSchema,
  bookingSchema,
  reviewSchema,
  paymentSchema,
  loginSchema,
  signupSchema,
  validateData,
  validateField,
  getValidationErrors,
  isValid
}
