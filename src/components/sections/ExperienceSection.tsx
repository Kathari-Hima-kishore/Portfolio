'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

export const ExperienceSection = memo(function ExperienceSection() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
    }

    return (
        <section id="phase-3" className="min-h-screen flex items-center justify-center p-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                className="max-w-6xl w-full pointer-events-auto"
            >
                <h2 className="text-5xl font-black text-white mb-12">Experience</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">

                    {/* Experience 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-white text-xl">Microsoft AI Azure Intern - Virtual</h3>
                                <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">May - Jun 2025</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">AICTE (Microsoft Initiative)</div>
                            <ul className="text-white/70 text-sm list-disc list-inside space-y-2">
                                <li>Acquired hands-on expertise in Azure fundamentals, AI Foundry services.</li>
                                <li>Integrated Azure AI services into full-stack apps, managing credentials and APIs.</li>
                                <li>Built a security vulnerability scanner analyzing 100+ target URLs for potential threats using Azure's AI services.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Experience 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-white text-xl">Python Development Intern - Virtual</h3>
                                <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">Jul - Aug 2023</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">SpaceZee Technologies</div>
                            <ul className="text-white/70 text-sm list-disc list-inside space-y-2">
                                <li>Engineered a web scraper using BeautifulSoup to fetch real-time data from 10+ sources.</li>
                                <li>Processed 5,000+ data records daily with 98% accuracy.</li>
                                <li>Implemented robust validation pipelines for data consistency.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
})
