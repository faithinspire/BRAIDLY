/**
 * GSAP ANIMATION LIBRARY
 * Timeline-based animations for backgrounds, heroes, and complex sequences
 * Used for: Landing page, Dashboard backgrounds, Hero sections
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animate hero background with parallax
 */
export function animateHeroBackground(containerSelector) {
  const container = document.querySelector(containerSelector)
  if (!container) return

  const images = container.querySelectorAll('.hero-bg-image')
  if (images.length === 0) return

  // Create timeline
  const tl = gsap.timeline({ repeat: -1 })

  images.forEach((img, index) => {
    // Fade in
    tl.to(img, {
      opacity: 0.3,
      duration: 2,
      ease: 'power2.inOut'
    }, index * 5)

    // Parallax zoom
    tl.to(img, {
      scale: 1.05,
      duration: 5,
      ease: 'none'
    }, index * 5)

    // Fade out
    tl.to(img, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut'
    }, index * 5 + 3)

    // Reset scale
    tl.to(img, {
      scale: 1,
      duration: 0.1
    }, index * 5 + 5 - 0.1)
  })

  return tl
}

/**
 * Animate dashboard background with subtle movement
 */
export function animateDashboardBackground(containerSelector) {
  const container = document.querySelector(containerSelector)
  if (!container) return

  const tl = gsap.timeline()

  // Subtle floating effect
  tl.to(container, {
    y: -10,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  })

  return tl
}

/**
 * Animate page entrance with stagger
 */
export function animatePageEntrance(containerSelector, staggerDelay = 0.1) {
  const container = document.querySelector(containerSelector)
  if (!container) return

  const elements = container.querySelectorAll('[data-animate]')
  if (elements.length === 0) return

  const tl = gsap.timeline()

  tl.from(elements, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: staggerDelay,
    ease: 'power2.out'
  })

  return tl
}

/**
 * Animate scroll-triggered elements
 */
export function animateOnScroll(selector, options = {}) {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    fromY = 30,
    fromOpacity = 0
  } = options

  gsap.utils.toArray(selector).forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: fromOpacity,
      y: fromY,
      duration,
      delay,
      stagger,
      ease: 'power2.out'
    })
  })
}

/**
 * Animate counter numbers
 */
export function animateCounter(selector, endValue, duration = 2) {
  const element = document.querySelector(selector)
  if (!element) return

  const obj = { value: 0 }

  gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString()
    }
  })
}

/**
 * Animate progress bar
 */
export function animateProgressBar(selector, percentage, duration = 1) {
  const element = document.querySelector(selector)
  if (!element) return

  gsap.to(element, {
    width: `${percentage}%`,
    duration,
    ease: 'power2.out'
  })
}

/**
 * Animate modal entrance
 */
export function animateModalEntrance(modalSelector) {
  const modal = document.querySelector(modalSelector)
  if (!modal) return

  const tl = gsap.timeline()

  // Backdrop fade in
  tl.to(modal, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  }, 0)

  // Modal scale and fade in
  tl.from(modal.querySelector('.modal-content'), {
    opacity: 0,
    scale: 0.9,
    y: -20,
    duration: 0.4,
    ease: 'back.out(1.7)'
  }, 0.1)

  return tl
}

/**
 * Animate modal exit
 */
export function animateModalExit(modalSelector) {
  const modal = document.querySelector(modalSelector)
  if (!modal) return

  const tl = gsap.timeline()

  tl.to(modal.querySelector('.modal-content'), {
    opacity: 0,
    scale: 0.9,
    y: -20,
    duration: 0.3,
    ease: 'back.in(1.7)'
  })

  tl.to(modal, {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  }, 0.1)

  return tl
}

/**
 * Animate notification entrance
 */
export function animateNotification(notificationSelector) {
  const notification = document.querySelector(notificationSelector)
  if (!notification) return

  const tl = gsap.timeline()

  // Slide in from right
  tl.from(notification, {
    x: 400,
    opacity: 0,
    duration: 0.4,
    ease: 'back.out(1.7)'
  })

  // Auto-dismiss after 4 seconds
  tl.to(notification, {
    x: 400,
    opacity: 0,
    duration: 0.4,
    ease: 'back.in(1.7)',
    delay: 3.5
  })

  return tl
}

/**
 * Animate loading spinner
 */
export function animateLoadingSpinner(spinnerSelector) {
  const spinner = document.querySelector(spinnerSelector)
  if (!spinner) return

  const tl = gsap.timeline({ repeat: -1 })

  tl.to(spinner, {
    rotation: 360,
    duration: 1,
    ease: 'none'
  })

  return tl
}

/**
 * Animate button hover effect
 */
export function animateButtonHover(buttonSelector) {
  const buttons = document.querySelectorAll(buttonSelector)

  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out'
      })
    })

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      })
    })
  })
}

/**
 * Kill all animations (cleanup)
 */
export function killAllAnimations() {
  gsap.killTweensOf('*')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

export default {
  animateHeroBackground,
  animateDashboardBackground,
  animatePageEntrance,
  animateOnScroll,
  animateCounter,
  animateProgressBar,
  animateModalEntrance,
  animateModalExit,
  animateNotification,
  animateLoadingSpinner,
  animateButtonHover,
  killAllAnimations
}
