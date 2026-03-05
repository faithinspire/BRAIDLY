import Navbar from './Navbar'
import './PageLayout.css'

export default function PageLayout({ children, sidebar = null }) {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-wrapper">
        {sidebar && <aside className="sidebar">{sidebar}</aside>}
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
