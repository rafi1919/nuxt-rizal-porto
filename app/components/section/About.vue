<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const projects = [
  { title: 'Armada', tag: 'Branding', image: '/images/armada.jpg' },
  { title: 'Wild Flower', tag: 'Branding', image: '/images/wildflower.jpg' },
  { title: 'Zenith VR', tag: 'Web Design', image: '/images/zenith.jpg' },
  { title: 'Mayfield', tag: 'Branding', image: '/images/mayfield.jpg' },
  { title: 'Eden Exotics', tag: 'Graphic Design', image: '/images/eden.jpg' },
  { title: 'OSO', tag: 'Branding', image: '/images/oso.jpg' },
]

const preview = ref({ x: 0, y: 0, visible: false, index: -1 })
const mouse = { x: 0, y: 0 }
const cur = { x: 0, y: 0 }
let raf: number

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function animate() {
  cur.x = lerp(cur.x, mouse.x, 0.1)
  cur.y = lerp(cur.y, mouse.y, 0.1)
  preview.value.x = cur.x + 20
  preview.value.y = cur.y - 80
  raf = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  animate()
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
    <div class="bg-black w-full min-h-screen text-white md:p-14 p-4 flex flex-col gap-8">

        <div class="flex justify-between items-top">
            <span class="uppercase">
                Featured work
            </span>

            <span class="uppercase text-[45px] font-bold leading-none tracking-tight w-[600px]">
                Selected Work Shaping Brands, Products, and Experiences
            </span>
            
        </div>
        <div class="w-full h-[70vh] bg-white rounded-lg" >

        </div>

        <div class="border-t border-white/10 ">
        <div
            v-for="(project, index) in projects"
            :key="index"
            class="group flex items-center justify-between py-5 border-b border-white/[0.08]
                cursor-none transition-all duration-250 hover:pl-3"
            @mouseenter="preview.visible = true; preview.index = index"
            @mouseleave="preview.visible = false"
        >
            <div class="flex items-center gap-5">
            <span class="text-[11px] tabular-nums text-white/20 group-hover:text-primary-200 transition-colors duration-250">
                0{{ index + 1 }}
            </span>
            <span class="text-xl font-semibold text-white/50 group-hover:text-white transition-colors duration-250 tracking-tight">
                {{ project.title }}
            </span>
            </div>
            <div class="flex items-center gap-4">
            <span class="text-[10px] uppercase tracking-[0.1em] text-white/20 border border-white/10
                        px-3 py-1 rounded-full group-hover:text-white/50 group-hover:border-white/25 transition-all duration-250">
                {{ project.tag }}
            </span>
            <span class="text-lg text-white/15 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-250">
                ↗
            </span>
            </div>
        </div>
        </div>

        <!-- cursor image preview -->
        <Teleport to="body">
        <div
            class="fixed pointer-events-none z-[9999] w-[280px] h-[180px] rounded-md overflow-hidden transition-all duration-200"
            :class="preview.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
            :style="{ left: preview.x + 'px', top: preview.y + 'px', rotate: '-1deg' }"
        >
            <img
            v-if="projects[preview.index]"
            :src="projects[preview.index].image"
            class="w-full h-full object-cover"
            />
        </div>
        </Teleport>
  </div>
</template>