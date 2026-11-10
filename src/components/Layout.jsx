import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-stone text-ink dark:bg-earth dark:text-stone">
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
