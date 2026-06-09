import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Contact', path: '/contact' },
  ]

  const handleNav = (path) => {
    setIsMenuOpen(false)
    navigate(path)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
     <div className="nav-logo" onClick={() => handleNav('/')}>
          <img src="/icon.png" alt="Authly" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
          Authly
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <span
              key={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`bar ${isMenuOpen ? 'bar-open-1' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar-open-2' : ''}`}></span>
          <span className={`bar ${isMenuOpen ? 'bar-open-3' : ''}`}></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar