'use client'

import React, { useEffect, useState } from 'react'

export const MobileWarning = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null)

    useEffect(() => {
        const checkDevice = () => {
            // Check if it's portrait or narrow screen (mobile)
            const isPortrait = window.innerHeight > window.innerWidth
            const isNarrow = window.innerWidth <= 768
            setIsMobile(isPortrait || isNarrow)
        }

        checkDevice()
        window.addEventListener('resize', checkDevice)
        return () => window.removeEventListener('resize', checkDevice)
    }, [])

    // During SSR or before detection, render nothing to avoid hydration mismatch and
    // prevent loading heavy Spline assets prematurely on mobile.
    if (isMobile === null) {
        return null
    }

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-6">
                    <h2 className="text-2xl font-bold text-accent">Landscape Orientation Required</h2>
                    <p className="text-white/70 leading-relaxed text-lg">
                        This Portfolio is not optimized for portrait screens.
                    </p>
                    <p className="text-white/50 text-sm">
                        Please switch to a <strong>Desktop mode</strong> or use a<strong>Laptop</strong>for the intended functionality.
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
