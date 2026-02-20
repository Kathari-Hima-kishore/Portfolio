'use client'

/**
 * Detects device performance tier to adapt rendering quality.
 * Returns: 'high' | 'medium' | 'low'
 *
 * Strategy:
 * - 'low'    → No WebGL, software-rendered WebGL, ≤2 cores, ≤1GB RAM,
 *               or prefers-reduced-motion → disable Spline, minimal stars
 * - 'medium' → ≤6 cores or ≤3GB RAM → cap stars, lower Spline quality
 * - 'high'   → 8+ cores and 4GB+ RAM → full experience
 */

export type PerfTier = 'high' | 'medium' | 'low'

let _cachedTier: PerfTier | null = null

/**
 * Returns 'hardware' | 'software' | 'none'.
 *
 * Checks the WEBGL_debug_renderer_info extension for the unmasked renderer
 * string. Software renderers contain keywords like "SwiftShader", "llvmpipe",
 * "Software", or "Microsoft Basic Render Driver".
 */
function detectWebGL(): 'hardware' | 'software' | 'none' {
    try {
        const canvas = document.createElement('canvas')
        const gl = (canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
        if (!gl) return 'none'

        const dbg = gl.getExtension('WEBGL_debug_renderer_info')
        if (dbg) {
            const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string
            const vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) as string
            const info = `${renderer} ${vendor}`.toLowerCase()

            // Known software renderer strings
            const softwareKeywords = [
                'swiftshader',    // Chrome's software fallback
                'llvmpipe',       // Mesa software fallback (Linux)
                'softpipe',       // Mesa software
                'software',       // Generic
                'microsoft basic', // Windows Basic Display Driver
            ]

            if (softwareKeywords.some(kw => info.includes(kw))) {
                return 'software'
            }
        }

        return 'hardware'
    } catch {
        return 'none'
    }
}

export function getPerformanceTier(): PerfTier {
    if (_cachedTier) return _cachedTier

    // SSR guard
    if (typeof window === 'undefined') return 'high'

    const cores = navigator.hardwareConcurrency ?? 4
    const mem = (navigator as any).deviceMemory ?? 4
    const webgl = detectWebGL()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Software WebGL or no WebGL → low (Spline would kill the CPU)
    if (webgl !== 'hardware' || reducedMotion || cores <= 2 || mem <= 1) {
        _cachedTier = 'low'
    } else if (cores <= 6 || mem <= 3) {
        _cachedTier = 'medium'
    } else {
        _cachedTier = 'high'
    }

    console.log(`[Perf] Tier: ${_cachedTier} | WebGL: ${webgl} | Cores: ${cores} | RAM: ${mem}GB`)

    return _cachedTier
}

/** How many stars to render per unit area */
export const STAR_DENSITY: Record<PerfTier, number> = {
    high: 14000,
    medium: 22000,
    low: 40000,
}

/** Target animation FPS per tier */
export const TARGET_FPS: Record<PerfTier, number> = {
    high: 60,
    medium: 45,
    low: 30,
}
