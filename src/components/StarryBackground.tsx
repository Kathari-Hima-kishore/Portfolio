'use client'

import { useEffect, useRef, memo } from 'react'
import { getPerformanceTier, STAR_DENSITY, TARGET_FPS } from '@/lib/performance'

export const StarryBackground = memo(function StarryBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: false }) // alpha:false = faster compositing
        if (!ctx) return

        const tier = getPerformanceTier()
        const density = STAR_DENSITY[tier]
        const targetFPS = TARGET_FPS[tier]
        const frameDuration = 1000 / targetFPS // ms per frame

        let animationFrameId: number
        let lastFrameTime = 0
        let w = 0
        let h = 0

        // -------------------------------------------------------------------
        // Pre-build a lookup table of rgba strings to avoid string allocation
        // every frame (major GC pressure source in the original code)
        // -------------------------------------------------------------------
        const OPACITY_STEPS = 64
        const colorCache: string[] = new Array(OPACITY_STEPS)
        for (let i = 0; i < OPACITY_STEPS; i++) {
            colorCache[i] = `rgba(255,255,255,${(i / (OPACITY_STEPS - 1)).toFixed(3)})`
        }

        // -------------------------------------------------------------------
        // Star — uses plain object (not class) for V8 hidden-class optimisation
        // -------------------------------------------------------------------
        interface StarObj {
            x: number; y: number; size: number
            baseBrightness: number; brightness: number
            twinkleSpeed: number; twinklePhase: number; twinkleAmount: number
            speedX: number; speedY: number
            opacity: number; fadeIn: boolean; fadeOut: boolean
        }

        function makeStar(initial: boolean): StarObj {
            return {
                x: Math.random() * w,
                y: initial ? Math.random() * h : h + Math.random() * 50,
                size: Math.random() * 1.4 + 0.6,
                baseBrightness: Math.random() * 0.5 + 0.15,
                brightness: 0,
                twinkleSpeed: Math.random() * 0.007 + 0.002,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleAmount: Math.random() * 0.25 + 0.08,
                speedX: Math.random() * 0.25 + 0.1,
                speedY: -(Math.random() * 0.3 + 0.15),
                opacity: initial ? 1 : 0,
                fadeIn: !initial,
                fadeOut: false,
            }
        }

        function resetStar(s: StarObj) {
            if (Math.random() > 0.5) {
                s.x = Math.random() * w * 0.7
                s.y = h + Math.random() * 50
            } else {
                s.x = -Math.random() * 50
                s.y = Math.random() * h * 0.7 + h * 0.3
            }
            s.size = Math.random() * 1.4 + 0.6
            s.baseBrightness = Math.random() * 0.5 + 0.15
            s.opacity = 0
            s.fadeIn = true
            s.fadeOut = false
            s.speedX = Math.random() * 0.25 + 0.1
            s.speedY = -(Math.random() * 0.3 + 0.15)
        }

        let stars: StarObj[] = []

        function initStars() {
            stars = []
            const count = Math.floor((w * h) / density)
            for (let i = 0; i < count; i++) stars.push(makeStar(true))
        }

        // -------------------------------------------------------------------
        // Animate — throttled to targetFPS, single fillRect background clear
        // -------------------------------------------------------------------
        function animate(timestamp: number) {
            animationFrameId = requestAnimationFrame(animate)

            const elapsed = timestamp - lastFrameTime
            if (elapsed < frameDuration) return   // throttle
            lastFrameTime = timestamp - (elapsed % frameDuration) // smooth carry-over

            // Solid fill (alpha:false ctx repaints whole buffer cheaply)
            // ctx is guaranteed non-null here (checked at top of useEffect)
            ctx!.fillStyle = '#000000'
            ctx!.fillRect(0, 0, w, h)

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]

                // Update twinkle
                s.twinklePhase += s.twinkleSpeed
                s.brightness = Math.max(0.05, s.baseBrightness + Math.sin(s.twinklePhase) * s.twinkleAmount)

                // Fade in
                if (s.fadeIn) {
                    s.opacity = Math.min(1, s.opacity + 0.008)
                    if (s.opacity >= 1) s.fadeIn = false
                }

                // Move
                s.x += s.speedX
                s.y += s.speedY

                // Start fade out near edges
                if (!s.fadeOut && (s.y < h * 0.1 || s.x > w * 0.9)) s.fadeOut = true
                if (s.fadeOut) s.opacity -= 0.009

                // Reset if off-screen or fully transparent
                if (s.opacity <= 0 || s.y < -10 || s.x > w + 10) {
                    resetStar(s)
                    continue
                }

                // Draw — lookup pre-built color string
                const alphaIdx = Math.min(OPACITY_STEPS - 1, Math.floor(s.brightness * s.opacity * (OPACITY_STEPS - 1)))
                ctx!.fillStyle = colorCache[alphaIdx]
                ctx!.beginPath()
                ctx!.arc(s.x | 0, s.y | 0, s.size, 0, Math.PI * 2)
                ctx!.fill()
            }
        }

        // -------------------------------------------------------------------
        // Resize — debounced so rapid window drags don't recreate 300 times
        // -------------------------------------------------------------------
        let resizeTimer: ReturnType<typeof setTimeout>
        function handleResize() {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                w = canvas!.width = window.innerWidth
                h = canvas!.height = window.innerHeight
                initStars()
            }, 150)
        }

        // Immediate first size
        w = canvas.width = window.innerWidth
        h = canvas.height = window.innerHeight
        initStars()
        animationFrameId = requestAnimationFrame(animate)

        window.addEventListener('resize', handleResize, { passive: true })

        // -------------------------------------------------------------------
        // Pause RAF when tab is hidden to save CPU/GPU
        // -------------------------------------------------------------------
        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId)
            } else {
                lastFrameTime = 0
                animationFrameId = requestAnimationFrame(animate)
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            cancelAnimationFrame(animationFrameId)
            clearTimeout(resizeTimer)
            window.removeEventListener('resize', handleResize)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: -1,
                width: '100%',
                height: '100%',
                // Hint browser to composite this on its own GPU layer
                willChange: 'contents',
                imageRendering: 'pixelated',
            }}
        />
    )
})
