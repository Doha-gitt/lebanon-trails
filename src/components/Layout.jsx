import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Contour from './Contour'

export default function Layout() {
  return (
    // overflow-x:clip lets the hero run full width without a sideways scrollbar,
    // while still allowing the navbar to stick.
    <div className="min-h-screen overflow-x-clip bg-stone text-ink dark:bg-earth dark:text-stone">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-ink/10 dark:border-stone/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Contour className="h-10 w-full text-brand/45 dark:text-limestone/55" />
          <p className="label-map pb-8 pt-2">
            Lebanon Trails — a student project. Trail names, regions and photographs are real;
            distances, difficulty and group hikes are sample data.
          </p>
        </div>
      </footer>
    </div>
  )
}
