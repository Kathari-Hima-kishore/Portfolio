'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { FaGithub, FaEnvelope } from 'react-icons/fa'

export const HeroSection = memo(function HeroSection() {
    const sectionVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-1" className="min-h-screen flex items-center p-8 pb-20">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={sectionVariants}
                className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12"
            >
                <div className="flex flex-col justify-center items-start md:col-span-7">
                    <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 font-medium">Hello, World.</p>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6">
                        Kathari <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Hima Kishore</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-accent-light font-light mb-8">Aspiring Full Stack Cloud Engineer</h2>
                    <p className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed mb-8">
                        Building scalable, secure, and intelligent web solutions. Committed to delivering full-stack excellence leveraging cloud computing and AI.
                    </p>

                    <div className="flex gap-4 pointer-events-auto">
                        <a href="https://github.com/Kathari-Hima-kishore" target="_blank" rel="noopener noreferrer"
                            className="px-6 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-white">
                            <FaGithub /> GitHub
                        </a>
                        <a href="mailto:himakishorekathari@gmail.com"
                            className="px-6 py-3 bg-accent/20 border border-accent/40 rounded-full hover:bg-accent/30 transition-colors flex items-center gap-2 text-white">
                            <FaEnvelope /> Contact Me
                        </a>
                    </div>
                </div>
                {/* Right side is empty for the 3D object */}
                <div className="hidden md:block md:col-span-5"></div>
            </motion.div>
        </section>
    )
})
