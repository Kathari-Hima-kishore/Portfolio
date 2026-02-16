'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { memo } from 'react'

interface CubeButtonProps {
    text: string
    onClick: () => void
    className?: string
}

export const CubeButton = memo(function CubeButton({ text, onClick, className }: CubeButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`btn-cube cube cube-hover ${className || ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="bg-top">
                <div className="bg-inner"></div>
            </div>
            <div className="bg-right">
                <div className="bg-inner"></div>
            </div>
            <div className="bg">
                <div className="bg-inner"></div>
            </div>
            <div className="text uppercase">{text}</div>
        </motion.button>
    )
})
