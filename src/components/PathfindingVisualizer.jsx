import { useState, useRef } from 'react'
import { bfs, dfs, astar } from '../algorithms/pathfinding'

const ROWS = 20
const COLS = 45
const ALGORITHMS = { BFS: bfs, DFS: dfs, 'A* Search': astar }
const SPEEDS = { Slow: 30, Medium: 15, Fast: 2 }

function makeGrid() {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      r, c, wall: false, visited: false, path: false
    }))
  )
}

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(makeGrid)
  const [start, setStart] = useState([5, 5])
  const [end, setEnd] = useState([14, 39])
  const [algo, setAlgo] = useState('BFS')
  const [speed, setSpeed] = useState('Medium')
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState('wall')
  const [mouseDown, setMouseDown] = useState(false)
  const [stats, setStats] = useState(null)
  const runningRef = useRef(false)

  const resetGrid = () => {
    runningRef.current = false
    setRunning(false)
    setStats(null)
    setGrid(makeGrid())
  }

  const clearPath = () => {
    setStats(null)
    setGrid(prev => prev.map(row => row.map(cell => ({ ...cell, visited: false, path: false }))))
  }

  const handleCellClick = (r, c) => {
    if (running) return
    if (mode === 'start') { setStart([r, c]); return }
    if (mode === 'end') { setEnd([r, c]); return }
    setGrid(prev => {
      const g = prev.map(row => row.map(cell => ({ ...cell })))
      g[r][c].wall = !g[r][c].wall
      return g
    })
  }

  const handleCellEnter = (r, c) => {
    if (!mouseDown || running || mode !== 'wall') return
    setGrid(prev => {
      const g = prev.map(row => row.map(cell => ({ ...cell })))
      g[r][c].wall = true
      return g
    })
  }

  const visualize = async () => {
    if (running) return
    clearPath()
    await new Promise(r => setTimeout(r, 50))
    runningRef.current = true
    setRunning(true)
    setStats(null)

    const delay = SPEEDS[speed]
    let visitCount = 0
    let pathCount = 0

    const onVisit = async (r, c) => {
      if (!runningRef.current) return
      if (r === start[0] && c === start[1]) return
      if (r === end[0] && c === end[1]) return
      visitCount++
      setGrid(prev => {
        const g = prev.map(row => row.map(cell => ({ ...cell })))
        g[r][c].visited = true
        return g
      })
      await new Promise(res => setTimeout(res, delay))
    }

    const onPath = async (r, c) => {
      if (!runningRef.current) return
      if (r === start[0] && c === start[1]) return
      if (r === end[0] && c === end[1]) return
      pathCount++
      setGrid(prev => {
        const g = prev.map(row => row.map(cell => ({ ...cell })))
        g[r][c].path = true
        return g
      })
      await new Promise(res => setTimeout(res, delay * 4))
    }

    await ALGORITHMS[algo](grid, start, end, onVisit, onPath)
    setStats({ visited: visitCount, path: pathCount })
    runningRef.current = false
    setRunning(false)
  }

  const getCellStyle = (cell, r, c) => {
    const isStart = r === start[0] && c === start[1]
    const isEnd = r === end[0] && c === end[1]
    if (isStart) return 'bg-emerald-500'
    if (isEnd) return 'bg-rose-500'
    if (cell.wall) return 'bg-neutral-600'
    if (cell.path) return 'bg-amber-400'
    if (cell.visited) return 'bg-blue-900'
    return 'bg-neutral-900 hover:bg-neutral-700'
  }

  return (
    <div className="flex flex-col h-[calc(100vh-61px)]">

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-neutral-800">

        {/* Algorithms */}
        <div className="flex gap-2">
          {Object.keys(ALGORITHMS).map(name => (
            <button key={name} onClick={() => { if (!running) setAlgo(name) }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                algo === name ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}>
              {name}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        {/* Mode */}
        <div className="flex gap-1">
          {[['wall', 'Draw Walls'], ['start', 'Move Start'], ['end', 'Move End']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                mode === m ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-xs">Speed</span>
          <div className="flex gap-1">
            {Object.keys(SPEEDS).map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  speed === s ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-white'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex gap-4 text-xs text-neutral-400">
            <span>Visited: <span className="text-blue-400">{stats.visited}</span></span>
            <span>Path: <span className="text-amber-400">{stats.path}</span></span>
          </div>
        )}

        <div className="flex gap-2 ml-auto">
          <button onClick={clearPath} disabled={running}
            className="px-4 py-1.5 rounded-md text-sm bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors">
            Clear Path
          </button>
          <button onClick={resetGrid} disabled={running}
            className="px-4 py-1.5 rounded-md text-sm bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors">
            Reset
          </button>
          <button onClick={visualize} disabled={running}
            className="px-4 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors font-medium">
            {running ? 'Running...' : 'Visualize'}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 px-6 py-2 border-b border-neutral-800">
        {[['bg-emerald-500', 'Start'], ['bg-rose-500', 'End'], ['bg-neutral-600', 'Wall'], ['bg-blue-900', 'Visited'], ['bg-amber-400', 'Path']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-neutral-500 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center bg-neutral-950 p-4"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onMouseLeave={() => setMouseDown(false)}>
        <div className="border border-neutral-800 rounded-lg overflow-hidden">
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <div
                  key={c}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => handleCellEnter(r, c)}
                  className={`w-[22px] h-[22px] border-[0.5px] border-neutral-800 cursor-pointer transition-colors duration-100 ${getCellStyle(cell, r, c)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}