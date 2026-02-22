import { useState, useRef, useEffect } from 'react'
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from '../algorithms/sorting'

const ALGORITHMS = { 'Bubble Sort': bubbleSort, 'Selection Sort': selectionSort, 'Insertion Sort': insertionSort, 'Merge Sort': mergeSort, 'Quick Sort': quickSort }
const SPEEDS = { Slow: 100, Medium: 40, Fast: 5 }

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

export default function SortingVisualizer() {
  const [array, setArray] = useState(() => generateArray(50))
  const [comparing, setComparing] = useState([])
  const [swapping, setSwapping] = useState([])
  const [sorted, setSorted] = useState(false)
  const [running, setRunning] = useState(false)
  const [algo, setAlgo] = useState('Bubble Sort')
  const [speed, setSpeed] = useState('Medium')
  const [size, setSize] = useState(50)
  const stopRef = useRef(false)

  const shuffle = () => {
    stopRef.current = true
    setRunning(false)
    setSorted(false)
    setComparing([])
    setSwapping([])
    setTimeout(() => {
      stopRef.current = false
      setArray(generateArray(size))
    }, 100)
  }

  useEffect(() => { shuffle() }, [size])

  const runSort = async () => {
    if (running) return
    stopRef.current = false
    setRunning(true)
    setSorted(false)
    const generator = ALGORITHMS[algo](array)
    const delay = SPEEDS[speed]

    for (const step of generator) {
      if (stopRef.current) break
      setArray(step.array)
      setComparing(step.comparing || [])
      setSwapping(step.swapping || [])
      if (step.done) {
        setSorted(true)
        setComparing([])
        setSwapping([])
      }
      await new Promise(r => setTimeout(r, delay))
    }
    setRunning(false)
  }

  const maxVal = Math.max(...array)

  const getBarColor = (i) => {
    if (sorted) return 'bg-emerald-500'
    if (swapping.includes(i)) return 'bg-amber-400'
    if (comparing.includes(i)) return 'bg-rose-500'
    return 'bg-blue-500'
  }

  return (
    <div className="flex flex-col h-[calc(100vh-61px)]">

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-neutral-800">

        {/* Algorithm buttons */}
        <div className="flex gap-2 flex-wrap">
          {Object.keys(ALGORITHMS).map(name => (
            <button
              key={name}
              onClick={() => { if (!running) setAlgo(name) }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                algo === name
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-xs">Speed</span>
          <div className="flex gap-1">
            {Object.keys(SPEEDS).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  speed === s ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-neutral-800" />

        {/* Size */}
        <div className="flex items-center gap-3">
          <span className="text-neutral-500 text-xs">Size</span>
          <input
            type="range" min="20" max="100" value={size}
            onChange={e => { if (!running) setSize(+e.target.value) }}
            className="w-24 accent-blue-500"
          />
          <span className="text-neutral-400 text-xs w-6">{size}</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={shuffle}
            disabled={running}
            className="px-4 py-1.5 rounded-md text-sm bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-40 transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={runSort}
            disabled={running}
            className="px-4 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors font-medium"
          >
            {running ? 'Sorting...' : 'Sort'}
          </button>
        </div>
      </div>

      {/* Bars */}
      <div className="flex-1 flex items-end gap-px px-6 pb-6 pt-4">
        {array.map((val, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-all duration-75 ${getBarColor(i)}`}
            style={{ height: `${(val / maxVal) * 100}%` }}
          />
        ))}
      </div>

    </div>
  )
}