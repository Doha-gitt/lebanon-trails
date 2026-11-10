import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/trails', label: 'Trails' },
  { to: '/group-hikes/new', label: 'Organize a Hike' },
  { to: '/login', label: 'Log in' },
  { to: '/register', label: 'Register' },
]

function linkClass({ isActive }) {
  return `underline-offset-4 ${isActive ? 'font-semibold underline' : 'hover:underline'}`
}

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="bg-olive text-paper">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <Link to="/" className="text-xl font-bold">
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
          className="ml-auto rounded border border-paper/60 px-3 py-1 text-sm hover:bg-paper hover:text-olive"
        >
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </nav>
    </header>
  )
}
