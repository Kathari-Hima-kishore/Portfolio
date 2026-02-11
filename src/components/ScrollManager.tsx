'use client'

import { useLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'

export function ScrollManager() {
    const lenis = useLenis()
    const [hasScrolled, setHasScrolled] = useState(false)
    const isScrollingRef = useRef(false)

    useEffect(() => {
        if (!lenis) return

        const handleScroll = (e: any) => {
            // Only interfere if we haven't auto-scrolled yet and user is near the top
            if (hasScrolled || isScrollingRef.current) return

            // Logic: If user is at Phase 1 (top) and scrolls down
            // scroll > 10 usually means they started scrolling
            if (e.scroll < 50 && e.velocity > 0) {
                isScrollingRef.current = true
                lenis.scrollTo('#phase-2', {
                    duration: 0.4,
                    lock: true,
                    onComplete: () => {
                        isScrollingRef.current = false
                        setHasScrolled(true)
                    }
                })
            }
        }

        lenis.on('scroll', handleScroll)

        return () => {
            lenis.off('scroll', handleScroll)
        }
    }, [lenis, hasScrolled])

    return null
}
