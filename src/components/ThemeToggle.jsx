import { useState, useEffect } from 'react'
import './ThemeToggle.css'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('braidly_theme')
    return saved === 'dark'
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-theme')
      localStorage.setItem('braidly_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark-theme')
      localStorage.setItem('braidly_theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
    </button>
  )
}

export default ThemeToggle
