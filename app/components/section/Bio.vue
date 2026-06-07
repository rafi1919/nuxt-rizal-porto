<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wordRef = ref<HTMLElement | null>(null)

const text =
  "I'm a software engineer with a passion for building scalable and efficient applications. With over 5 years of experience in the industry, I have worked on a variety of projects ranging from web development to mobile applications. I enjoy learning new technologies and am always looking for ways to improve my skills. In my free time, I like to contribute to open source projects and explore the latest trends in software development."

const words = text.split(' ')

onMounted(() => {
  const wordElements = wordRef.value?.querySelectorAll('.word')

  if (!wordElements?.length) return

  gsap.set(wordElements, {
    opacity: 0.15,
    filter: 'blur(10px)',
    y: 12,
  })

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      gsap.to(wordElements, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wordRef.value,
          start: 'top 80%',
          once: true,
        },
      })
    },

    '(max-width: 767px)': () => {
      gsap.to(wordElements, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.7,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wordRef.value,
          start: 'top 90%',
          once: true,
        },
      })
    },
  })
})
</script>

<template>
  <div class="bg-black w-full min-h-screen text-white md:p-14 p-4 flex flex-col gap-8">
    <div class="w-full flex flex-col gap-4 justify-center items-center max-w-2xl mx-auto">
      <div
        class="max-w-md w-full aspect-[4/5] bg-white/10 rounded-md"
      />

      <h4
        ref="wordRef"
        class="md:text-[32px] text-[22px] leading-tight font-medium"
      >
        <span
          v-for="(word, index) in words"
          :key="index"
          class="word inline-block mr-2 will-change-transform"
        >
          {{ word }}
        </span>
      </h4>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Voluptatum a ut quasi fuga optio eaque officia, ipsam,
        non ipsa deleniti voluptatibus provident labore consectetur.
        Voluptatum ex nemo eligendi ipsa dolore!
      </p>
    </div>
  </div>
</template>