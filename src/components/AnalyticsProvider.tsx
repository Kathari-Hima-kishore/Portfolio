'use client'

import { useEffect } from 'react'
import { getAnalyticsInstance, logEvent } from '@/lib/firebase'

export function AnalyticsProvider() {
    useEffect(() => {
        // Initialize analytics + log page view on mount
        const init = async () => {
            await getAnalyticsInstance()
            await logEvent('page_view', {
                page_title: 'Portfolio Home',
                page_location: window.location.href,
            })
        }
        init()
    }, [])

    return null // No UI — purely a side-effect component
}
