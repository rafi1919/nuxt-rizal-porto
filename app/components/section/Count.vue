<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const countList = [
  { title: "80+", subtitle: "Brands Directed" },
  { title: "15+", subtitle: "Years of Experience" },
  { title: "10+", subtitle: "Awards Won" },
]

const itemRefs = ref<HTMLElement[]>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)

// ── Config ────────────────────────────────────────────────────────────────────
const BG_COLOR       = '#4eb00f'
const DOT_COLOR      = '#1a1008'
const DOT_RADIUS     = 1.4
const DOT_SPACING    = 5
const CLUSTER_COUNT  = 28
const CLUSTER_RADIUS = 80
const CLUSTER_DENSITY = 0.38
const RIPPLE_SPEED    = 50
const RIPPLE_RADIUS   = 55
const RIPPLE_STRENGTH = 0.5

// Flicker config
const FLICKER_SPEED_MIN = 0.4   // seconds for one full fade cycle (fast dots)
const FLICKER_SPEED_MAX = 2.2   // seconds for one full fade cycle (slow dots)
const FLICKER_MIN_ALPHA = 0.0   // how dark/invisible at flicker low
const FLICKER_MAX_ALPHA = 1.0   // how bright at flicker high

// ── Seeded RNG ────────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

interface Ripple { x: number; y: number; age: number }
interface Dot {
  cx: number
  cy: number
  baseAlpha: number
  // flicker: each dot has its own sine wave phase + speed
  flickerPhase: number   // 0–2π offset so they're all out of sync
  flickerSpeed: number   // radians per second
  flickerAmp: number     // how much it flickers (0 = none, 1 = full)
}

let dots: Dot[] = []
let ripples: Ripple[] = []
let raf = 0
let last = 0
let elapsed = 0
let canvasW = 0
let canvasH = 0

function buildDots(W: number, H: number) {
  const rand = mulberry32(42)
  dots = []

  // Build clusters
  const clusters: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < CLUSTER_COUNT; i++) {
    clusters.push({
      x: rand() * W,
      y: rand() * H,
      r: CLUSTER_RADIUS * (0.5 + rand() * 0.8),
    })
  }

  const cols = Math.ceil(W / DOT_SPACING)
  const rows = Math.ceil(H / DOT_SPACING)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * DOT_SPACING + DOT_SPACING / 2
      const cy = row * DOT_SPACING + DOT_SPACING / 2

      let maxInfluence = 0
      for (const cl of clusters) {
        const dx = cx - cl.x
        const dy = cy - cl.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < cl.r) {
          const f = 1 - dist / cl.r
          if (f > maxInfluence) maxInfluence = f
        }
      }

      if (maxInfluence <= 0) continue
      if (rand() >= CLUSTER_DENSITY * maxInfluence) continue

      // Each dot gets a random independent flicker
      const speedRange = (2 * Math.PI) / FLICKER_SPEED_MIN - (2 * Math.PI) / FLICKER_SPEED_MAX
      const flickerSpeed = (2 * Math.PI) / FLICKER_SPEED_MAX + rand() * speedRange

      dots.push({
        cx,
        cy,
        baseAlpha: 0.55 + maxInfluence * 0.45,
        flickerPhase: rand() * Math.PI * 2,   // random start in cycle
        flickerSpeed,
        flickerAmp: 0.5 + rand() * 0.5,       // some dots flicker more than others
      })
    }
  }
}

function drawFrame() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvasW, canvasH)

  ctx.fillStyle = DOT_COLOR

  for (const d of dots) {
    // Sine flicker: oscillates between (1-amp) and 1
    const sineVal = Math.sin(elapsed * d.flickerSpeed + d.flickerPhase) * 0.5 + 0.5
    const flickerMod = (1 - d.flickerAmp) + d.flickerAmp * sineVal
    let alpha = d.baseAlpha * flickerMod

    // Ripple boost on top
    for (const rip of ripples) {
      const dx = d.cx - rip.x
      const dy = d.cy - rip.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const waveFront = rip.age * RIPPLE_SPEED
      const diff = Math.abs(dist - waveFront)
      if (diff < RIPPLE_RADIUS) {
        const falloff = 1 - diff / RIPPLE_RADIUS
        alpha += Math.sin(falloff * Math.PI) * falloff * RIPPLE_STRENGTH
      }
    }

    ctx.globalAlpha = Math.max(FLICKER_MIN_ALPHA, Math.min(FLICKER_MAX_ALPHA, alpha))
    ctx.beginPath()
    ctx.arc(d.cx, d.cy, DOT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

function loop(ts: number) {
  const dt = (ts - last) / 1000
  last = ts
  elapsed += dt
  for (const r of ripples) r.age += dt
  ripples = ripples.filter(r => r.age < 5)
  drawFrame()
  raf = requestAnimationFrame(loop)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement!
  canvasW = canvas.width  = parent.offsetWidth
  canvasH = canvas.height = parent.offsetHeight
  buildDots(canvasW, canvasH)
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (ripples.length < 20) ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, age: 0 })
}

onMounted(() => {
  resizeCanvas()
  raf = requestAnimationFrame(loop)
  window.addEventListener('resize', resizeCanvas)

  itemRefs.value.forEach((el, index) => {
    const fromX = index % 2 === 0 ? -100 : 100
    const toX   = index % 2 === 0 ?  100 : -100
    gsap.fromTo(el,
      { opacity: 0, x: fromX },
      {
        opacity: 1, x: toX, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: 1 },
      }
    )
  })
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resizeCanvas)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div
    class="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center md:px-14 px-4 py-16"
    @mousemove="onMouseMove"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />

    <div class="md:relative hidden z-10 w-full max-w-4xl ">
      <div
        v-for="(value, index) in countList"
        :key="index"
        :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
        class="w-full flex justify-between items-center border-b border-black/10 py-4"
      >
        <h2 class="uppercase text-[clamp(60px,12vw,150px)] font-bold text-[#121213] leading-none">
          {{ value.title }}
        </h2>
        <h2 class="uppercase text-[clamp(18px,3vw,43px)] text-[#121213]">
          {{ value.subtitle }}
        </h2>
      </div>
    </div>

     <div class="md:hidden flex flex-col z-10 w-full max-w-4xl ">
      <div
        v-for="(value, index) in countList"
        :key="index"
        class="w-full flex flex-col justify-between items-start gap-4 border-b border-black/10 py-4"
      >
        <h2 class="uppercase text-[clamp(60px,12vw,150px)] font-bold text-[#121213] leading-none">
          {{ value.title }}
        </h2>
        <h2 class="uppercase text-[32px] text-[#121213]">
          {{ value.subtitle }}
        </h2>
      </div>
    </div>
  </div>
</template>