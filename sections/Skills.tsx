'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import LiquidHeading from '@/app/components/LiquidHeading';

gsap.registerPlugin(ScrollTrigger);

const filterOptions = [
    { id: 'all', label: '⚡ All Stack (32)' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & Infra' },
    { id: 'aicloud', label: 'AI & Cloud' },
    { id: 'languages', label: 'Languages & Databases' },
];

const Skills = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState('all');

    useGSAP(() => {
        const cards = gsap.utils.toArray('.skill-card');

        gsap.fromTo(
            cards,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
            }
        );
    }, { scope: sectionRef });

    // --- Interactive filter button handler (Image 2) ---
    const handleFilterClick = (filterId: string) => {
        if (filterId === 'all') {
            setActiveFilter('all');
        } else {
            // Clicking already active filter toggles back to 'all'
            setActiveFilter((prev) => (prev === filterId ? 'all' : filterId));
        }
    };

    const isCardDimmed = (cardCategory: string) => {
        if (activeFilter === 'all') return false;
        return activeFilter !== cardCategory;
    };

    const washiTapeStyle = "bg-white/65 border-l-2 border-r-2 border-dashed border-black/25 shadow-sm backdrop-blur-[2px] pointer-events-none";
    const tagStyle = "inline-flex items-center bg-white border-[2.5px] border-[#121212] px-3.5 py-1.5 text-sm sm:text-[15px] font-extrabold shadow-[3px_3px_0_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#121212] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#121212] transition-all cursor-default select-none";

    return (
        <section ref={sectionRef} className="relative w-full bg-[#f3865e] py-14 md:py-20 px-3 sm:px-6 md:px-8 lg:px-10 overflow-x-clip overflow-y-visible">
            {/* Expanded container width to properly cover left and right space (Image 3 reference) */}
            <div className="w-full max-w-[1550px] mx-auto relative">

                {/* Section Header */}
                <header className="text-center mb-10 relative flex flex-col items-center">
                    {/* Title with layered 3D neo-brutalist shadow */}
                    <LiquidHeading
                        as="h2"
                        text="MY TOOLKIT"
                        className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight mb-4 select-none text-white drop-shadow-none font-futura"
                        style={{
                            textShadow: '2px 2px 0 #121212, 4px 4px 0 #121212, 6px 6px 0 #121212, 8px 8px 0 #121212',
                            WebkitTextStroke: '2px #121212',
                        }}
                        letterStyle={{
                            textShadow: '2px 2px 0 #121212, 4px 4px 0 #121212, 6px 6px 0 #121212, 8px 8px 0 #121212',
                            WebkitTextStroke: '2px #121212',
                        }}
                        intensity={1}
                        speed={1}
                    />

                    {/* Subtitle Banner Box */}
                    <div className="inline-block bg-[#fef08a] border-[3px] border-[#121212] px-6 py-2 shadow-[5px_5px_0_#121212] transform -rotate-1 hover:rotate-0 transition-transform">
                        <p className="font-extrabold text-base sm:text-lg text-[#121212] tracking-normal font-sans">
                            What I use to build the web.
                        </p>
                    </div>

                    {/* Interactive Filter Pills Bar (Feature showcase in Image 2) */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
                        {filterOptions.map((option) => {
                            const isActive = activeFilter === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handleFilterClick(option.id)}
                                    className={`border-[3px] border-[#121212] font-bold text-xs uppercase px-3.5 py-1.5 transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#fef08a] -translate-x-0.5 -translate-y-0.5 shadow-[4px_4px_0_#121212]'
                                            : 'bg-white/90 hover:bg-white hover:-translate-y-0.5 shadow-[3px_3px_0_#121212]'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Bento Workbench Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">

                    {/* ==============================================
                        CARD 1: FRONTEND CORE (5 Cols, Top Left)
                       ============================================== */}
                    <div
                        className="skill-card lg:col-span-5 relative cursor-default pt-2"
                        style={{
                            opacity: isCardDimmed('frontend') ? 0.35 : 1,
                            filter: isCardDimmed('frontend') ? 'grayscale(30%)' : 'none',
                            pointerEvents: isCardDimmed('frontend') ? 'none' : 'auto',
                            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
                        }}
                    >
                        {/* Card Content */}
                        <div className="card-content bg-[#bbf2f6] border-[3.5px] border-[#121212] p-6 sm:p-7 shadow-[8px_8px_0_#121212] hover:-translate-y-1 hover:shadow-[10px_10px_0_#121212] transition-all duration-300 relative rounded-none flex flex-col justify-between min-h-[380px] h-full z-20">
                            {/* Washi Tape */}
                            <div className={`washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 z-20 rotate-1 ${washiTapeStyle}`} />

                            {/* Corner Sticker Badge */}
                            <div className="absolute -top-3.5 -right-3 bg-white border-[2.5px] border-[#121212] px-2.5 py-0.5 text-[10px] font-black uppercase shadow-[3px_3px_0_#121212] rotate-6 select-none">
                                UI / UX Core
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b-[3px] border-[#121212]/20 pb-3.5 mb-5">
                                    <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#121212] font-futura">
                                        FRONTEND CORE
                                    </h3>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-none bg-white border-2 border-[#121212] font-black text-sm shadow-[3px_3px_0_#121212]">
                                        01
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="font-medium text-sm sm:text-[15px] text-[#121212]/90 mb-5 leading-relaxed">
                                    Architecting reactive interfaces, fluid dynamic component structures, and responsive pixel precision.
                                </p>

                                {/* Tags Container */}
                                <div className="flex flex-wrap gap-2.5 items-center">
                                    {["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Fabric.js", "HTML5 & CSS3", "Responsive UI"].map((tag) => (
                                        <span key={tag} className={tagStyle}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footnote */}
                            <div className="mt-6 pt-3.5 border-t-2 border-[#121212]/20 flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#121212]/80">
                                <span>Primary Client Workbench</span>
                                <span className="bg-[#121212] text-white px-2.5 py-0.5 uppercase tracking-wider text-[10px] sm:text-xs font-black">
                                    8 Items
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ==============================================
                        CARD 2: AI & CLOUD (7 Cols, Top Right)
                       ============================================== */}
                    <div
                        className="skill-card lg:col-span-7 relative cursor-default pt-2"
                        style={{
                            opacity: isCardDimmed('aicloud') ? 0.35 : 1,
                            filter: isCardDimmed('aicloud') ? 'grayscale(30%)' : 'none',
                            pointerEvents: isCardDimmed('aicloud') ? 'none' : 'auto',
                            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
                        }}
                    >
                        {/* Card Content */}
                        <div className="card-content bg-[#fecdd3] border-[3.5px] border-[#121212] p-6 sm:p-7 shadow-[8px_8px_0_#121212] hover:-translate-y-1 hover:shadow-[10px_10px_0_#121212] transition-all duration-300 relative rounded-none flex flex-col justify-between min-h-[380px] h-full z-20">
                            {/* Washi Tape */}
                            <div className={`washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 z-20 -rotate-1 ${washiTapeStyle}`} />

                            {/* Corner Sticker Badge */}
                            <div className="absolute -top-3 -right-2 bg-yellow-300 border-[2.5px] border-[#121212] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#121212] rotate-3 select-none">
                                ✨ Intelligent Infra
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b-[3px] border-[#121212]/20 pb-3.5 mb-5">
                                    <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#121212] font-futura">
                                        AI &amp; CLOUD
                                    </h3>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-none bg-white border-2 border-[#121212] font-black text-sm shadow-[3px_3px_0_#121212]">
                                        02
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="font-medium text-sm sm:text-[15px] text-[#121212]/90 mb-5 leading-relaxed">
                                    Deploying LLM workflows, context pipelines, vector embeddings, and deterministic container infrastructure.
                                </p>

                                {/* Grouped Clusters */}
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs sm:text-[13px] uppercase tracking-wider font-black text-[#121212]/80 block mb-2 font-futura">
                                            Generative AI &amp; Agentic Stack
                                        </span>
                                        <div className="flex flex-wrap gap-2.5">
                                            {["LangChain", "RAG & Embeddings", "OpenAI API", "Claude Code & Copilot"].map((tag) => (
                                                <span key={tag} className={tagStyle}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs sm:text-[13px] uppercase tracking-wider font-black text-[#121212]/80 block mb-2 font-futura">
                                            Cloud Ops &amp; CI/CD
                                        </span>
                                        <div className="flex flex-wrap gap-2.5">
                                            {["AWS Cloud", "Docker", "CI/CD Pipelines", "Git / GitHub Actions"].map((tag) => (
                                                <span key={tag} className={tagStyle}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footnote */}
                            <div className="mt-6 pt-3.5 border-t-2 border-[#121212]/20 flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#121212]/80">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                    Autoscaling &amp; Containerized
                                </span>
                                <span className="bg-[#121212] text-white px-2.5 py-0.5 uppercase tracking-wider text-[10px] sm:text-xs font-black">
                                    8 Items
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ==============================================
                        CARD 3: BACKEND & INFRA (7 Cols, Bottom Left)
                       ============================================== */}
                    <div
                        className="skill-card lg:col-span-7 relative cursor-default pt-2"
                        style={{
                            opacity: isCardDimmed('backend') ? 0.35 : 1,
                            filter: isCardDimmed('backend') ? 'grayscale(30%)' : 'none',
                            pointerEvents: isCardDimmed('backend') ? 'none' : 'auto',
                            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
                        }}
                    >
                        {/* Card Content */}
                        <div className="card-content bg-[#fef3c7] border-[3.5px] border-[#121212] p-6 sm:p-7 shadow-[8px_8px_0_#121212] hover:-translate-y-1 hover:shadow-[10px_10px_0_#121212] transition-all duration-300 relative rounded-none flex flex-col justify-between min-h-[360px] h-full z-20">
                            {/* Washi Tape */}
                            <div className={`washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 z-20 rotate-1 ${washiTapeStyle}`} />

                            {/* Corner Sticker Badge */}
                            <div className="absolute -top-3.5 right-6 bg-white border-2 border-[#121212] px-3 py-0.5 text-[10px] font-black uppercase shadow-[3px_3px_0_#121212] -rotate-2 select-none">
                                High Throughput
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b-[3px] border-[#121212]/20 pb-3.5 mb-5">
                                    <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#121212] font-futura">
                                        BACKEND &amp; INFRA
                                    </h3>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-none bg-white border-2 border-[#121212] font-black text-sm shadow-[3px_3px_0_#121212]">
                                        03
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="font-medium text-sm sm:text-[15px] text-[#121212]/90 mb-5 leading-relaxed">
                                    Constructing resilient event pipelines, microservices, asynchronous workers, and low-latency sockets.
                                </p>

                                {/* 2-Column Subgrid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/60 p-3.5 border-2 border-[#121212]/30">
                                        <span className="text-xs sm:text-[13px] font-black uppercase text-[#121212]/80 block mb-2 tracking-wide font-futura">
                                            Runtime &amp; APIs
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {["FastAPI", "Express.js", "Node.js"].map((tag) => (
                                                <span key={tag} className={tagStyle}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/60 p-3.5 border-2 border-[#121212]/30">
                                        <span className="text-xs sm:text-[13px] font-black uppercase text-[#121212]/80 block mb-2 tracking-wide font-futura">
                                            Queues &amp; Realtime
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {["Celery", "Redis", "BullMQ", "Socket.IO", "WebSockets & WebRTC"].map((tag) => (
                                                <span key={tag} className={tagStyle}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footnote */}
                            <div className="mt-6 pt-3.5 border-t-2 border-[#121212]/20 flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#121212]/80">
                                <span>Concurrency &amp; Async Architectures</span>
                                <span className="bg-[#121212] text-white px-2.5 py-0.5 uppercase tracking-wider text-[10px] sm:text-xs font-black">
                                    8 Items
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ==============================================
                        CARD 4: LANGUAGES & DATABASES (5 Cols, Bottom Right)
                       ============================================== */}
                    <div
                        className="skill-card lg:col-span-5 relative cursor-default pt-2"
                        style={{
                            opacity: isCardDimmed('languages') ? 0.35 : 1,
                            filter: isCardDimmed('languages') ? 'grayscale(30%)' : 'none',
                            pointerEvents: isCardDimmed('languages') ? 'none' : 'auto',
                            transition: 'opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease',
                        }}
                    >
                        {/* Card Content */}
                        <div className="card-content bg-[#dcfce7] border-[3.5px] border-[#121212] p-6 sm:p-7 shadow-[8px_8px_0_#121212] hover:-translate-y-1 hover:shadow-[10px_10px_0_#121212] transition-all duration-300 relative rounded-none flex flex-col justify-between min-h-[360px] h-full z-20">
                            {/* Washi Tape */}
                            <div className={`washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 z-20 rotate-1 ${washiTapeStyle}`} />

                            {/* Corner Sticker Badge */}
                            <div className="absolute -top-3 -right-2 bg-emerald-300 border-[2.5px] border-[#121212] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#121212] rotate-6 select-none">
                                Core Engine
                            </div>

                            <div>
                                {/* Card Header */}
                                <div className="flex items-center justify-between border-b-[3px] border-[#121212]/20 pb-3.5 mb-5">
                                    <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#121212] font-futura">
                                        LANGUAGES &amp; DATABASES
                                    </h3>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-none bg-white border-2 border-[#121212] font-black text-sm shadow-[3px_3px_0_#121212]">
                                        04
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="font-medium text-sm sm:text-[15px] text-[#121212]/90 mb-5 leading-relaxed">
                                    Foundation programming languages, persistence layers, data structures, and distributed engineering fundamentals.
                                </p>

                                {/* Tags Container */}
                                <div className="flex flex-wrap gap-2.5 items-center">
                                    {["Python", "C/C++", "PostgreSQL", "MongoDB", "MySQL", "InfluxDB", "DSA & Algorithms", "System Design & OOP"].map((tag) => (
                                        <span key={tag} className={tagStyle}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card Footnote */}
                            <div className="mt-6 pt-3.5 border-t-2 border-[#121212]/20 flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#121212]/80">
                                <span>Relational • Document • Time-series</span>
                                <span className="bg-[#121212] text-white px-2.5 py-0.5 uppercase tracking-wider text-[10px] sm:text-xs font-black">
                                    8 Items
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Skills;
