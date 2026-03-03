/**
 * FRAMER MOTION ANIMATION PRESETS
 * Reusable animation variants for UI components, buttons, and page transitions
 * Used for: Buttons, Cards, Modals, Page transitions, Sidebar animations
 */

/**
 * PAGE TRANSITION ANIMATIONS
 */
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

/**
 * BUTTON ANIMATIONS
 */
export const buttonVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

/**
 * CARD ANIMATIONS
 */
export const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  hover: {
    y: -5,
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

/**
 * MODAL ANIMATIONS
 */
export const modalBackdropVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

export const modalContentVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: -20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'backOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'backIn'
    }
  }
}

/**
 * SIDEBAR ANIMATIONS
 */
export const sidebarVariants = {
  initial: {
    x: -300,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

/**
 * DROPDOWN ANIMATIONS
 */
export const dropdownVariants = {
  initial: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
}

/**
 * NOTIFICATION ANIMATIONS
 */
export const notificationVariants = {
  initial: {
    x: 400,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

/**
 * LOADING SPINNER ANIMATIONS
 */
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

/**
 * STAGGER CONTAINER ANIMATIONS
 */
export const containerVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const itemVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

/**
 * HERO SECTION ANIMATIONS
 */
export const heroTitleVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

export const heroSubtitleVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: 'easeOut'
    }
  }
}

export const heroButtonVariants = {
  initial: {
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.4,
      ease: 'backOut'
    }
  }
}

/**
 * FORM INPUT ANIMATIONS
 */
export const inputFocusVariants = {
  rest: {
    borderColor: '#e5e7eb',
    boxShadow: '0 0 0 0px rgba(147, 51, 234, 0)'
  },
  focus: {
    borderColor: '#9333ea',
    boxShadow: '0 0 0 3px rgba(147, 51, 234, 0.1)',
    transition: {
      duration: 0.2
    }
  }
}

/**
 * SCROLL REVEAL ANIMATIONS
 */
export const scrollRevealVariants = {
  initial: {
    opacity: 0,
    y: 40
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

/**
 * FADE IN/OUT ANIMATIONS
 */
export const fadeVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

/**
 * SLIDE ANIMATIONS
 */
export const slideLeftVariants = {
  initial: {
    x: 100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

export const slideRightVariants = {
  initial: {
    x: -100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

/**
 * SCALE ANIMATIONS
 */
export const scaleVariants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut'
    }
  }
}

export default {
  pageTransitionVariants,
  buttonVariants,
  cardVariants,
  modalBackdropVariants,
  modalContentVariants,
  sidebarVariants,
  dropdownVariants,
  notificationVariants,
  spinnerVariants,
  containerVariants,
  itemVariants,
  heroTitleVariants,
  heroSubtitleVariants,
  heroButtonVariants,
  inputFocusVariants,
  scrollRevealVariants,
  fadeVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants
}
