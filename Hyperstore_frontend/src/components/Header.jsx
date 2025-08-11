
import { Link, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../utils/AuthContext"
import "../styles/Header.css"

const Header = () => {
  const { user } = useContext(AuthContext)
  const location = useLocation()       // Get the current location to conditionally render the admin link

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/icons/icon-48x48.png" alt="Nexus Store Logo" className="logo-icon" />
          <div className="logo-text-container">
            <span className="logo-text">HYPER</span>
            <span className="logo-subtitle">STORE</span>
          </div>
        </Link>
        <div className="header-actions">
          {user && user.role === 'admin' && (
            location.pathname.startsWith('/admin') ? (                 // If the current path starts with /admin, show Home link
              <Link to="/" className="admin-toggle-btn">
                Home
              </Link>
            ) : (
              <Link to="/admin" className="admin-toggle-btn">
                Admin Dashboard
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}

export default Header