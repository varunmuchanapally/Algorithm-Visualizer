export async function bfs(grid, start, end, onVisit, onPath) {
  const rows = grid.length, cols = grid[0].length
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null))
  const queue = [start]
  visited[start[0]][start[1]] = true
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]]

  while (queue.length) {
    const [r, c] = queue.shift()
    await onVisit(r, c)
    if (r === end[0] && c === end[1]) break
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc].wall || visited[nr][nc]) continue
      visited[nr][nc] = true
      prev[nr][nc] = [r, c]
      queue.push([nr, nc])
    }
  }
  await tracePath(prev, start, end, onPath)
}

export async function dfs(grid, start, end, onVisit, onPath) {
  const rows = grid.length, cols = grid[0].length
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null))
  const stack = [start]
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]]

  while (stack.length) {
    const [r, c] = stack.pop()
    if (visited[r][c]) continue
    visited[r][c] = true
    await onVisit(r, c)
    if (r === end[0] && c === end[1]) break
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc].wall || visited[nr][nc]) continue
      prev[nr][nc] = [r, c]
      stack.push([nr, nc])
    }
  }
  await tracePath(prev, start, end, onPath)
}

export async function astar(grid, start, end, onVisit, onPath) {
  const rows = grid.length, cols = grid[0].length
  const h = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1])
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity))
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null))
  const closed = Array.from({ length: rows }, () => Array(cols).fill(false))
  gScore[start[0]][start[1]] = 0
  const open = [[h(start[0], start[1]), start[0], start[1]]]
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]]

  while (open.length) {
    open.sort((a, b) => a[0] - b[0])
    const [, r, c] = open.shift()
    if (closed[r][c]) continue
    closed[r][c] = true
    await onVisit(r, c)
    if (r === end[0] && c === end[1]) break
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc].wall || closed[nr][nc]) continue
      const tg = gScore[r][c] + 1
      if (tg < gScore[nr][nc]) {
        gScore[nr][nc] = tg
        prev[nr][nc] = [r, c]
        open.push([tg + h(nr, nc), nr, nc])
      }
    }
  }
  await tracePath(prev, start, end, onPath)
}

async function tracePath(prev, start, end, onPath) {
  let cur = end
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    await onPath(cur[0], cur[1])
    cur = prev[cur[0]][cur[1]]
  }
}