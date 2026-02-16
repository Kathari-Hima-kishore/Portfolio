'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'

export const ProjectsSection = memo(function ProjectsSection() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <section id="phase-4" className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12 pointer-events-auto"
            >
                <div className="w-full md:w-1/2">
                    <span className="text-accent tracking-widest uppercase text-sm font-bold mb-2 block">Featured Project</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Event Management System</h2>
                    <p className="text-white/70 leading-relaxed mb-6">
                        A modern event management platform featuring real-time data synchronization and a robust <strong>3-tier Role-Based Access Control (RBAC)</strong> system. Built with <strong>Flask</strong> and <strong>Firebase</strong> for seamless performance.
                    </p>

                    <div className="mb-6 space-y-2">
                        <div className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-accent">▹</span>
                            <span><strong>Real-time Updates:</strong> Live enrollment tracking and dynamic event grids.</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-white/60">
                            <span className="text-accent">▹</span>
                            <span><strong>Admin Tools:</strong> Event CRUD, participant management, and developer approval workflows.</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {["Python", "Flask", "Firebase Auth", "Firestore", "RBAC", "HTML/CSS/JS"].map(tech => (
                            <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">{tech}</span>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <a href="https://github.com/Kathari-Hima-kishore/event-management-system-with-firebase" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                            <FaExternalLinkAlt size={14} /> GitHub Repo
                        </a>
                        <a href="https://event-management-system-with-firebase.onrender.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent-light transition-colors shadow-lg shadow-accent/20">
                            Live Demo
                        </a>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-[400px] bg-gradient-to-br from-surface to-black border border-white/10 rounded-2xl relative overflow-hidden group">
                    <Image
                        src="/EMS.png"
                        alt="Event Management System"
                        fill
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>
            </motion.div>
        </section>
    )
})
