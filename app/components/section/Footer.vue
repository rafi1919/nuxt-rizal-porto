<script setup lang="ts">
const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Dribbble', href: '#' },
]
</script>

<template>
  <div class="w-full bg-primary overflow-hidden" id="contact">

    <!-- big name -->
    <div class="relative">
     
      <!-- contact cta overlay -->
      <div class="md:px-14 px-4 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div class="max-w-sm">
          <p class="text-[11px] uppercase tracking-[0.16em] text-black/40 mb-3">New Business</p>
          <h3 class="text-2xl font-bold text-black leading-snug mb-4">
            Have a project in mind? Let's build something great.
          </h3>
          <a
            href="mailto:hello@rizzal.com"
            class="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold
                   px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300"
          >
            Get In Touch ↗
          </a>
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-[11px] uppercase tracking-[0.16em] text-black/40 mb-2">Email</p>
          <a href="mailto:hello@rizzal.com"
             class="text-black font-medium text-sm hover:underline transition-all">
            hello@rizzal.com
          </a>
          <p class="text-[11px] uppercase tracking-[0.16em] text-black/40 mt-4 mb-2">Based In</p>
          <span class="text-black font-medium text-sm">Surabaya, Indonesia</span>
        </div>
      </div>

       <h2 class="text-[28vw] text-black font-bold leading-none tracking-tight select-none px-4 pt-8">
        RIZZAL
      </h2>
    </div>

    <!-- bottom bar -->
    <div class="w-full border-t border-black/20 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <span class="text-[11px] text-black/50 tracking-wider">
        © 2026 Rainoutside. All rights reserved.
      </span>

      <!-- nav -->
      <nav class="flex gap-6">
        <a
        
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="text-[11px] uppercase tracking-[0.12em] text-black/60
                 hover:text-black transition-colors duration-200"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- socials -->
      <div class="flex gap-5">
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.href"
          target="_blank"
          class="text-[11px] uppercase tracking-[0.12em] text-black/60
                 hover:text-black transition-colors duration-200"
        >
          {{ social.label }}
        </a>
      </div>
    </div>

  </div>
</template>