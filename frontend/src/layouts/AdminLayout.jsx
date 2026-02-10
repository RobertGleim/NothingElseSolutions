import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  FiHome, FiPackage, FiShoppingBag, FiBarChart2, 
  FiShare2, FiTag, FiMail, FiSettings, FiLogOut,
  FiMenu, FiX, FiExternalLink
} from 'react-icons/fi'
import './AdminLayout.css'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    /* FUTURE VERSION - Products & Orders
    { path: '/admin/products', icon: FiPackage, label: 'Products' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/promos', icon: FiTag, label: 'Promos' },
    */
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/social-post', icon: FiShare2, label: 'Social Post' },
    { path: '/admin/contacts', icon: FiMail, label: 'Contacts' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ]

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="NE Solutions" className="sidebar-logo" />
          {sidebarOpen && <span className="sidebar-title">Admin</span>}
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="sidebar-icon" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="view-site-btn" target="_blank">
            <FiExternalLink />
            {sidebarOpen && <span>View Website</span>}
          </Link>
          <div className="admin-user">
            <div className="admin-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="admin-info">
                <span className="admin-name">{user?.name || 'Admin'}</span>
                <span className="admin-role">Administrator</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
