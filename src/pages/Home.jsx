import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-3xl md:text-5xl font-bold">Discover Lebanon on Foot</h1>
      <p className="mt-4 text-lg">Find a trail, join a group hike, and explore the mountains.</p>
      <Link to="/trails" className="mt-6 inline-block rounded bg-green-700 px-6 py-3 text-white hover:bg-green-800">
        Browse trails
      </Link>
    </section>
  )
}