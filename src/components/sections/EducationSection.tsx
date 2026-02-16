'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

export const EducationSection = memo(function EducationSection() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <section id="phase-6" className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className="max-w-3xl w-full text-center pointer-events-auto"
            >
                <div className="w-20 h-20 bg-white/5 mx-auto rounded-full flex items-center justify-center mb-8 border border-white/10">
                    <span className="text-3xl">🎓</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Education</h2>
                <p className="text-white/40 mb-12">Foundation of my technical journey</p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl leading-none select-none">26</div>
                    <h3 className="text-2xl font-bold text-white mb-2">B.Tech in Information Technology</h3>
                    <p className="text-accent text-lg mb-4">Hindustan University, Chennai</p>
                    <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-6">
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-white/40 mb-1">Duration</span>
                            <span className="text-white">Aug 2022 – Jul 2026</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs uppercase tracking-widest text-white/40 mb-1">Grade</span>
                            <span className="text-3xl font-bold text-white">8.9 <span className="text-sm font-normal text-white/40">CGPA</span></span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
