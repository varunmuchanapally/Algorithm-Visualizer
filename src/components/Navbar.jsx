import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center gap-8">
      <span className="text-white font-semibold text-lg tracking-tight">
        algo<span className="text-blue-500">.</span>vis
      </span>
      <div className="flex gap-1">
        {[['/', 'Sorting'], ['/pathfinding', 'Pathfinding']].map(([path, label]) => (
          <Link
            key={path}
            to={path}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              location.pathname === path
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}