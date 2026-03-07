/**
 * ADVANCED PAYMENT SERVICE - INTERNATIONAL EDITION
 * Real-time payments with escrow, multiple providers, and API integration
 * Production-ready implementation
 */

import { supabase } from './supabaseClient'

// Real payment provider APIs
export const PAYMENT_PROVIDERS = {
  stripe: {
    name: 'Stripe',
    apiKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR'],
    methods: ['card', 'bank_transfer', 'wallet', 'apple_pay', 'google_pay'],
    fees: 0.029, // 2.9% + $0.30
    fixedFee: 0.30
  },
  paypal: {
    name: 'PayPal',
    apiKey: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA', 'TH', 'MY', 'PH', 'VN', 'ID'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'THB', 'MYR', 'PHP', 'VND', 'IDR'],
    methods: ['wallet', 'bank_transfer', 'card'],
    fees: 0.034, // 3.4% + $0.30
    fixedFee: 0.30
  },
  wise: {
    name: 'Wise (TransferWise)',
    apiKey: process.env.REACT_APP_WISE_API_KEY,
    countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'MT', 'CY', 'LU', 'JP', 'SG', 'HK', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'IN', 'AE', 'SA', 'ZA', 'TH', 'MY', 'PH', 'VN', 'ID', 'KR', 'TW'],
    currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'THB', 'MYR', 'PHP', 'VND', 'IDR', 'TWD'],
    methods: ['bank_transfer'],
    fees: 0.01, // 1% average
    fixedFee: 0
  },
  razorpay: {
    name: 'Razorpay',
    apiKey: process.env.REACT_APP_RAZORPAY_KEY_ID,
    countries: ['IN', 'AE', 'SA', 'MY', 'SG'],
    currencies: ['INR', 'AED', 'SAR', 'MYR', 'SGD'],
    methods: ['card', 'wallet', 'bank_transfer', 'upi'],
    fees: 0.02, // 2%
    fixedFee: 0
  },
  flutterwave: {
    name: 'Flutterwave',
    apiKey: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    countries: ['NG', 'GH', 'KE', 'UG', 'TZ', 'RW', 'ZA', 'CM', 'CI', 'SN', 'BJ', 'BW', 'MW', 'MZ', 'ZM', 'ZW'],
    currencies: ['NGN', 'GHS', 'KES', 'UGX', 'TZS', 'RWF', 'ZAR', 'XAF', 'XOF', 'USD'],
    methods: ['card', 'wallet', 'bank_transfer', 'mobile_money'],
    fees: 0.015, // 1.5%
    fixedFee: 0
  }
}

// ESCROW SYSTEM
export class EscrowManager {
  /**
   * Create escrow transaction
   */
  static async createEscrow(paymentData) {
    try {
      const escrowData = {
        payment_id: paymentData.id,
        customer_id: paymentData.customer_id,
        braider_id: paymentData.braider_id,
        amount: paymentData.amount,
        status: 'held',
        held_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        metadata: {
          booking_id: paymentData.booking_id,
          service_type: paymentData.service_type,
          currency: paymentData.currency
        }
      }

      const { data, error } = await supabase
        .from('escrow_transactions')
        .insert([escrowData])
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error creating escrow:', err)
      throw err
    }
  }

  /**
   * Release funds from escrow to braider
   */
  static async releaseFunds(escrowId, releaseReason = 'service_completed') {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'released',
          released_at: new Date().toISOString(),
          release_reason: releaseReason
        })
        .eq('id', escrowId)
        .select()

      if (error) throw error
      
      // Trigger webhook to payment provider
      await this.triggerReleaseWebhook(data[0])
      return data[0]
    } catch (err) {
      console.error('Error releasing escrow funds:', err)
      throw err
    }
  }

  /**
   * Refund escrow to customer
   */
  static async refundEscrow(escrowId, refundReason) {
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString(),
          refund_reason: refundReason
        })
        .eq('id', escrowId)
        .select()

      if (error) throw error
      
      // Trigger webhook to payment provider
      await this.triggerRefundWebhook(data[0])
      return data[0]
    } catch (err) {
      console.error('Error refunding escrow:', err)
      throw err
    }
  }

  /**
   * Trigger release webhook
   */
  static async triggerReleaseWebhook(escrowData) {
    try {
      const response = await fetch('/api/webhooks/escrow-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(escrowData)
      })
      return await response.json()
    } catch (err) {
      console.error('Webhook error:', err)
    }
  }

  /**
   * Trigger refund webhook
   */
  static async triggerRefundWebhook(escrowData) {
    try {
      const response = await fetch('/api/webhooks/escrow-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(escrowData)
      })
      return await response.json()
    } catch (err) {
      console.error('Webhook error:', err)
    }
  }
}

// REAL-TIME PAYMENT PROCESSOR
export class RealtimePaymentProcessor {
  /**
   * Process payment with real-time status updates
   */
  static async processPayment(paymentData, provider) {
    try {
      // Validate provider
      if (!PAYMENT_PROVIDERS[provider]) {
        throw new Error(`Invalid payment provider: ${provider}`)
      }

      // Create payment record
      const payment = await this.createPaymentRecord(paymentData, provider)

      // Process with provider
      const result = await this.processWithProvider(payment, provider)

      // Update payment status
      await this.updatePaymentStatus(payment.id, 'processing', result)

      // Create escrow
      const escrow = await EscrowManager.createEscrow(payment)

      // Subscribe to real-time updates
      this.subscribeToPaymentUpdates(payment.id)

      return { payment, escrow, result }
    } catch (err) {
      console.error('Payment processing error:', err)
      throw err
    }
  }

  /**
   * Create payment record in database
   */
  static async createPaymentRecord(paymentData, provider) {
    try {
      const record = {
        customer_id: paymentData.customerId,
        braider_id: paymentData.braiderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        provider,
        payment_method: paymentData.method,
        status: 'pending',
        metadata: {
          booking_id: paymentData.bookingId,
          service_type: paymentData.serviceType,
          description: paymentData.description
        },
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('payments')
        .insert([record])
        .select()

      if (error) throw error
      return data[0]
    } catch (err) {
      console.error('Error creating payment record:', err)
      throw err
    }
  }

  /**
   * Process payment with specific provider
   */
  static async processWithProvider(payment, provider) {
    const providerConfig = PAYMENT_PROVIDERS[provider]

    switch (provider) {
      case 'stripe':
        return await this.processStripe(payment, providerConfig)
      case 'paypal':
        return await this.processPayPal(payment, providerConfig)
      case 'wise':
        return await this.processWise(payment, providerConfig)
      case 'razorpay':
        return await this.processRazorpay(payment, providerConfig)
      case 'flutterwave':
        return await this.processFlutterwave(payment, providerConfig)
      default:
        throw new Error(`Provider ${provider} not implemented`)
    }
  }

  /**
   * Process Stripe payment
   */
  static async processStripe(payment, config) {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: Math.round(payment.amount * 100),
          currency: payment.currency.toLowerCase(),
          metadata: JSON.stringify(payment.metadata)
        })
      })

      if (!response.ok) throw new Error('Stripe API error')
      return await response.json()
    } catch (err) {
      console.error('Stripe processing error:', err)
      throw err
    }
  }

  /**
   * Process PayPal payment
   */
  static async processPayPal(payment, config) {
    try {
      const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: payment.currency,
              value: payment.amount.toString()
            },
            description: payment.metadata.description
          }]
        })
      })

      if (!response.ok) throw new Error('PayPal API error')
      return await response.json()
    } catch (err) {
      console.error('PayPal processing error:', err)
      throw err
    }
  }

  /**
   * Process Wise transfer
   */
  static async processWise(payment, config) {
    try {
      const response = await fetch('https://api.wise.com/v1/transfers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetAccount: payment.metadata.account_id,
          quoteUuid: payment.metadata.quote_id,
          customerTransactionId: payment.id,
          details: {
            reference: `BRAIDLY-${payment.id}`
          }
        })
      })

      if (!response.ok) throw new Error('Wise API error')
      return await response.json()
    } catch (err) {
      console.error('Wise processing error:', err)
      throw err
    }
  }

  /**
   * Process Razorpay payment
   */
  static async processRazorpay(payment, config) {
    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(config.apiKey + ':')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(payment.amount * 100),
          currency: payment.currency,
          receipt: payment.id,
          notes: payment.metadata
        })
      })

      if (!response.ok) throw new Error('Razorpay API error')
      return await response.json()
    } catch (err) {
      console.error('Razorpay processing error:', err)
      throw err
    }
  }

  /**
   * Process Flutterwave payment
   */
  static async processFlutterwave(payment, config) {
    try {
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          payment_options: payment.metadata.payment_method,
          customer: {
            email: payment.metadata.customer_email,
            name: payment.metadata.customer_name
          },
          customizations: {
            title: 'BRAIDLY Payment',
            description: payment.metadata.description
          }
        })
      })

      if (!response.ok) throw new Error('Flutterwave API error')
      return await response.json()
    } catch (err) {
      console.error('Flutterwave processing error:', err)
      throw err
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(paymentId, status, providerData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status,
          provider_response: providerData,
          updated_at: new Date().toISOString()
        })
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
   * Subscribe to real-time payment updates
   */
  static subscribeToPaymentUpdates(paymentId) {
    const subscription = supabase
      .from(`payments:id=eq.${paymentId}`)
      .on('*', payload => {
        console.log('Payment update:', payload)
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('paymentUpdate', { detail: payload }))
      })
      .subscribe()

    return subscription
  }
}

// UTILITY FUNCTIONS
export function getPaymentProvidersForCountry(countryCode) {
  return Object.entries(PAYMENT_PROVIDERS)
    .filter(([_, provider]) => provider.countries.includes(countryCode))
    .map(([key, provider]) => ({ id: key, ...provider }))
}

export function calculatePaymentFees(amount, provider) {
  const config = PAYMENT_PROVIDERS[provider]
  if (!config) return 0
  return (amount * config.fees) + config.fixedFee
}

export function calculateBraiderEarnings(amount, provider, platformFee = 0.1) {
  const paymentFees = calculatePaymentFees(amount, provider)
  const platformCut = amount * platformFee
  return amount - paymentFees - platformCut
}
