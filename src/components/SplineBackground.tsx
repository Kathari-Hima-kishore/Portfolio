'use client'

import { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SplineBackgroundProps {
  isLoading: boolean
}

export function SplineBackground({ isLoading }: SplineBackgroundProps) {
  const [app, setApp] = useState<any>(null)
  const [mainObject, setMainObject] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const splineWrapperRef = useRef<HTMLDivElement>(null)
  const baseTransformRef = useRef<{
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  } | null>(null)

  const readValue = (value: any): number => {
    if (typeof value === 'number') return value
    if (value?._value !== undefined) return value._value
    if (value?.value !== undefined) return value.value
    return 0
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  const onLoad = (splineApp: any) => {
    const controls = splineApp._orbitControls || splineApp._controls
    if (controls) {
      controls.enableZoom = false
      controls.enablePan = false
      controls.enableRotate = false
      if (controls.update) controls.update()
    }

    setApp(splineApp)

    const allObjects = splineApp.getAllObjects()
    let foundObject = null

    try {
      foundObject = splineApp.findObjectByName('mething')
    } catch (e) {}

    if (!foundObject) {
      const skipNameParts = [
        'camera', 'light', 'directional', 'ambient', 'spot', 'point',
        'helper', 'target', 'rig', 'orbit', 'null', 'empty', 'rectangle', 'text'
      ]
      const candidates = allObjects.filter((obj: any) => {
        if (!obj || !obj.name) return false
        const name = String(obj.name).toLowerCase()
        if (skipNameParts.some(part => name.includes(part))) return false
        if (!obj.position || !obj.rotation || !obj.scale) return false
        return true
      })
      if (candidates.length > 0) foundObject = candidates[0]
    }

    if (!foundObject) return

    baseTransformRef.current = {
      position: {
        x: readValue(foundObject.position.x),
        y: readValue(foundObject.position.y),
        z: readValue(foundObject.position.z),
      },
      rotation: {
        x: readValue(foundObject.rotation._x ?? foundObject.rotation.x),
        y: readValue(foundObject.rotation._y ?? foundObject.rotation.y),
        z: readValue(foundObject.rotation._z ?? foundObject.rotation.z),
      },
      scale: {
        x: readValue(foundObject.scale.x),
        y: readValue(foundObject.scale.y),
        z: readValue(foundObject.scale.z),
      },
    }
    setMainObject(foundObject)
  }

  // Animate the Spline wrapper: fade in, shift, scale, fade out
  useEffect(() => {
    if (!mainObject || isLoading || !containerRef.current || !splineWrapperRef.current) return

    const container = containerRef.current
    const splineWrapper = splineWrapperRef.current

    // --- Phase 1: Fade in on load ---
    gsap.fromTo(splineWrapper, {
      opacity: 0,
      scale: 0.6,
      x: '25%',
    }, {
      opacity: 1,
      scale: 0.65,
      x: '25%',
      duration: 1.8,
      ease: 'power2.out',
      delay: 0.3,
    })

    // --- Phase 1: Idle floating animation (only while in Phase 1) ---
    const idleFloat = gsap.to(splineWrapper, {
      y: '-12px',
      rotation: 1.5,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2,
    })

    // Kill idle animation when leaving Phase 1
    ScrollTrigger.create({
      trigger: '#phase-1',
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        idleFloat.kill()
        gsap.set(splineWrapper, { y: 0, rotation: 0 })
      },
      onEnterBack: () => {
        // Restart idle when scrolling back to Phase 1
        gsap.set(splineWrapper, { y: 0, rotation: 0 })
        idleFloat.restart()
      },
    })

    // --- Phase 1 → Phase 2: Scale up + center (scrub) ---
    ScrollTrigger.create({
      trigger: '#phase-2',
      start: 'top 85%',
      end: 'top 25%',
      scrub: 0.8,
      animation: gsap.fromTo(splineWrapper, {
        scale: 0.65,
        x: '25%',
      }, {
        scale: 1,
        x: '0%',
        ease: 'none',
      }),
    })

    // --- Phase 2 → Phase 3: Fade out the entire container (object + black bg) ---
    ScrollTrigger.create({
      trigger: '#phase-3',
      start: 'top 95%',
      end: 'top 30%',
      scrub: 1.2,
      animation: gsap.to(container, {
        opacity: 0,
        ease: 'none',
      }),
    })

    // When scrolling back up into Phase 2 from Phase 3, fade container back in
    ScrollTrigger.create({
      trigger: '#phase-2',
      start: 'bottom 90%',
      end: 'bottom bottom',
      onEnterBack: () => {
        gsap.to(container, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        })
      },
    })

    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [mainObject, isLoading, app])

  if (isLoading) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
    >
      <div
        ref={splineWrapperRef}
        className="w-full h-full"
        style={{
          opacity: 0,
          transform: 'scale(0.6) translateX(25%)',
          transformOrigin: 'center center',
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
}