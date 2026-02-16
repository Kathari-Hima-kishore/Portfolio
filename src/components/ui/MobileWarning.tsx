'use client'

import React from 'react'

export const MobileWarning = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-8 text-center md:hidden">
            <div className="max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-accent">Desktop Orientation Required</h2>
                <p className="text-white/70 leading-relaxed text-lg">
                    This Portfolio is not optimised for mobile phones.
                </p>
                <p className="text-white/50 text-sm">
                    Please switch to a <strong>Desktop</strong> or <strong>Laptop</strong> for the intended experience.
                </p>
            </div>
        </div>
    )
}
