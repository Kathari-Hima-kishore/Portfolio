'use client'

import { useEffect, useRef, memo } from 'react'

export const StarryBackground = memo(function StarryBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let stars: Star[] = []

        class Star {
            x: number
            y: number
            size: number
            baseBrightness: number
            brightness: number
            twinkleSpeed: number
            twinklePhase: number
            twinkleAmount: number
            speedX: number
            speedY: number
            opacity: number
            fadeIn: boolean
            fadeOut: boolean

            constructor(initial = true) {
                this.x = Math.random() * canvas!.width
                this.y = initial ? Math.random() * canvas!.height : canvas!.height + Math.random() * 50

                this.size = Math.random() * 1.7 + 0.8

                this.baseBrightness = Math.random() * 0.5 + 0.15
                this.brightness = this.baseBrightness

                this.twinkleSpeed = Math.random() * 0.008 + 0.003
                this.twinklePhase = Math.random() * Math.PI * 2
                this.twinkleAmount = Math.random() * 0.3 + 0.1

                this.speedX = Math.random() * 0.3 + 0.15
                this.speedY = -(Math.random() * 0.4 + 0.2)

                this.opacity = initial ? 1 : 0
                this.fadeIn = !initial
                this.fadeOut = false
            }

            update() {
                this.twinklePhase += this.twinkleSpeed
                const twinkle = Math.sin(this.twinklePhase) * this.twinkleAmount
                this.brightness = Math.max(0.05, this.baseBrightness + twinkle)

                if (this.fadeIn && this.opacity < 1) {
                    this.opacity += 0.008
                    if (this.opacity >= 1) this.fadeIn = false
                }

                this.x += this.speedX
                this.y += this.speedY

                if (this.y < canvas!.height * 0.1 || this.x > canvas!.width * 0.9) {
                    this.fadeOut = true
                }

                if (this.fadeOut) {
                    this.opacity -= 0.01
                }

                if (this.opacity <= 0 || this.y < -10 || this.x > canvas!.width + 10) {
                    this.reset()
                }
            }

            reset() {
                if (Math.random() > 0.5) {
                    this.x = Math.random() * canvas!.width * 0.7
                    this.y = canvas!.height + Math.random() * 50
                } else {
                    this.x = -Math.random() * 50
                    this.y = Math.random() * canvas!.height * 0.7 + canvas!.height * 0.3
                }
                this.size = Math.random() * 1.7 + 0.8
                this.baseBrightness = Math.random() * 0.5 + 0.15
                this.opacity = 0
                this.fadeIn = true
                this.fadeOut = false
                this.speedX = Math.random() * 0.3 + 0.15
                this.speedY = -(Math.random() * 0.4 + 0.2)
            }

            draw() {
                if (!ctx) return
                const finalOpacity = this.brightness * this.opacity

                // Optimization: Integer coordinates for faster rendering
                const ix = this.x | 0
                const iy = this.y | 0

                ctx.beginPath()
                ctx.arc(ix, iy, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`
                ctx.fill()
            }
        }

        const initStars = () => {
            stars = []
            // Optimization: Reduced density (increase divisor) for better performance
            const numStars = Math.floor((canvas.width * canvas.height) / 15000)
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star(true))
            }
        }

        const animate = () => {
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            stars.forEach(star => {
                star.update()
                star.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            // Use window.innerWidth/Height to avoid scrollbar issues on mobile?
            // But for fixed position background, ensuring full coverage is key.
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initStars()
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none w-full h-full"
        />
    )
})
