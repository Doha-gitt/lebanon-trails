import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/trails', label: 'Trails' },
  { to: '/group-hikes', label: 'Group Hikes' },
  { to: '/about', label: 'About' },
  { to: '/profile', label: 'Profile' },
  { to: '/login', label: 'Log in' },
]

function linkClass({ isActive }) {
  return isActive ? 'font-semibold text-brand dark:text-green-400' : 'hover:text-brand dark:hover:text-green-400'
}

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <Link to="/" className="text-xl font-bold text-brand dark:text-green-400">
          Lebanon Trails
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="ml-auto rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600"
        >
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </nav>
    </header>
  )
}
