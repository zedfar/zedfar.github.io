interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface Connection {
  from: string
  to: string
  color: string
  offset: number
}

interface Point {
  x: number
  y: number
}

const CONNECTION_MAP: Connection[] = [
  { from: 'port-hero-out',   to: 'port-about-in',   color: '#00e5ff', offset: 0.1 },
  { from: 'port-hero-out',   to: 'port-stack-in',   color: '#b400ff', offset: 0.6 },
  { from: 'port-about-out',  to: 'port-builds-in-1', color: '#00e5ff', offset: 0.3 },
  { from: 'port-stack-out',  to: 'port-builds-in-2', color: '#b400ff', offset: 0.8 },
  { from: 'port-builds-out', to: 'port-contact-in',  color: '#ff0055', offset: 0.2 },
]

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let DPR = 1
let particles: Particle[] = []
const mouse: Point = { x: -1000, y: -1000 }

function initCanvas(): void {
  DPR = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = window.innerWidth * DPR
  canvas.height = window.innerHeight * DPR
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

  particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3 - 0.2,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
  }))
}

function repel(x: number, y: number, force = 80): Point {
  const dx = mouse.x - x
  const dy = mouse.y - y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const maxDist = 180
  if (dist < maxDist && dist > 0) {
    const f = Math.pow((maxDist - dist) / maxDist, 2)
    return { x: x - (dx / dist) * f * force, y: y - (dy / dist) * f * force }
  }
  return { x, y }
}

function getBezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
  const cx = 3 * (p1.x - p0.x), bx = 3 * (p2.x - p1.x) - cx, ax = p3.x - p0.x - cx - bx
  const cy = 3 * (p1.y - p0.y), by = 3 * (p2.y - p1.y) - cy, ay = p3.y - p0.y - cy - by
  return {
    x: ax * t ** 3 + bx * t ** 2 + cx * t + p0.x,
    y: ay * t ** 3 + by * t ** 2 + cy * t + p0.y,
  }
}

function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    const pos = repel(p.x, p.y, 30)
    if (p.x < 0) p.x = window.innerWidth
    if (p.x > window.innerWidth) p.x = 0
    if (p.y < 0) p.y = window.innerHeight
    if (p.y > window.innerHeight) p.y = 0
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
    ctx.fill()
  }

  const time = Date.now() / 2500

  for (const conn of CONNECTION_MAP) {
    const el1 = document.getElementById(conn.from)
    const el2 = document.getElementById(conn.to)
    if (!el1 || !el2) continue

    const r1 = el1.getBoundingClientRect()
    const r2 = el2.getBoundingClientRect()
    const sx = r1.left + r1.width / 2, sy = r1.top + r1.height / 2
    const ex = r2.left + r2.width / 2, ey = r2.top + r2.height / 2
    const tension = Math.max(80, Math.abs(ey - sy) * 0.5)
    const cp1 = repel(sx, sy + tension, 100)
    const cp2 = repel(ex, ey - tension, 100)

    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, ex, ey)
    ctx.strokeStyle = conn.color
    ctx.lineWidth = 1.5
    ctx.shadowBlur = 12
    ctx.shadowColor = conn.color
    ctx.globalAlpha = 0.5
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0

    for (let i = 0; i < 3; i++) {
      const t = (time + conn.offset + i * 0.33) % 1
      const pos = getBezierPoint(t, { x: sx, y: sy }, cp1, cp2, { x: ex, y: ey })
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 15
      ctx.shadowColor = conn.color
      ctx.fill()
    }
    ctx.shadowBlur = 0
  }

  requestAnimationFrame(draw)
}

export function initCanvasAnimation(): void {
  canvas = document.getElementById('schematic-canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d')!

  window.addEventListener('resize', initCanvas)
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY }
  }, { passive: true })
  window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000 })
  window.addEventListener('touchend',   () => { mouse.x = -1000; mouse.y = -1000 })

  initCanvas()
  draw()
}
