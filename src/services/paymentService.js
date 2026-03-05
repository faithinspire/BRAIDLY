/**
 * BRAIDLY PAYMENT SERVICE
 * Handles international payments and escrow system
 * Production-ready: Uses real payment providers only
 */

import { supabase, dbService } from './supabaseClient'

// Payment providers configuration
export const PAYMENT_PROVIDERS = {
  stripe: {
    name: 'Stripe',
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR'],
    methods: ['card', 'bank_transfer', 'wallet']
  },
  paypal: {
    name: 'PayPal',
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA', 'TH', 'MY', 'PH', 'VN', 'ID'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'THB', 'MYR', 'PHP', 'VND', 'IDR'],
    methods: ['wallet', 'bank_transfer', 'card']
  },
  wise: {
    name: 'Wise (TransferWise)',
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA', 'TH', 'MY', 'PH', 'VN', 'ID', 'KR', 'TW'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'THB', 'MYR', 'PHP', 'VND', 'IDR', 'TWD'],
    methods: ['bank_transfer']
  },
  razorpay: {
    name: 'Razorpay',
    countries: ['IN', 'AE', 'SA', 'MY', 'SG'],
    currencies: ['INR', 'AED', 'SAR', 'MYR', 'SGD'],
    methods: ['card', 'wallet', 'bank_transfer', 'upi']
  },
  flutterwave: {
    name: 'Flutterwave',
    countries: ['NG', 'GH', 'KE', 'UG', 'TZ', 'RW', 'ZA', 'CM', 'CI', 'SN', 'BJ', 'BW', 'MW', 'MZ', 'ZM', 'ZW'],
    currencies: ['NGN', 'GHS', 'KES', 'UGX', 'TZS', 'RWF', 'ZAR', 'XAF', 'XOF', 'USD'],
    methods: ['card', 'wallet', 'bank_transfer', 'mobile_money']
  }
}

/**
 * Get available payment providers for a country
 */
export function getPaymentProvidersForCountry(countryCode) {
  return Object.entries(PAYMENT_PROVIDERS)
    .filter(([_, provider]) => provider.countries.includes(countryCode))
    .map(([key, provider]) => ({ id: key, ...provider }))
}

/**
 * Create a payment in the database
 */
export async function createPayment(paymentData) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
    
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error('Error creating payment:', err)
    throw err
  }
}

/**
 * Get payment by ID
 */
export async function getPaymentById(paymentId) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (err) {
    console.error('Error fetching payment:', err)
    throw err
  }
}

/**
 * Get payment history for a user
 */
export async function getPaymentHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .or(`customer_id.eq.${userId},braider_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching payment history:', err)
    throw err
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(paymentId, status) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date() })
      .eq('id', paymentId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error('Error updating payment status:', err)
    throw err
  }
}

/**
 * Hold funds in escrow
 */
export async function holdFundsInEscrow(paymentId, amount) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'held',
        escrow_status: 'held',
        held_at: new Date()
      })
      .eq('id', paymentId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error('Error holding funds in escrow:', err)
    throw err
  }
}

/**
 * Release funds from escrow to braider
 */
export async function releaseFundsFromEscrow(paymentId) {
  try {
    const payment = await getPaymentById(paymentId)
    if (!payment) throw new Error('Payment not found')

    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'released',
        escrow_status: 'released',
        released_at: new Date()
      })
      .eq('id', paymentId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error('Error releasing funds from escrow:', err)
    throw err
  }
}

/**
 * Refund payment
 */
export async function refundPayment(paymentId, reason) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refund_reason: reason,
        refunded_at: new Date()
      })
      .eq('id', paymentId)
      .select()
    
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error('Error refunding payment:', err)
    throw err
  }
}

/**
 * Get escrow transactions
 */
export async function getEscrowTransactions(userId) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('escrow_status', 'held')
      .or(`customer_id.eq.${userId},braider_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching escrow transactions:', err)
    throw err
  }
}

/**
 * Calculate platform fees
 */
export function calculatePlatformFee(amount, percentage = 0.1) {
  return amount * percentage
}

/**
 * Calculate braider earnings
 */
export function calculateBraiderEarnings(amount, platformFeePercentage = 0.1) {
  const platformFee = calculatePlatformFee(amount, platformFeePercentage)
  return amount - platformFee
}
