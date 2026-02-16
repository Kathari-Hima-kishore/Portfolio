'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState } from 'react'
import { FaCode, FaServer, FaCloud, FaTools } from 'react-icons/fa'
import { CubeButton } from '@/components/ui/CubeButton'

export const SkillsSection = memo(function SkillsSection() {
    const [showSkillsList, setShowSkillsList] = useState(false)

    return (
        <section id="phase-2" className="min-h-screen w-full relative flex items-center justify-center p-4">

            {/* Heading - Absolute Top Left */}
            <div className="absolute top-10 left-6 md:top-16 md:left-16 z-30 pointer-events-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white/80 drop-shadow-2xl tracking-tighter">
                    Skills & Tools
                </h2>
            </div>

            {/* Toggle Button - Absolute Bottom Right */}
            <div className="absolute bottom-10 right-6 md:bottom-16 md:right-16 z-30 pointer-events-auto">
                <CubeButton
                    text={showSkillsList ? "Collapse" : "View List"}
                    onClick={() => setShowSkillsList(!showSkillsList)}
                />
            </div>

            {/* Centered List Content */}
            <div className="w-full flex justify-center items-center z-20 pointer-events-none">
                <AnimatePresence>
                    {showSkillsList && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(12px)" }}
                            exit={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
                            className="w-full max-w-6xl bg-surface/80 border border-white/10 rounded-3xl p-6 md:p-12 pointer-events-auto shadow-2xl backdrop-blur-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Frontend */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400 text-2xl group-hover:scale-110 transition-transform"><FaCode /></div>
                                    <h4 className="text-xl font-bold text-white mb-3">Frontend</h4>
                                    <ul className="space-y-2 text-white/60 text-sm">
                                        <li></li>
                                        <li>HTML & CSS</li>
                                        <li>Tailwind CSS</li>
                                        <li>Javascript</li>
                                        <li>React.js </li>
                                    </ul>
                                </div>

                                {/* Backend */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-400 text-2xl group-hover:scale-110 transition-transform"><FaServer /></div>
                                    <h4 className="text-xl font-bold text-white mb-3">Backend & Database</h4>
                                    <ul className="space-y-2 text-white/60 text-sm">
                                        <li>Python</li>
                                        <li>Node.js</li>
                                        <li>SQL</li>
                                    </ul>
                                </div>

                                {/* Cloud */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 text-2xl group-hover:scale-110 transition-transform"><FaCloud /></div>
                                    <h4 className="text-xl font-bold text-white mb-3">Cloud & DevOps</h4>
                                    <ul className="space-y-2 text-white/60 text-sm">
                                        <li>Microsoft Azure</li>
                                        <li>Google Firebase</li>
                                        <li>Docker</li>
                                        <li>Git/Github</li>
                                    </ul>
                                </div>

                                {/* Tools */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 text-orange-400 text-2xl group-hover:scale-110 transition-transform"><FaTools /></div>
                                    <h4 className="text-xl font-bold text-white mb-3">API & Tools</h4>
                                    <ul className="space-y-2 text-white/60 text-sm">
                                        <li>Beeceptor</li>
                                        <li>Spline</li>
                                        <li>Jira</li>
                                        <li>Miro</li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
})
