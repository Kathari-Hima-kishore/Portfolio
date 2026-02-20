'use client'

import { useEffect, useRef, useState, useCallback, memo, Suspense } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { getPerformanceTier } from '@/lib/performance'

gsap.registerPlugin(ScrollTrigger)

if (typeof window !== 'undefined') {
  // Aggressively suppress the harmless but annoying OpenType warning from Spline/opentype.js
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    const msg = args.map(a => (typeof a === 'object' && a?.message ? a.message : String(a))).join(' ')
    if (msg.includes('Unsupported OpenType signature PK')) return;
    originalConsoleError(...args);
  };

  const silenceNextJsErrorOverlay = (e: ErrorEvent | PromiseRejectionEvent) => {
    const msg = 'message' in e ? e.message : (e.reason?.message || String(e.reason));
    if (msg?.includes('Unsupported OpenType signature PK')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };

  window.addEventListener('error', silenceNextJsErrorOverlay, true);
  window.addEventListener('unhandledrejection', silenceNextJsErrorOverlay, true);
}

interface SplineBackgroundProps {
  isLoading: boolean
  activePhase: number
}


export const SplineBackground = memo(function SplineBackground({
  isLoading,
  activePhase,
}: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [tier] = useState(() => getPerformanceTier())
  const splineInstanceRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const splineWrapperRef = useRef<HTMLDivElement>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const isManuallyMuted = useRef(true)

  // ...Hooks must all be declared before any early returns...

  // ── Audio init ──────────────────────────────────────────────────────────
  const initAudio = useCallback(async () => {
    let success = false
    const audioContexts = (window as any)._audioContexts || []

    if (audioContexts.length > 0) {
      await Promise.all(
        audioContexts.map(async (ctx: AudioContext) => {
          try {
            if (ctx.state !== 'closed') {
              await ctx.resume()
              if (ctx.state === 'running') success = true
            }
          } catch { }
        })
      )
    } else {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (AC) {
        try {
          const ctx = new AC()
          await ctx.resume()
          success = true
        } catch (e) {
          console.warn('Audio init failed', e)
        }
      }
    }

    const app = splineInstanceRef.current
    if (app) {
      const runtime = app.runtime || app._runtime || app
      if (runtime?.audioContext) {
        try {
          if (runtime.audioContext.state !== 'closed') {
            await runtime.audioContext.resume()
          }
        } catch { }
      }
    }

    if (success) setAudioEnabled(true)
  }, [])

  const handleInteraction = useCallback(() => {
    if (!audioEnabled && !isManuallyMuted.current) initAudio()
  }, [initAudio, audioEnabled])

  // One-shot global interaction listeners
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'wheel'] as const
    const handler = () => {
      if (!audioEnabled && !isManuallyMuted.current) initAudio()
    }
    events.forEach(e => window.addEventListener(e, handler, { once: true, passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, handler))
  }, [initAudio, audioEnabled])

  // Mute enforcement — only run when audio is supposed to be OFF
  // Use 500ms interval instead of 200ms to halve CPU burn
  useEffect(() => {
    if (audioEnabled) return
    const interval = setInterval(() => {
      const ctxs: AudioContext[] = (window as any)._audioContexts || []
      for (const ctx of ctxs) {
        if (ctx.state === 'running') ctx.suspend().catch(() => { })
      }
    }, 500)
    return () => clearInterval(interval)
  }, [audioEnabled])

  // Spline onLoad
  const onLoad = useCallback((splineApp: any) => {
    splineInstanceRef.current = splineApp
    try {
      // Reduce pixel ratio for medium tier — halves WebGL fill rate
      const renderer = splineApp?.renderer
      if (renderer && tier === 'medium') {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
      }

      // Disable costly orbit controls
      const controls = splineApp?._orbitControls || splineApp?._controls
      if (controls) {
        controls.enableZoom = false
        controls.enablePan = false
        controls.enableRotate = false
        controls.enableDamping = false
        controls.update?.()
      }

      // Stop canvas from stealing focus
      const canvas = renderer?.domElement as HTMLCanvasElement | undefined
      if (canvas) {
        canvas.setAttribute('tabindex', '-1')
        canvas.style.outline = 'none'
      }
    } catch (err) {
      console.error('Spline config error:', err)
    }
    setIsLoaded(true)
  }, [tier])

  // ── GSAP scroll animations ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || isLoading || !containerRef.current || !splineWrapperRef.current) return

    const container = containerRef.current
    const wrapper = splineWrapperRef.current

    triggersRef.current.forEach(t => t.kill())
    triggersRef.current = []

    // Phase 1 entrance
    gsap.fromTo(
      wrapper,
      { opacity: 0, scale: 0.6, x: '25%' },
      { opacity: 1, scale: 0.65, x: '25%', duration: 1.2, ease: 'power1.out', delay: 0.2 },
    )

    // Idle float — simpler on medium (no rotation to save compositor work)
    const idleFloat = gsap.to(wrapper, {
      y: '-10px',
      rotation: tier === 'high' ? 1 : 0,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 1.5,
      // lazy:true defers until next tick — avoids layout thrash
      lazy: true,
    })

    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-1',
        start: 'top top',
        end: 'bottom top',
        onLeave: () => { idleFloat.kill(); gsap.set(wrapper, { y: 0, rotation: 0 }) },
        onEnterBack: () => { gsap.set(wrapper, { y: 0, rotation: 0 }); idleFloat.restart() },
      }),
    )

    // Phase 1→2 scrub — increase scrub value slightly to smooth out on weak CPUs
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-2',
        start: 'top bottom',
        end: 'top center',
        scrub: tier === 'high' ? 0.3 : 0.6,
        animation: gsap.fromTo(
          wrapper,
          { scale: 0.65, x: '25%' },
          { scale: 1, x: '0%', ease: 'power1.out' },
        ),
      }),
    )

    // Phase 2→3 fade
    triggersRef.current.push(
      ScrollTrigger.create({
        trigger: '#phase-3',
        start: 'top 80%',
        end: 'top 50%',
        scrub: tier === 'high' ? 0.3 : 0.6,
        animation: gsap.to(container, { opacity: 0, ease: 'power1.out' }),
        onLeave: () => { container.style.visibility = 'hidden' },
        onEnterBack: () => { container.style.visibility = 'visible' },
      }),
    )

    return () => {
      idleFloat.kill()
      triggersRef.current.forEach(t => t.kill())
      triggersRef.current = []
    }
  }, [isLoaded, isLoading, tier])

  if (isLoading) return null

  // Ensure Spline loads every time regardless of tier, as requested.
  // The tier variable is still used for configuring resolution and features.

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
          pointerEvents: activePhase === 1 ? 'none' : 'auto',
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
          <Suspense fallback={null}>
            <Spline
              scene="/mething_copy.spline"
              onLoad={onLoad}
              className="w-full h-full"
            />
          </Suspense>
        </div>

        {/* Sound toggle — Phase 2+ */}
        {activePhase >= 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              const ctxs: AudioContext[] = (window as any)._audioContexts || []
              if (audioEnabled) {
                ctxs.forEach(ctx => {
                  if (ctx.state !== 'closed') ctx.suspend()
                })
                isManuallyMuted.current = true
                setAudioEnabled(false)
              } else {
                ctxs.forEach(ctx => {
                  if (ctx.state !== 'closed') ctx.resume()
                })
                isManuallyMuted.current = false
                initAudio()
              }
            }}
            className="fixed bottom-8 left-8 z-[9999] flex items-center gap-3 px-5 py-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all border border-white/10 group cursor-pointer"
          >
            {audioEnabled
              ? <FaVolumeUp className="text-lg group-hover:scale-110 transition-transform" />
              : <FaVolumeMute className="text-lg group-hover:scale-110 transition-transform" />
            }
            <span className="text-sm font-medium tracking-wide">
              {audioEnabled ? 'Sound On' : 'Sound Off'}
            </span>
          </button>
        )}
      </div>
    </>
  )
})