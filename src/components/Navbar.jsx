import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const links = [
  { to: '/trails', label: 'Trails' },
  { to: '/group-hikes/new', label: 'Organize a Hike' },
]

// Only shown when nobody is logged in
const guestLinks = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
]

function linkClass({ isActive }) {
  return `underline-offset-4 ${isActive ? 'font-semibold underline' : 'hover:underline'}`
}

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-olive text-paper">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Logo />
          Lebanon Trails
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {[...links, ...(currentUser ? [] : guestLinks)].map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          {currentUser && (
            <>
              <span>Hi, {currentUser.name}</span>
              <button type="button" onClick={handleLogout} className="underline-offset-4 hover:underline">
                Log out
              </button>
            </>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded border border-paper/60 px-3 py-1 text-sm hover:bg-paper hover:text-olive"
          >
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </nav>
    </header>
  )
}
