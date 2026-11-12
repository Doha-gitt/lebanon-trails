import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const links = [
  { to: '/trails', label: 'Trails' },
  { to: '/group-hikes/new', label: 'Organize a hike' },
]

// Only shown when nobody is logged in
const guestLinks = [
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
]

// Active page is marked with a rule under the label rather than a colour
// change, so it stays legible against the olive bar.
function linkClass({ isActive }) {
  return [
    'relative py-1 text-[0.9375rem] transition-opacity',
    isActive
      ? 'font-semibold after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-paper'
      : 'opacity-85 hover:opacity-100',
  ].join(' ')
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
    <header className="sticky top-0 z-50 border-b border-black/15 bg-olive text-paper dark:bg-olive-deep">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-3.5 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-[1.3rem] font-semibold tracking-tight"
        >
          <Logo trailClassName="stroke-olive dark:stroke-olive-deep" />
          Lebanon Trails
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {[...links, ...(currentUser ? [] : guestLinks)].map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex w-full items-center gap-5 sm:ml-auto sm:w-auto">
          {currentUser && (
            <>
              <span className="text-[0.9375rem] opacity-85">Hi, {currentUser.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[0.9375rem] opacity-85 transition-opacity hover:opacity-100 hover:underline hover:underline-offset-4"
              >
                Log out
              </button>
            </>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-paper/45 px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors hover:bg-paper hover:text-olive"
          >
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </nav>
    </header>
  )
}
