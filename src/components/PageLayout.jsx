import Navbar from './Navbar'
import './PageLayout.css'

export default function PageLayout({ children, sidebar = null, footer = null }) {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-wrapper">
        {sidebar && <aside className="sidebar">{sidebar}</aside>}
        <main className="page-content">{children}</main>
      </div>
      {footer && <footer className="page-footer">{footer}</footer>}
    </div>
  )
}
