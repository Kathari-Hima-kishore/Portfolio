'use client'

import { SplineBackground } from '@/components/SplineBackground'
import { Loader } from '@/components/ui/Loader'
import { PhaseIndicator } from '@/components/ui/PhaseIndicator'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const phases = [
  { id: 1, name: 'Phase 1', title: 'Initialization' },
  { id: 2, name: 'Phase 2', title: 'Exploration' },
  { id: 3, name: 'Phase 3', title: 'Development' },
  { id: 4, name: 'Phase 4', title: 'Integration' },
  { id: 5, name: 'Phase 5', title: 'Optimization' },
  { id: 6, name: 'Phase 6', title: 'Deployment' },
  { id: 7, name: 'Phase 7', title: 'Completion' },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState(1)
  const isAutoScrollingRef = useRef(false)
  const sectionsRef = useRef<HTMLElement[]>([])

  // Cache section DOM references once after mount
  useEffect(() => {
    sectionsRef.current = phases
      .map(p => document.getElementById(`phase-${p.id}`))
      .filter(Boolean) as HTMLElement[]
  }, [isLoading])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll: snap between all phases on every wheel tick
  useEffect(() => {
    if (isLoading) return

    const snapHandler = (e: WheelEvent) => {
      e.preventDefault()

      if (isAutoScrollingRef.current) return

      const sections = sectionsRef.current
      if (sections.length === 0) return

      const scrollY = window.scrollY

      // Find the nearest section by smallest distance
      let currentIndex = 0
      let minDist = Infinity
      for (let i = 0; i < sections.length; i++) {
        const dist = Math.abs(scrollY - sections[i].offsetTop)
        if (dist < minDist) {
          minDist = dist
          currentIndex = i
        }
      }

      const scrollingDown = e.deltaY > 0
      const targetIndex = scrollingDown ? currentIndex + 1 : currentIndex - 1

      if (targetIndex < 0 || targetIndex >= sections.length) return

      isAutoScrollingRef.current = true
      setActivePhase(targetIndex + 1)
      gsap.to(window, {
        scrollTo: { y: sections[targetIndex], autoKill: false },
        duration: 0.4,
        ease: 'power2.out',
      })
      // Release lock after a fixed cooldown, independent of GSAP
      setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 600)
    }

    // Use capture phase so this fires BEFORE any child element handlers
    document.addEventListener('wheel', snapHandler, { passive: false, capture: true })
    return () => document.removeEventListener('wheel', snapHandler, { capture: true })
  }, [isLoading])

  return (
    <main className="relative">
      {isLoading && <Loader />}

      <SplineBackground isLoading={isLoading} />

      <PhaseIndicator phases={phases} activePhase={activePhase} />

      <div className="relative z-10 canvas-overlay-mode">
        {/* Phase 1: Split layout — left text, right 3D object */}
        <section
          id="phase-1"
          className="min-h-screen flex items-center p-8"
        >
          <div className="w-1/2 flex flex-col justify-center pl-8 md:pl-16 lg:pl-24">
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Phase 1
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Initialization
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-md leading-relaxed">
              Welcome to the experience. Scroll to explore every dimension of design and development.
            </p>
            <div className="mt-8 flex items-center gap-2 text-white/40">
              <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
                <div className="w-1 h-2 bg-white/60 rounded-full animate-scrollPulse" />
              </div>
              <span className="text-sm tracking-wider uppercase">Scroll down</span>
            </div>
          </div>
          {/* Right side is empty — the Spline 3D object shows through here */}
          <div className="w-1/2" />
        </section>

        {/* Phase 2: Full viewport — 3D object takes over, text top-left */}
        <section
          id="phase-2"
          className="min-h-screen flex items-start p-8 pt-16 relative"
        >
          <div className="z-10 pl-8 md:pl-16 lg:pl-24">
            <p className="text-accent text-sm tracking-[0.3em] uppercase mb-3 font-medium">
              Phase 2
            </p>
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Exploration
            </h2>
          </div>
        </section>

        {/* Phases 3-7 */}
        {phases.slice(2).map((phase) => (
          <section
            key={phase.id}
            id={`phase-${phase.id}`}
            className="min-h-screen flex items-center justify-center p-8"
          >
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-4 text-white">
                {phase.title}
              </h2>
              <p className="text-2xl text-white/80">
                {phase.name}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}