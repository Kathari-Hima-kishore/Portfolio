import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported, Analytics, logEvent as firebaseLogEvent } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Singleton app instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Analytics is browser-only — must check isSupported()
let analyticsInstance: Analytics | null = null

export async function getAnalyticsInstance(): Promise<Analytics | null> {
    if (typeof window === 'undefined') return null
    if (analyticsInstance) return analyticsInstance
    const supported = await isSupported()
    if (supported) {
        analyticsInstance = getAnalytics(app)
    }
    return analyticsInstance
}

// Helper: log any custom event
export async function logEvent(eventName: string, params?: Record<string, string | number>) {
    const analytics = await getAnalyticsInstance()
    if (analytics) {
        firebaseLogEvent(analytics, eventName, params)
    }
}

export default app
