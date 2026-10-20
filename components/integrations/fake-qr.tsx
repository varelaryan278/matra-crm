const SIZE = 25

const finder = (x: number, y: number) => {
  const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7
  const ring = (ox: number, oy: number) => {
    const dx = x - ox
    const dy = y - oy
    return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
  }
  if (inBox(0, 0)) return { inside: true, on: ring(0, 0) }
  if (inBox(SIZE - 7, 0)) return { inside: true, on: ring(SIZE - 7, 0) }
  if (inBox(0, SIZE - 7)) return { inside: true, on: ring(0, SIZE - 7) }
  return { inside: false, on: false }
}

export const FakeQr = ({ seed }: { seed: number }) => {
  const cells: [number, number][] = []
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const f = finder(x, y)
      const on = f.inside ? f.on : (Math.imul(x * 73856093 ^ y * 19349663 ^ seed * 83492791, 2654435761) >>> 0) % 100 < 46
      if (on) cells.push([x, y])
    }
  }
  return (
    <svg viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`} className="size-48 rounded-lg bg-white p-2 shadow-sm" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#111" />
      ))}
    </svg>
  )
}
