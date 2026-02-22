import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SortingVisualizer from './components/SortingVisualizer'
import PathfindingVisualizer from './components/PathfindingVisualizer'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<SortingVisualizer />} />
        <Route path="/pathfinding" element={<PathfindingVisualizer />} />
      </Routes>
    </div>
  )
}