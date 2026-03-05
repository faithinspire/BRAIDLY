/**
 * STRIPE PAYMENT SERVICE
 * Handles secure card tokenization and payment processing
 * Never stores raw card data - uses Stripe tokens only
 */

// Validate card number using Luhn algorithm
export function validateCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(cleaned)) return false

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Validate expiry date (MM/YY format)
export function validateExpiryDate(expiryDate) {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!regex.test(expiryDate)) return false

  const [month, year] = expiryDate.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  const expYear = parseInt(year, 10)
  const expMonth = parseInt(month, 10)

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}

// Validate CVV (3-4 digits)
export function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv)
}

// Validate all card details
export function validateCardDetails(cardNumber, expiryDate, cvv) {
  const errors = []

  if (!validateCardNumber(cardNumber)) {
    errors.push('Invalid card number')
  }

  if (!validateExpiryDate(expiryDate)) {
    errors.push('Invalid expiry date (use MM/YY format)')
  }

  if (!validateCVV(cvv)) {
    errors.push('Invalid CVV (3-4 digits required)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format card number with spaces
export function formatCardNumber(value) {
  const cleaned = value.replace(/\s/g, '')
  const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim()
  return formatted.slice(0, 19)
}

// Format expiry date
export function formatExpiryDate(value) {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}

// Get card type from number
export function getCardType(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) return 'visa'
  if (/^5[1-5][0-9]{14}$/.test(cleaned)) return 'mastercard'
  if (/^3[47][0-9]{13}$/.test(cleaned)) return 'amex'
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cleaned)) return 'discover'
  
  return 'unknown'
}

/**
 * Create a payment intent with Stripe
 * In production, this should be called from your backend
 */
export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  try {
    // This should call your backend endpoint that uses Stripe's server-side SDK
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error creating payment intent:', err)
    throw err
  }
}

/**
 * Confirm payment with Stripe
 * In production, use Stripe.js library for this
 */
export async function confirmPayment(paymentIntentId, cardToken) {
  try {
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        cardToken
      })
    })

    if (!response.ok) {
      throw new Error('Payment confirmation failed')
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error confirming payment:', err)
    throw err
  }
}

/**
 * Mask card number for display (show last 4 digits only)
 */
export function maskCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, '')
  const lastFour = cleaned.slice(-4)
  return `•••• •••• •••• ${lastFour}`
}
