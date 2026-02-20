'use client'

import SmoothScroll from '@/components/SmoothScroll'

import { Loader } from '@/components/ui/Loader'
import { PhaseIndicator } from '@/components/ui/PhaseIndicator'
import { useState, useEffect, useRef } from 'react'
import { logEvent } from '@/lib/firebase'

import dynamic from 'next/dynamic'

// Lazy Load Section Components
const HeroSection = dynamic(() => import('@/components/sections/HeroSection').then(mod => mod.HeroSection))
const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection').then(mod => mod.SkillsSection))
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection').then(mod => mod.ExperienceSection))
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection').then(mod => mod.ProjectsSection))
const ProjectsMoreSection = dynamic(() => import('@/components/sections/ProjectsMoreSection').then(mod => mod.ProjectsMoreSection))
const EducationSection = dynamic(() => import('@/components/sections/EducationSection').then(mod => mod.EducationSection))
const ContactSection = dynamic(() => import('@/components/sections/ContactSection').then(mod => mod.ContactSection))
const StarryBackground = dynamic(() => import('@/components/StarryBackground').then(mod => mod.StarryBackground), { ssr: false })
const SplineBackground = dynamic(() => import('@/components/SplineBackground').then(mod => mod.SplineBackground), { ssr: false })

const PHASES = [
  { id: 1, name: 'Introduction', title: 'Welcome' },
  { id: 2, name: 'Skills', title: 'Technical Arsenal' },
  { id: 3, name: 'Experience', title: 'Professional Journey' },
  { id: 4, name: 'Featured Project', title: 'Event Management System' },
  { id: 5, name: 'More Projects', title: 'Additional Work' },
  { id: 6, name: 'Education', title: 'Academic Background' },
  { id: 7, name: 'Contact', title: 'Let\'s Connect' },
] as const

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activePhase, setActivePhase] = useState(1)

  // Initial load timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Optimize: Use IntersectionObserver instead of scroll listener
  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phaseId = parseInt(entry.target.id.replace('phase-', ''), 10)
            if (!isNaN(phaseId)) {
              setActivePhase(phaseId)
              // Track which section the user scrolled into
              const phase = PHASES.find(p => p.id === phaseId)
              if (phase) {
                logEvent('section_view', {
                  section_id: phaseId,
                  section_name: phase.name,
                })
              }
            }
          }
        })
      },
      {
        root: null, // viewport
        rootMargin: '-20% 0px -20% 0px', // Shrink the detection area to avoid early triggers
        threshold: 0.4, // Trigger when 40% visible within the rootMargin
      }
    )

    // Observe all phase sections
    PHASES.forEach((phase) => {
      const element = document.getElementById(`phase-${phase.id}`)
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [isLoading])

  return (
    <SmoothScroll>
      {isLoading && <Loader />}

      {/* Spline background is memoized internally */}
      <SplineBackground isLoading={isLoading} activePhase={activePhase} />

      <PhaseIndicator phases={PHASES as any} activePhase={activePhase} />

      <StarryBackground />

      <main className="relative z-10 canvas-overlay-mode flex flex-col gap-48 md:gap-72 pb-48">
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ProjectsMoreSection />
        <EducationSection />
        <ContactSection />
      </main>
    </SmoothScroll>
  )
}