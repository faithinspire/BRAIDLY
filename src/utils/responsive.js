/**
 * Responsive Design Utilities
 * Provides breakpoints and responsive helpers
 */

// Breakpoints
export const BREAKPOINTS = {
  mobile: 320,
  mobileLarge: 480,
  tablet: 481,
  tabletLarge: 1024,
  desktop: 1025,
  desktopLarge: 1440,
  desktopXL: 1920
}

// Media queries
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobileLarge}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.tabletLarge}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  desktopLarge: `(min-width: ${BREAKPOINTS.desktopLarge}px)`,
  desktopXL: `(min-width: ${BREAKPOINTS.desktopXL}px)`,
  touchDevice: `(hover: none) and (pointer: coarse)`,
  reducedMotion: `(prefers-reduced-motion: reduce)`
}

/**
 * Hook to detect current screen size
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    prefersReducedMotion: false
  })

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({
        width,
        height,
        isMobile: width <= BREAKPOINTS.mobileLarge,
        isTablet: width > BREAKPOINTS.tablet && width <= BREAKPOINTS.tabletLarge,
        isDesktop: width > BREAKPOINTS.desktop,
        isTouchDevice: window.matchMedia(MEDIA_QUERIES.touchDevice).matches,
        prefersReducedMotion: window.matchMedia(MEDIA_QUERIES.reducedMotion).matches
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}

/**
 * Get responsive grid columns
 */
export function getResponsiveGridColumns(screenSize) {
  if (screenSize.isMobile) return 1
  if (screenSize.isTablet) return 2
  return 4
}

/**
 * Get responsive font size
 */
export function getResponsiveFontSize(baseSize, screenSize) {
  if (screenSize.isMobile) return baseSize * 0.85
  if (screenSize.isTablet) return baseSize * 0.95
  return baseSize
}

/**
 * Get responsive padding
 */
export function getResponsivePadding(basePadding, screenSize) {
  if (screenSize.isMobile) return basePadding * 0.5
  if (screenSize.isTablet) return basePadding * 0.75
  return basePadding
}

/**
 * Check if element is visible in viewport
 */
export function useInView(ref, options = {}) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, options])

  return isVisible
}

/**
 * Responsive image component
 */
export function ResponsiveImage({ src, alt, srcSet, sizes, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes || `
        (max-width: 480px) 100vw,
        (max-width: 1024px) 50vw,
        33vw
      `}
      {...props}
    />
  )
}

/**
 * Responsive container component
 */
export function ResponsiveContainer({ children, className = '' }) {
  const screenSize = useScreenSize()
  
  return (
    <div
      className={`responsive-container ${className}`}
      style={{
        maxWidth: screenSize.isDesktop ? '1200px' : '100%',
        margin: '0 auto',
        padding: screenSize.isMobile ? '1rem 0.5rem' : '2rem 1rem'
      }}
    >
      {children}
    </div>
  )
}

/**
 * Responsive grid component
 */
export function ResponsiveGrid({ children, className = '' }) {
  const screenSize = useScreenSize()
  const columns = getResponsiveGridColumns(screenSize)
  
  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: screenSize.isMobile ? '1rem' : '1.5rem'
      }}
    >
      {children}
    </div>
  )
}

/**
 * Responsive text component
 */
export function ResponsiveText({ children, as = 'p', className = '', ...props }) {
  const screenSize = useScreenSize()
  const Component = as
  
  return (
    <Component
      className={`responsive-text ${className}`}
      style={{
        fontSize: getResponsiveFontSize(16, screenSize)
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Test responsive layout
 */
export function ResponsiveTestPanel() {
  const screenSize = useScreenSize()
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      <div>Width: {screenSize.width}px</div>
      <div>Height: {screenSize.height}px</div>
      <div>Mobile: {screenSize.isMobile ? '✓' : '✗'}</div>
      <div>Tablet: {screenSize.isTablet ? '✓' : '✗'}</div>
      <div>Desktop: {screenSize.isDesktop ? '✓' : '✗'}</div>
      <div>Touch: {screenSize.isTouchDevice ? '✓' : '✗'}</div>
      <div>Reduced Motion: {screenSize.prefersReducedMotion ? '✓' : '✗'}</div>
    </div>
  )
}
