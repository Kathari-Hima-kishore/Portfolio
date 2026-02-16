'use client'

import SmoothScroll from '@/components/SmoothScroll'
import { SplineBackground } from '@/components/SplineBackground'
import { Loader } from '@/components/ui/Loader'
import { PhaseIndicator } from '@/components/ui/PhaseIndicator'
import { useState, useEffect, useCallback, useMemo } from 'react'

const PHASES = [
  { id: 1, name: 'Phase 1', title: 'Initialization' },
  { id: 2, name: 'Phase 2', title: 'Exploration' },
  { id: 3, name: 'Phase 3', title: 'Development' },
  { id: 4, name: 'Phase 4', title: 'Integration' },
  { id: 5, name: 'Phase 5', title: 'Optimization' },
  { id: 6, name: 'Phase 6', title: 'Deployment' },
  { id: 7, name: 'Phase 7', title: 'Completion' },
] as const

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState(1)

  // Initial load timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Detect which phase section is most visible
  const updatePhase = useCallback(() => {
    const center = window.innerHeight / 2

    for (let i = PHASES.length; i >= 1; i--) {
      const el = document.getElementById(`phase-${i}`)
      if (el && el.getBoundingClientRect().top <= center) {
        setActivePhase(i)
        return
      }
    }
    setActivePhase(1)
  }, [])

  // Throttled scroll tracking
  useEffect(() => {
    if (isLoading) return

    let raf = 0

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          updatePhase()
          raf = 0
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updatePhase()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isLoading, updatePhase])

  const phaseSections = useMemo(() => PHASES.slice(2), [])

  return (
    <SmoothScroll>
      {isLoading && <Loader />}

      {activePhase <= 2 && <SplineBackground isLoading={isLoading} />}

      <PhaseIndicator phases={PHASES as any} activePhase={activePhase} />

      <main className="relative z-10 canvas-overlay-mode">
        {/* Phase 1: Split layout — left text, right 3D object */}
        <section
          id="phase-1"
          className="h-[75vh] flex items-center p-8"
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
          className="h-[75vh] flex items-start p-8 pt-16 relative"
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
        {phaseSections.map((phase) => (
          <section
            key={phase.id}
            id={`phase-${phase.id}`}
            className="h-[75vh] flex items-center justify-center p-8"
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
      </main>
    </SmoothScroll>
  )
}