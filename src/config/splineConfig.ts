// Single Spline scene
export const SPLINE_SCENE = '/mething_copy.spline'

// The main 3D object name (as shown in Spline editor)
export const MAIN_OBJECT_NAME = 'AnimatedWorld'

// Per-phase 3D object transform states
export const OBJECT_STATES = {
    phase1: {
        // Larger than before, fills the right side nicely
        scale: { x: 0.50, y: 0.52, z: 0.51 },
        position: { x: 400, y: 12, z: 35 },
        rotation: { x: 0, y: -0.2, z: 0 },
    },
    phase2: {
        // Full size, centered
        scale: { x: 0.65, y: 0.68, z: 0.67 },
        position: { x: 0, y: 212, z: 35 },
        rotation: { x: 0, y: 0, z: 0 },
    },
}

// Idle animation settings (gentle floating in Phase 1)
export const IDLE_ANIMATION = {
    floatY: 15,           // pixels to float up/down
    floatDuration: 3,     // seconds per cycle
    rotateZ: 0.03,        // radians to wiggle
    rotateDuration: 4,    // seconds per cycle
}

// Transition duration (seconds)
export const TRANSITION_DURATION = 1.2
