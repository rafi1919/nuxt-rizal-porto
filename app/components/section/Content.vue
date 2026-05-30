<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const contentList = [
  { title: "Brand Vision & Alignment" },
  { title: "Art Direction" },
  { title: "Cross-Disciplinary Leadership" },
  { title: "Concept Development" },
  { title: "Design Systems Thinking" },
  { title: "Visual Storytelling" },
  { title: "Stakeholder Collaboration" },
  { title: "Creative Review & Critique" },
]

const preview = ref({ x: 0, y: 0, visible: false, index: -1 })
const mouse = { x: 0, y: 0 }
const cur = { x: 0, y: 0 }
let raf: number

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function animate() {
  cur.x = lerp(cur.x, mouse.x, 0.1)
  cur.y = lerp(cur.y, mouse.y, 0.1)
  preview.value.x = cur.x + 24
  preview.value.y = cur.y - 60
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
  <div class="w-full h-full bg-black text-white">
    <div class="px-4 py-2 flex justify-between items-center border-t border-white/20">
      <span class="text-lg font-bold uppercase">My Expertise</span>
      <span class="text-lg">専門分野</span>
    </div>

    <div class="bg-[#F12E03] w-full h-[70vh]" />

    <div class="w-full grid grid-cols-6 relative p-4">
      <div class="w-full md:col-span-2 col-span-full hidden md:flex sticky top-0 self-start">
        <span class="text-[352px] font-bold -mt-6 leading-tight">02</span>
      </div>

      <div class="w-full h-full md:col-span-4 col-span-6 p-4 flex flex-col gap-4">
        <h2 class="text-[45px] pt-10 font-bold uppercase leading-none tracking-tight">
          Unifying Vision, Strategy, and Execution Into Cohesive Experiences
        </h2>
        <p class="text-[16px] leading-relaxed text-white/40 font-light">
          I provide brand-first creative direction rooted in vision and clarity—uncovering a brand's "why"
          and aligning design, voice, and experience into cohesive systems. I connect the big picture
          across visual, written, audio, and motion to ensure every touchpoint feels intentional.
        </p>

        <div class="h-[100px]" />

        <div class="flex flex-col">
          <div
            v-for="(content, index) in contentList"
            :key="index"
            class="group relative overflow-hidden flex items-center justify-between p-[22px]
                   border-b border-white/20 cursor-none"
            @mouseenter="preview.visible = true; preview.index = index"
            @mouseleave="preview.visible = false"
          >
            <!-- sliding white bg -->
            <span
              class="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0
                     transition-transform duration-300 ease-out"
            />

            <p class="relative z-10 text-[16px] font-semibold text-white
                      group-hover:text-black transition-colors duration-300">
              {{ content.title }}
            </p>
            <span class="relative z-10 text-white group-hover:text-black transition-colors duration-300">
              0{{ index + 1 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- cursor preview -->
    <Teleport to="body">
      <div
        class="fixed pointer-events-none z-[9999] transition-all duration-200"
        :class="preview.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
        :style="{ left: preview.x + 'px', top: preview.y + 'px', rotate: '-2deg' }"
      >
        <div class="w-[220px] bg-[#F12E03] p-6 flex flex-col gap-2">
          <span class="text-[11px] uppercase tracking-[0.16em] text-white/60 font-medium">
            0{{ (preview.index + 1).toString().padStart(2, '0') }}
          </span>
          <p class="text-white font-bold text-[18px] leading-tight">
            {{ contentList[preview.index]?.title }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>