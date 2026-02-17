'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'

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
  const isManuallyMuted = useRef(true) // Default: Starts Muted (User must enable)

  // Audio initialization logic
  const initAudio = useCallback(async () => {
    let success = false;
    const audioContexts = (window as any)._audioContexts || [];

    // 1. Resume global context(s)
    if (audioContexts.length > 0) {
      await Promise.all(audioContexts.map(async (ctx: AudioContext) => {
        try {
          await ctx.resume();
          if (ctx.state === 'running') success = true;
        } catch { }
      }));
    } else {
      // Only create new if none exist
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        try {
          const ctx = new AudioContext(); // This will be pushed to _audioContexts by our patch
          await ctx.resume();
          success = true;
        } catch (e) {
          console.warn("Audio init failed", e)
        }
      }
    }

    // 2. Resume Spline's specific context via runtime (legacy check, just in case)
    const app = splineInstanceRef.current
    if (app) {
      const runtime = app.runtime || app._runtime || app
      if (runtime?.audioContext) {
        try { await runtime.audioContext.resume(); } catch { }
      }
    }

    if (success) {
      setAudioEnabled(true)
      console.log("Audio Enabled Successfully")
    }
  }, [])

  // Attach listeners to container for immediate interaction capture
  // We use onMouseEnter to trigger as soon as mouse moves over the window
  const handleInteraction = useCallback(() => {
    if (!audioEnabled && !isManuallyMuted.current) initAudio()
  }, [initAudio, audioEnabled])

  // Also global listeners just in case
  useEffect(() => {
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'wheel']
    const handler = () => {
      if (!audioEnabled && !isManuallyMuted.current) initAudio()
    }
    events.forEach(e => window.addEventListener(e, handler, { once: true, passive: true }))
    return () => events.forEach(e => window.removeEventListener(e, handler))
  }, [initAudio, audioEnabled])

  // Enforce Mute Loop (The "Hammer") - Updated to use God Mode list
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!audioEnabled) {
      interval = setInterval(() => {
        const audioContexts = (window as any)._audioContexts || [];
        audioContexts.forEach((ctx: AudioContext) => {
          if (ctx.state === 'running') {
            ctx.suspend().catch(() => { });
          }
        });
      }, 200) // Check every 200ms
    }

    return () => clearInterval(interval)
  }, [audioEnabled])

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

        {/* Sound Toggle Button - Visible in Phase 2+ */}
        {activePhase >= 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const app = splineInstanceRef.current
              const runtime = app?.runtime || app?._runtime || app

              if (audioEnabled) {
                // Mute logic - God Mode
                if ((window as any)._audioContexts) {
                  (window as any)._audioContexts.forEach((ctx: AudioContext) => {
                    ctx.suspend();
                  });
                }
                isManuallyMuted.current = true;
                setAudioEnabled(false);
              } else {
                // Unmute logic - God Mode
                if ((window as any)._audioContexts) {
                  (window as any)._audioContexts.forEach((ctx: AudioContext) => {
                    ctx.resume();
                  });
                }
                isManuallyMuted.current = false;
                initAudio();
              }
            }}
            className="fixed bottom-8 left-8 z-[9999] flex items-center gap-3 px-5 py-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all border border-white/10 group cursor-pointer"
          >
            {audioEnabled ? (
              <FaVolumeUp className="text-lg group-hover:scale-110 transition-transform" />
            ) : (
              <FaVolumeMute className="text-lg group-hover:scale-110 transition-transform" />
            )}
            <span className="text-sm font-medium tracking-wide">
              {audioEnabled ? 'Sound On' : 'Sound Off'}
            </span>
          </button>
        )}
      </div>
    </>
  )
})