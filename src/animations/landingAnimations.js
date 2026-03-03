/**
 * Landing Page Animations - GSAP
 * Smooth, professional animations for hero section and features
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero Section Animation
 */
export function animateHeroSection() {
  const timeline = gsap.timeline()

  // Hero title
  timeline.from('.hero-title', {
    duration: 1,
    opacity: 0,
    y: 50,
    ease: 'power3.out'
  })

  // Hero subtitle
  timeline.from('.hero-subtitle', {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.7')

  // Hero buttons
  timeline.from('.hero-buttons .btn', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.2,
    ease: 'power3.out'
  }, '-=0.5')

  // Hero image
  timeline.from('.hero-image', {
    duration: 1.2,
    opacity: 0,
    scale: 0.9,
    ease: 'power3.out'
  }, '-=0.8')

  return timeline
}

/**
 * Feature Cards Animation
 */
export function animateFeatureCards() {
  gsap.utils.toArray('.feature-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
      delay: index * 0.1,
      ease: 'power3.out'
    })
  })
}

/**
 * Testimonials Animation
 */
export function animateTestimonials() {
  gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      opacity: 0,
      x: index % 2 === 0 ? -50 : 50,
      ease: 'power3.out'
    })
  })
}

/**
 * CTA Section Animation
 */
export function animateCTASection() {
  const ctaSection = '.cta-section'
  
  gsap.from(ctaSection, {
    scrollTrigger: {
      trigger: ctaSection,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    duration: 1,
    opacity: 0,
    scale: 0.95,
    ease: 'power3.out'
  })

  // Pulse animation for CTA button
  gsap.to('.cta-button', {
    duration: 2,
    boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

/**
 * Floating Animation (for images/icons)
 */
export function animateFloating(selector) {
  gsap.to(selector, {
    duration: 3,
    y: -20,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
}

/**
 * Counter Animation (for stats)
 */
export function animateCounter(selector, endValue, duration = 2) {
  const obj = { value: 0 }
  
  gsap.to(obj, {
    value: endValue,
    duration: duration,
    onUpdate: function() {
      gsap.set(selector, { textContent: Math.round(obj.value) })
    },
    ease: 'power2.out'
  })
}

/**
 * Initialize all landing animations
 */
export function initLandingAnimations() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      animateHeroSection()
      animateFeatureCards()
      animateTestimonials()
      animateCTASection()
    })
  } else {
    animateHeroSection()
    animateFeatureCards()
    animateTestimonials()
    animateCTASection()
  }
}

export default {
  animateHeroSection,
  animateFeatureCards,
  animateTestimonials,
  animateCTASection,
  animateFloating,
  animateCounter,
  initLandingAnimations
}
