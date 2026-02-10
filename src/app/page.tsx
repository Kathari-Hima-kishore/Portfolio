'use client'

import { SplineBackground } from '@/components/SplineBackground'
import { Loader } from '@/components/ui/Loader'
import { PhaseIndicator } from '@/components/ui/PhaseIndicator'
import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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
  const hasAutoScrolledRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Phase detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = phases.map(phase =>
        document.getElementById(`phase-${phase.id}`)
      )
      const scrollPosition = window.scrollY + window.innerHeight / 2
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActivePhase(i + 1)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll: snap between Phase 1 and Phase 2 only
  useEffect(() => {
    if (isLoading) return

    const combinedHandler = (e: WheelEvent) => {
      // Only intercept scrolling when in Phase 1 or at the very top of Phase 2
      const phase1 = document.getElementById('phase-1')
      const phase2 = document.getElementById('phase-2')
      if (!phase1 || !phase2) return

      const phase2Top = phase2.offsetTop

      // Auto-scroll down: Phase 1 → Phase 2
      if (window.scrollY < phase1.offsetHeight * 0.3 && e.deltaY > 0 && !isAutoScrollingRef.current) {
        e.preventDefault()
        isAutoScrollingRef.current = true
        gsap.to(window, {
          scrollTo: { y: phase2, autoKill: false },
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => { isAutoScrollingRef.current = false },
        })
        return
      }

      // Auto-scroll up: Phase 2 top → Phase 1
      if (window.scrollY >= phase2Top - 10 && window.scrollY <= phase2Top + 50 && e.deltaY < 0 && !isAutoScrollingRef.current) {
        e.preventDefault()
        isAutoScrollingRef.current = true
        gsap.to(window, {
          scrollTo: { y: 0, autoKill: false },
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => { isAutoScrollingRef.current = false },
        })
        return
      }

      // Block scroll during auto-scroll animation
      if (isAutoScrollingRef.current) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', combinedHandler, { passive: false })
    return () => window.removeEventListener('wheel', combinedHandler)
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
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight mb-6">
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
            <h2 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
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
              <h2 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
                {phase.title}
              </h2>
              <p className="text-2xl text-white/80 drop-shadow">
                {phase.name}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}