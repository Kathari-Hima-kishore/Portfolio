'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaExternalLinkAlt, FaCloud, FaCode } from 'react-icons/fa'

export const ProjectsMoreSection = memo(function ProjectsMoreSection() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-5" className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                className="max-w-6xl w-full pointer-events-auto"
            >
                <h2 className="text-4xl font-black text-white mb-12 text-center">More Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* AR Visualizer */}
                    <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 text-xl"><FaCloud /></div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/AR-3D-Visualizer" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                    <FaCode size={18} />
                                </a>
                                <a href="https://ar-3d-visualizer.onrender.com/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                    <FaExternalLinkAlt size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">AR-3D-Visualizer</h3>
                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            A seamless <strong>web-based Augmented Reality</strong> experience. Visualize and interact with complex 3D models in real-time directly in your browser. Features <strong>interactive object manipulation</strong> (scale, rotate, place) without native app installation.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">React</span>
                            <span className="text-xs text-white/40 font-mono">Node.js</span>
                            <span className="text-xs text-white/40 font-mono">WebGL/Three.js</span>
                            <span className="text-xs text-white/40 font-mono">WebAR</span>
                        </div>
                    </div>

                    {/* Open Chat */}
                    <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400 text-xl"><FaCode /></div>
                            <div className="flex gap-3">
                                <a href="https://github.com/Kathari-Hima-kishore/real-time-community-open-chat" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                    <FaCode size={18} />
                                </a>
                                <a href="https://kathari-hima-kishore.github.io/real-time-community-open-chat/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                    <FaExternalLinkAlt size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Community Open Chat</h3>
                        <p className="text-white/60 mb-6 text-sm leading-relaxed">
                            A lightweight, real-time messaging platform designed for open community discussions. Built with pure <strong>HTML, CSS, and JavaScript</strong> for simplicity and speed. Features an intuitive UI for instant opinion sharing.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="text-xs text-white/40 font-mono">HTML5</span>
                            <span className="text-xs text-white/40 font-mono">CSS3</span>
                            <span className="text-xs text-white/40 font-mono">JavaScript</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
