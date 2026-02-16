'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SplineBackgroundProps {
  isLoading: boolean
}

export const SplineBackground = memo(function SplineBackground({ isLoading }: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const splineWrapperRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])

  // Spline loaded callback — disable orbit controls only
  const onLoad = useCallback((splineApp: any) => {
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
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{
        willChange: 'opacity',
        backfaceVisibility: 'hidden',
      }}
    >
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
  )
})