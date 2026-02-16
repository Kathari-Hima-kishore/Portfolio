'use client'

import { useEffect, useState } from 'react'

export const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            // Base width for desktop design
            const baseWidth = 1440

            // If smaller than base but larger than mobile breakpoint
            if (width < baseWidth && width > 768) {
                setScale(width / baseWidth)
            } else {
                setScale(1)
            }
        }

        // Initial calc
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (scale === 1) return <>{children}</>

    return (
        <div
            style={{
                width: '1440px', // Force desktop width logic
                height: `${100 / scale}%`, // Compensate height to fill viewport
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                overflowX: 'hidden'
            }}
            className="relative origin-top-left"
        >
            {children}
        </div>
    )
}
