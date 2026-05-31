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

onMounted(() => {
  itemRefs.value.forEach((el, index) => {
    const fromX = index % 2 === 0 ? -100 : 100
    const toX = index % 2 === 0 ? 100 : -100

    gsap.fromTo(el,
      { opacity: 0, x: fromX },
      {
        opacity: 1,
        x: toX,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,        // ← ties animation to scroll position, reverses on scroll back
          // toggleActions: 'play reverse play reverse' ← use this instead if you don't want scrub
        }
      }
    )
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div class="w-full min-h-screen bg-primary text-white flex flex-col items-center justify-center md:px-14 px-4 py-16">
    <div
      v-for="(value, index) in countList"
      :key="index"
      :ref="el => { if (el) itemRefs[index] = el as HTMLElement }"
      class="max-w-4xl w-full flex justify-between items-center border-b border-black/10 py-4"
    >
      <h2 class="uppercase text-[clamp(60px,12vw,150px)] font-bold text-[#121213] leading-none">
        {{ value.title }}
      </h2>
      <h2 class="uppercase text-[clamp(18px,3vw,43px)] text-[#121213]">
        {{ value.subtitle }}
      </h2>
    </div>
  </div>
</template>