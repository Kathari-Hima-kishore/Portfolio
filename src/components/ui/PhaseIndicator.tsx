'use client'

import { useLenis } from 'lenis/react'

interface Phase {
  id: number
  name: string
  title: string
}

interface PhaseIndicatorProps {
  phases: Phase[]
  activePhase: number
}

export function PhaseIndicator({ phases, activePhase }: PhaseIndicatorProps) {
  const lenis = useLenis()

  const scrollToPhase = (phaseId: number) => {
    const element = document.getElementById(`phase-${phaseId}`)
    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: 0, duration: 1.5 })
      } else {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 pointer-events-auto">
      {phases.map((phase) => (
        <button
          key={phase.id}
          onClick={() => scrollToPhase(phase.id)}
          className="group relative flex items-center gap-3"
          aria-label={`Go to ${phase.name}`}
        >
          {/* Phase number indicator */}
          <div
            className={`
              w-3 h-3 rounded-full border-2 transition-all duration-300
              ${activePhase === phase.id
                ? 'bg-white border-white scale-125'
                : 'bg-transparent border-white/40 hover:border-white/80'
              }
            `}
          />

          {/* Phase label (appears on hover) */}
          <div
            className={`
              absolute right-full mr-4 px-3 py-1 rounded-md
              bg-white/10 backdrop-blur-sm border border-white/20
              text-white text-sm font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none
            `}
          >
            {phase.name}
          </div>
        </button>
      ))}
    </div>
  )
}
