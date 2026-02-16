'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplineBackgroundProps {
  isLoading: boolean
  activePhase: number
}

export const SplineBackground = memo(function SplineBackground({ isLoading, activePhase }: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const splineInstanceRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const splineWrapperRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Audio initialization logic
  const initAudio = useCallback(() => {
    // 1. Resume global context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContext) {
      new AudioContext().resume().catch(() => { })
    }

    // 2. Resume Spline's specific context via runtime
    const app = splineInstanceRef.current
    if (app) {
      // Try to find the runtime
      // Spline react-spline often exposes the application instance which has .runtime or ._runtime
      // or sometimes the app IS the runtime wrapper.
      const runtime = app.runtime || app._runtime || app

      if (runtime) {
        if (runtime.audioContext) runtime.audioContext.resume();
        if (runtime.context) runtime.context.resume();

        // Try to resume all sounds if exposed
        if (runtime.sounds) {
          Object.values(runtime.sounds).forEach((sound: any) => {
            if (sound && sound.context) sound.context.resume();
            if (sound && sound.source && sound.source.context) sound.source.context.resume();
          });
        }
      }
    }

    setAudioEnabled(true)
  }, [])

  // Attach listeners to container for immediate interaction capture
  // We use onMouseEnter to trigger as soon as mouse moves over the window
  const handleInteraction = useCallback(() => {
    initAudio()
  }, [initAudio])

  // Also global listeners just in case
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'wheel']
    const handler = () => initAudio()
    events.forEach(e => window.addEventListener(e, handler, { once: true, passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, handler))
  }, [initAudio])

  // Spline loaded callback. disable orbit controls only
  const onLoad = useCallback((splineApp: any) => {
    splineInstanceRef.current = splineApp
    try {
      // Disable orbit controls (zoom, pan, rotate via drag)
      const controls = splineApp?._orbitControls || splineApp?._controls
      if (controls) {
        controls.enableZoom = false
        controls.enablePan = false
        controls.enableRotate = false
        controls.enableDamping = false
        controls.update?.()
      }

      // Prevent canvas from stealing tab-focus
      const canvas = splineApp?.renderer?.domElement as HTMLCanvasElement | undefined
      if (canvas) {
        canvas.setAttribute('tabindex', '-1')
        canvas.style.outline = 'none'
      }
    } catch (err) {
      console.error('Error configuring Spline:', err)
    }

    setIsLoaded(true)
  }, [])

  // GSAP scroll-linked animations
  useEffect(() => {
    if (!isLoaded || isLoading || !containerRef.current || !splineWrapperRef.current) return

    const container = containerRef.current
    const wrapper = splineWrapperRef.current

    // Kill any prior triggers
    triggersRef.current.forEach((t) => t.kill())
    triggersRef.current = []

    // Phase 1: entrance animation
    gsap.fromTo(
      wrapper,
      { opacity: 0, scale: 0.6, x: '25%' },
      { opacity: 1, scale: 0.65, x: '25%', duration: 1.2, ease: 'power1.out', delay: 0.2 },
    )

    // Phase 1: idle float
    const idleFloat = gsap.to(wrapper, {
      y: '-10px',
      rotation: 1,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.5,
    })

    // Kill float when leaving Phase 1
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-1',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => {
          idleFloat.kill()
          gsap.set(wrapper, { y: 0, rotation: 0 })
        },
        onEnterBack: () => {
          gsap.set(wrapper, { y: 0, rotation: 0 })
          idleFloat.restart()
        },
      }),
    )

    // Phase 1 → 2: scale up + center
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-2',
        start: 'top bottom',
        end: 'top center',
        scrub: 0.3,
        animation: gsap.fromTo(
          wrapper,
          { scale: 0.65, x: '25%' },
          { scale: 1, x: '0%', ease: 'power1.out' },
        ),
      }),
    )

    // Phase 2 → 3: fade out + hide
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-3',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 0.3,
        animation: gsap.to(container, { opacity: 0, ease: 'power1.out' }),
        onLeave: () => {
          container.style.visibility = 'hidden'
        },
        onEnterBack: () => {
          container.style.visibility = 'visible'
        },
      }),
    )

    return () => {
      idleFloat.kill()
      triggersRef.current.forEach((t) => t.kill())
      triggersRef.current = []
    }
  }, [isLoaded, isLoading])

  if (isLoading) return null

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0"
        onMouseEnter={handleInteraction}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        style={{
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
          // Disable mouse interaction in Phase 1 (Hero), enable in others (Skills, etc)
          pointerEvents: activePhase === 1 ? 'none' : 'auto'
        }}
      >

        {!audioEnabled && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleInteraction();
            }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer transition-opacity duration-500 hover:bg-black/70"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">Click to Start</p>
              <p className="text-white/50 text-sm">Enable immersive audio experience</p>
            </div>
          </div>
        )}
        <div
          ref={splineWrapperRef}
          className="w-full h-full"
          style={{
            opacity: 0,
            transform: 'scale(0.6) translateX(25%)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        >
          <Spline
            scene="/mething_copy.spline"
            onLoad={onLoad}
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  )
})