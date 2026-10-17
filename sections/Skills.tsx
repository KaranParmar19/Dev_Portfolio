'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import {
    Layers,
    Sparkles,
    Server,
    Database,
    Zap,
    Code2,
    Terminal,
    Cpu,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Asterisk,
    Flame,
    Play,
    Workflow,
    Braces,
    Cloud,
    Gauge,
    GitBranch,
    Box,
    Radio,
    Search,
} from 'lucide-react';
import LiquidHeading from '@/app/components/LiquidHeading';
import SVGPathAnimation from '@/app/components/SVGPathAnimation';
import CountUp from '@/app/components/CountUp';
import { SkillIcon } from '@/app/components/SkillIcons';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });

// ─── Types & Data ────────────────────────────────────────────────────────────
type CategoryId = 'all' | 'frontend' | 'aicloud' | 'backend' | 'languages';
type ProjectId = 'all' | 'DevLens AI' | 'Lantern APM' | 'Voxa Workspace';

interface SkillItem {
    name: string;
    role: string;
    glyph: string;
    glyphBg: string;
    projects?: ProjectId[];
    highlight?: boolean;
}

const filterCategories: {
    id: CategoryId;
    label: string;
    count: number;
    dotColor: string;
    icon: React.ElementType;
}[] = [
    { id: 'all',       label: 'Everything',            count: 32, dotColor: '#fef08a', icon: Zap      },
    { id: 'frontend',  label: 'Frontend Core',         count: 8,  dotColor: '#bbf2f6', icon: Layers   },
    { id: 'aicloud',   label: 'AI & Cloud',            count: 8,  dotColor: '#fecdd3', icon: Sparkles },
    { id: 'backend',   label: 'Backend & Infra',       count: 8,  dotColor: '#fef08a', icon: Server   },
    { id: 'languages', label: 'Languages & Databases', count: 8,  dotColor: '#dcfce7', icon: Database },
];

const projectFilters: { id: ProjectId; label: string; badge: string }[] = [
    { id: 'all',            label: 'All Stack',      badge: '32 Tools' },
    { id: 'DevLens AI',     label: 'DevLens AI',     badge: 'RAG + FastAPI' },
    { id: 'Lantern APM',    label: 'Lantern APM',    badge: 'Node + Influx' },
    { id: 'Voxa Workspace', label: 'Voxa Workspace', badge: 'MERN + WebRTC' },
];

const frontendSkills: SkillItem[] = [
    { name: 'React.js',      role: 'Component Architecture, Custom Hooks & Concurrent UI', glyph: '⚛',  glyphBg: '#61dafb', projects: ['DevLens AI', 'Lantern APM', 'Voxa Workspace'], highlight: true },
    { name: 'Next.js',       role: 'App Router, SSR, Server Actions & Edge Middleware',    glyph: 'N',  glyphBg: '#f4f1eb', projects: ['DevLens AI'], highlight: true },
    { name: 'TypeScript',    role: 'Strict Type-Safe Contracts, Generics & Schemas',       glyph: 'TS', glyphBg: '#3178c6', projects: ['DevLens AI', 'Lantern APM'], highlight: true },
    { name: 'JavaScript',    role: 'ES6+ Async Runtime, Event Loop & DOM APIs',            glyph: 'JS', glyphBg: '#f7df1e', projects: ['Voxa Workspace'] },
    { name: 'Tailwind CSS',  role: 'Utility-First Design Tokens & Neo-Brutalist Systems',  glyph: 'TW', glyphBg: '#38bdf8', projects: ['DevLens AI', 'Lantern APM', 'Voxa Workspace'] },
    { name: 'Fabric.js',     role: 'Interactive 60fps HTML5 Whiteboard & Vector Canvas',   glyph: '🎨', glyphBg: '#f472b6', projects: ['Voxa Workspace'], highlight: true },
    { name: 'HTML5 & CSS3',  role: 'Semantic Accessibility, Grid & Keyframe Physics',      glyph: 'H5', glyphBg: '#f97316', projects: ['Voxa Workspace'] },
    { name: 'Responsive UI', role: 'Fluid Multi-Device Viewports & Adaptive Breakpoints',  glyph: '📱', glyphBg: '#a855f7', projects: ['DevLens AI', 'Lantern APM', 'Voxa Workspace'] },
];

const aiSkills: SkillItem[] = [
    { name: 'LangChain',             role: 'Agentic Chains, Tool Calling & Context Orchestration', glyph: '🦜', glyphBg: '#10b981', projects: ['DevLens AI'], highlight: true },
    { name: 'RAG & Embeddings',      role: 'Semantic Vector Search, Chunking & AST Grounding',     glyph: '◈',  glyphBg: '#8b5cf6', projects: ['DevLens AI'], highlight: true },
    { name: 'OpenAI API',            role: 'LLM Completions, Streaming & Structured JSON Outputs', glyph: '◎',  glyphBg: '#f4f1eb', projects: ['DevLens AI'] },
    { name: 'Claude Code & Copilot', role: 'AI-Augmented Engineering, Debugging & Pair Workflows', glyph: '✦',  glyphBg: '#d97757', projects: ['DevLens AI', 'Lantern APM'] },
];

const cloudSkills: SkillItem[] = [
    { name: 'AWS Cloud',            role: 'EC2, S3, IAM & Scalable Cloud Infrastructure',         glyph: '☁',  glyphBg: '#ff9900', projects: ['DevLens AI', 'Lantern APM'], highlight: true },
    { name: 'Docker',               role: 'Multi-Stage Container Images & Compose Networks',      glyph: '🐳', glyphBg: '#2496ed', projects: ['DevLens AI', 'Lantern APM'], highlight: true },
    { name: 'CI/CD Pipelines',      role: 'Automated Build, Lint & Zero-Downtime Deployments',    glyph: '⚙',  glyphBg: '#14b8a6', projects: ['DevLens AI', 'Lantern APM'] },
    { name: 'Git / GitHub Actions', role: 'Branch Workflows, PR Automation & Release Runners',    glyph: '⎇',  glyphBg: '#f05032', projects: ['DevLens AI', 'Lantern APM', 'Voxa Workspace'] },
];

const backendRuntimeSkills: SkillItem[] = [
    { name: 'FastAPI',    role: 'High-Performance Async Python REST & Dependency Injection', glyph: '⚡', glyphBg: '#009688', projects: ['DevLens AI'], highlight: true },
    { name: 'Node.js',    role: 'Non-Blocking Event-Driven Server Runtime & Streams',        glyph: '⬢',  glyphBg: '#339933', projects: ['Lantern APM', 'Voxa Workspace'], highlight: true },
    { name: 'Express.js', role: 'Modular REST Routing, Rate-Limiting & Auth Middleware',     glyph: 'EX', glyphBg: '#f4f1eb', projects: ['Lantern APM', 'Voxa Workspace'] },
];

const backendQueueSkills: SkillItem[] = [
    { name: 'Redis',               role: 'In-Memory Pub/Sub, Caching & Distributed Locks',       glyph: '◆',  glyphBg: '#dc382d', projects: ['DevLens AI', 'Lantern APM'], highlight: true },
    { name: 'Celery',              role: 'Distributed Python Task Workers & AST Indexing Jobs',  glyph: '🌿', glyphBg: '#37814a', projects: ['DevLens AI'] },
    { name: 'BullMQ',              role: 'Robust Node.js Job Queues, Retries & Telemetry Drain', glyph: '🐂', glyphBg: '#e11d48', projects: ['Lantern APM'], highlight: true },
    { name: 'Socket.IO',           role: 'Bi-Directional Event Rooms & Live APM Dashboards',     glyph: '🔌', glyphBg: '#f4f1eb', projects: ['Lantern APM', 'Voxa Workspace'] },
    { name: 'WebSockets & WebRTC', role: 'Low-Latency P2P Media Streams & Live Cursor Sync',     glyph: '📡', glyphBg: '#2563eb', projects: ['DevLens AI', 'Voxa Workspace'], highlight: true },
];

const languageSkills: SkillItem[] = [
    { name: 'Python',              role: 'AI Pipelines, FastAPI Backends & Async Scripting',     glyph: 'PY', glyphBg: '#3776ab', projects: ['DevLens AI'], highlight: true },
    { name: 'C/C++',               role: 'Memory-Aware Systems, Pointers & Competitive DSA',     glyph: 'C+', glyphBg: '#00599c', highlight: true },
    { name: 'PostgreSQL',          role: 'ACID Relational Storage, Indexing & Vector Queries',   glyph: 'PG', glyphBg: '#336791', projects: ['DevLens AI'], highlight: true },
    { name: 'MongoDB',             role: 'Flexible Document Schemas & Aggregation Pipelines',    glyph: '🍃', glyphBg: '#47a248', projects: ['Voxa Workspace'] },
    { name: 'MySQL',               role: 'Structured Relational Modeling & Joins Optimization',  glyph: 'SQL',glyphBg: '#4479a1' },
    { name: 'InfluxDB',            role: 'High-Ingestion Time-Series Telemetry & Metrics Store', glyph: '📈', glyphBg: '#22adf6', projects: ['Lantern APM'], highlight: true },
    { name: 'DSA & Algorithms',    role: '400+ Problems Solved · Trees, Graphs, DP & Greedy',    glyph: '∑',  glyphBg: '#f59e0b', highlight: true },
    { name: 'System Design & OOP', role: 'SOLID Principles, Scalability, Caching & Sharding',    glyph: '🏛', glyphBg: '#f4f1eb', projects: ['DevLens AI', 'Lantern APM', 'Voxa Workspace'] },
];

// ─── Interactive Skill Pill Component (Image 4 Style with Real Icons) ────────
const pillTilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

function ToolPill({
    item,
    activeProject,
    onHover,
    index = 0,
}: {
    item: SkillItem;
    activeProject: ProjectId;
    onHover: (item: SkillItem) => void;
    index?: number;
}) {
    const isProjectMatch =
        activeProject === 'all' || (item.projects && item.projects.includes(activeProject));
    const tilt = pillTilts[index % pillTilts.length];

    return (
        <div
            onMouseEnter={() => onHover(item)}
            onClick={() => onHover(item)}
            className={`group relative inline-flex items-center gap-2 bg-[#fffdf2] border border-[#111111]/30 px-3 py-1.5 text-xs sm:text-[13px] font-bold text-[#111111] ${tilt} transition-all duration-150 cursor-pointer select-none ${
                isProjectMatch
                    ? 'hover:rotate-0 hover:-translate-y-0.5 hover:bg-[#fef08a] hover:border-[#111111] shadow-[1.5px_1.5px_0_#111111]'
                    : 'opacity-35 grayscale'
            } ${activeProject !== 'all' && isProjectMatch ? 'ring-2 ring-[#111111] bg-[#fef08a]' : ''}`}
        >
            {/* Real Official Brand SVG Icon */}
            <span className="shrink-0 flex items-center justify-center w-4 h-4">
                <SkillIcon name={item.name} className="w-4 h-4 object-contain" />
            </span>

            {/* Tool Name */}
            <span className="tracking-tight">{item.name}</span>

            {/* Core Star Indicator */}
            {item.highlight && (
                <span
                    className="w-1.5 h-1.5 rounded-full bg-[#f3865e] shrink-0"
                    title="Primary Production Stack"
                />
            )}

            {/* Scrapbook Popover Tooltip on Hover */}
            <div
                role="tooltip"
                className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-50 w-56 bg-[#f4f1eb] text-[#111111] p-2.5 border border-[#111111] shadow-[3px_3px_0_#111111] text-left"
            >
                <div className="flex items-center justify-between gap-1 border-b border-[#111111]/20 pb-1 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                        {item.name}
                    </span>
                    {item.projects && item.projects.length > 0 && (
                        <span className="text-[9px] font-bold bg-[#fef08a] border border-[#111111] px-1.5 py-0.5 text-[#111111]">
                            {item.projects[0]}
                        </span>
                    )}
                </div>
                <p className="text-[11px] font-medium text-[#111111]/85 leading-snug">
                    {item.role}
                </p>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#f4f1eb] border-r border-b border-[#111111] rotate-45" />
            </div>
        </div>
    );
}

// ─── Paper Top Strip (Matching Journey's PaperHead, Module Tags Removed) ──────
function WorkbenchPaperHead({
    category,
    icon: Icon,
    headerBg,
}: {
    category: string;
    icon: React.ElementType;
    headerBg: string;
}) {
    return (
        <div
            className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b-[2px] border-[#111111]/20 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase"
            style={{ backgroundColor: headerBg }}
        >
            <span className="inline-flex items-center gap-2 text-[#111111]">
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                {category}
            </span>
        </div>
    );
}

// ─── Main Toolkit Component ──────────────────────────────────────────────────
const Skills = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState<CategoryId>('all');
    const [activeProject, setActiveProject] = useState<ProjectId>('all');
    const [inspectedTool, setInspectedTool] = useState<SkillItem>(frontendSkills[0]);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray('.workbench-chapter');
            gsap.fromTo(
                cards,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.14,
                    ease: 'back.out(1.3)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        },
        { scope: sectionRef, dependencies: [activeFilter] }
    );

    const showCard = (cat: CategoryId) => activeFilter === 'all' || activeFilter === cat;

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="toolkit-scrapbook-section relative w-full bg-[#f3865e] py-16 md:py-24 px-4 sm:px-6 md:px-10 overflow-hidden"
        >
            {/* Subtle Engineering Grid + Scrapbook Floating Illustrations */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="toolkit-bg-grid" />
                <div className="absolute right-3 top-14 w-20 sm:w-28 md:w-36 aspect-square -rotate-12 opacity-90">
                    <Image
                        alt=""
                        src="/images/crab.png"
                        fill
                        className="object-contain drop-shadow-[4px_4px_0px_rgba(17,17,17,0.28)]"
                    />
                </div>
                <div className="absolute left-2 bottom-8 w-24 sm:w-32 md:w-40 aspect-square rotate-6 opacity-90">
                    <Image
                        alt=""
                        src="/images/birdBig.png"
                        fill
                        className="object-contain drop-shadow-[4px_4px_0px_rgba(17,17,17,0.25)]"
                    />
                </div>
            </div>

            <div className="max-w-[1360px] mx-auto relative z-10">
                {/* ── Distinct Architectural Workbench Header ── */}
                <header className="relative mb-10 md:mb-12">
                    {/* Black Horizontal Line */}
                    <div className="w-full border-b-[2.5px] border-[#111111] mb-7" />

                    {/* Header Grid (Left Box + Centered Title, Badge & Handwritten Para) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Left Wing: Tactile Stack Telemetry Spec Card */}
                        <div className="hidden lg:flex lg:col-span-3 flex-col items-start">
                            <div className="w-full bg-[#fffdf2] border-[2.5px] border-[#111111] p-3.5 shadow-[5px_5px_0_#111111] -rotate-2 hover:rotate-0 transition-transform">
                                <div className="flex items-center justify-between border-b-[2px] border-[#111111] pb-1.5 mb-2.5">
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#bbf2f6] px-1.5 py-0.5 border border-[#111111]">
                                        STACK METRICS
                                    </span>
                                    <Cpu className="w-3.5 h-3.5 text-[#111111]" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-left font-mono">
                                    <div className="bg-[#f4f1eb] border border-[#111111] p-1.5">
                                        <span className="block text-[9px] text-[#111111]/60 font-bold">DOMAINS</span>
                                        <span className="font-black text-base text-[#111111]">04 CORE</span>
                                    </div>
                                    <div className="bg-[#f4f1eb] border border-[#111111] p-1.5">
                                        <span className="block text-[9px] text-[#111111]/60 font-bold">ARSENAL</span>
                                        <span className="font-black text-base text-[#111111]">32 TOOLS</span>
                                    </div>
                                </div>
                                <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold text-[#111111]/80">
                                    <span>DSA Foundation:</span>
                                    <span className="font-mono font-black bg-[#fef08a] px-1.5 border border-[#111111]">
                                        400+ Solved
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Center Stage: Badge, Monumental Title & Handwritten Paragraph */}
                        <div className="lg:col-span-6 lg:col-start-4 flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 bg-[#fef08a] border-[2.5px] border-[#111111] px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[3.5px_3.5px_0_#111111] -rotate-1 mb-4">
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                What I Use To Build, Ship &amp; Scale
                            </div>

                            <h1 className="m-0 leading-[0.94] tracking-tight">
                                <LiquidHeading
                                    as="span"
                                    align="center"
                                    words={[
                                        {
                                            text: 'MY ',
                                            className: 'toolkit-title-accent',
                                            style: {
                                                color: '#fffdf2',
                                                textShadow: '4px 4px 0 #111111, 7px 7px 0 #111111',
                                            },
                                        },
                                        {
                                            text: 'TOOLKIT.',
                                            className: 'toolkit-title-accent',
                                            style: {
                                                color: '#fffdf2',
                                                textShadow: '4px 4px 0 #111111, 7px 7px 0 #111111',
                                            },
                                        },
                                    ]}
                                    className="font-black text-4xl min-[380px]:text-5xl sm:text-7xl xl:text-[82px] uppercase select-none"
                                    intensity={1}
                                    speed={1}
                                />
                            </h1>

                            <p className="toolkit-hand-note mt-3 sm:mt-4 text-xl min-[380px]:text-2xl sm:text-[28px] leading-[1.2] max-w-[580px] text-[#111111] -rotate-1">
                                Every framework, message queue, and database below has survived late-night debugging and powers real production architectures.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── Dual Interactive Control Bar: Category Filter + Project Stack X-Ray ── */}
                <div className="border-y-[2.5px] border-[#111111] bg-[#fffdf2]/45 backdrop-blur-xs py-3 px-3 sm:px-4 mb-8 sm:mb-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Category Filter Buttons */}
                    <nav className="flex flex-wrap items-center gap-2" aria-label="Filter toolkit categories">
                        {filterCategories.map(({ id, label, count, dotColor, icon: Icon }) => {
                            const isActive = activeFilter === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() =>
                                        setActiveFilter((prev) => (id === 'all' ? 'all' : prev === id ? 'all' : id))
                                    }
                                    className={`inline-flex items-center gap-2 h-9 px-3.5 text-xs font-extrabold uppercase tracking-wider border-[2px] border-[#111111] transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#fef08a] text-[#111111] -translate-x-0.5 -translate-y-0.5 shadow-[3.5px_3.5px_0_#111111]'
                                            : 'bg-[#f4f1eb] text-[#111111] hover:bg-[#fffdf2] hover:-translate-y-0.5 shadow-[2.5px_2.5px_0_#111111]'
                                    }`}
                                >
                                    {id === 'all' ? (
                                        <Icon className="w-3.5 h-3.5" />
                                    ) : (
                                        <span
                                            className="w-2.5 h-2.5 border border-[#111111] inline-block"
                                            style={{ backgroundColor: dotColor }}
                                        />
                                    )}
                                    <span>{label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 font-mono border border-[#111111]/30 ${
                                            isActive ? 'bg-[#fffdf2] text-[#111111]' : 'bg-[#111111]/10 text-[#111111]'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right: Project Architecture X-Ray Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] flex items-center gap-1 mr-1">
                            <Search className="w-3.5 h-3.5" /> Project X-Ray:
                        </span>
                        {projectFilters.map((proj) => {
                            const isProjActive = activeProject === proj.id;
                            return (
                                <button
                                    key={proj.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveProject((prev) => (proj.id === 'all' ? 'all' : prev === proj.id ? 'all' : proj.id))
                                    }
                                    className={`px-2.5 py-1 text-[11px] font-extrabold border-[2px] border-[#111111] transition-all cursor-pointer ${
                                        isProjActive
                                            ? 'bg-[#fef08a] text-[#111111] shadow-[2.5px_2.5px_0_#111111] -translate-y-0.5'
                                            : 'bg-[#f4f1eb] text-[#111111] hover:bg-[#fffdf2]'
                                    }`}
                                >
                                    {proj.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Scrapbook Bento Grid (Asymmetric 5+7 / 7+5 with Unique Interactive Widgets) ── */}
                <div
                    className={`grid grid-cols-1 ${
                        activeFilter === 'all' ? 'lg:grid-cols-12' : 'lg:grid-cols-1 max-w-3xl mx-auto'
                    } gap-9 lg:gap-8 items-start`}
                >
                    {/* =====================================================================
                        CHAPTER 01: FRONTEND CORE (5 Cols) + Interactive UI Physics Switcher
                       ===================================================================== */}
                    {showCard('frontend') && (
                        <article
                            className={`workbench-chapter ${
                                activeFilter === 'all' ? 'lg:col-span-5 lg:-rotate-[0.8deg]' : ''
                            } relative transition-transform duration-300 hover:rotate-0`}
                        >
                            {/* Corner Stamp Badge */}
                            <div className="absolute -top-3.5 right-4 z-30 bg-[#fef08a] text-[#111111] border-[2px] border-[#111111] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#111111] rotate-3 select-none">
                                UI / UX &amp; CANVAS
                            </div>

                            <div className="bg-[#fffdf2] border-[2px] border-[#111111] shadow-[6px_6px_0_#111111] hover:shadow-[9px_9px_0_#111111] transition-all relative">
                                {/* Washi Tape */}
                                <div className="toolkit-tape" aria-hidden="true" />

                                <WorkbenchPaperHead
                                    category="CLIENT WORKBENCH"
                                    icon={Layers}
                                    headerBg="#bbf2f6"
                                />

                                <div className="p-5 sm:p-6">
                                    {/* Chapter Intro (Matching Journey's Number + Headline Typography) */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                        <span
                                            className="font-extrabold text-[44px] sm:text-[56px] md:text-[68px] leading-none select-none shrink-0"
                                            style={{ color: '#d5d3ca' }}
                                        >
                                            01
                                        </span>
                                        <div>
                                            <h2 className="font-black text-lg sm:text-xl md:text-2xl leading-tight text-[#111111] m-0">
                                                Pixel precision.<br />Fluid interactions.
                                            </h2>
                                            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#111111]/65 mt-1">
                                                REACTIVE INTERFACES · SSR &amp; HTML5 CANVAS
                                            </div>
                                        </div>
                                    </div>

                                    <p className="toolkit-card-description mb-6">
                                        Architecting snappy component trees, zero-layout-shift pages, and real-time collaborative whiteboards.
                                    </p>

                                    {/* Skill Pills (Image 4 Style with Real Icons) */}
                                    <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6">
                                        {frontendSkills.map((skill, idx) => (
                                            <ToolPill
                                                key={skill.name}
                                                item={skill}
                                                index={idx}
                                                activeProject={activeProject}
                                                onHover={setInspectedTool}
                                            />
                                        ))}
                                    </div>

                                    {/* Metric Footer (Like Journey's CGPA Footer) */}
                                    <div className="pt-3.5 border-t-[2px] border-dashed border-[#111111]/25 flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#111111]/60">
                                                RENDER TARGET
                                            </span>
                                            <span className="font-black text-xl sm:text-2xl text-[#111111]">
                                                60 <small className="text-xs font-bold text-[#111111]/65">FPS / SSR</small>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="toolkit-hand-note text-lg sm:text-xl text-[#111111] -rotate-3">
                                                Snappy by default!
                                            </span>
                                            <span className="bg-[#bbf2f6] text-[#111111] border-[2px] border-[#111111] px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_#111111]">
                                                08 TOOLS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Handwritten Caption Under Card */}
                            <div className="mt-2.5 px-1 flex items-center justify-between text-[#111111]">
                                <span className="toolkit-hand-note text-2xl -rotate-1">
                                    Where design meets the browser.
                                </span>
                                <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
                            </div>
                        </article>
                    )}

                    {/* =====================================================================
                        CHAPTER 02: AI & CLOUD (7 Cols) + Interactive RAG & Deploy Stepper
                       ===================================================================== */}
                    {showCard('aicloud') && (
                        <article
                            className={`workbench-chapter ${
                                activeFilter === 'all' ? 'lg:col-span-7 lg:mt-6 lg:rotate-[0.7deg]' : ''
                            } relative transition-transform duration-300 hover:rotate-0`}
                        >
                            {/* Corner Stamp Badge (Off-White + Black Font) */}
                            <div className="absolute -top-3.5 right-4 z-30 bg-[#f4f1eb] text-[#111111] border-[2px] border-[#111111] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#111111] -rotate-2 select-none">
                                ✨ AGENTIC AI &amp; CLOUD OPS
                            </div>

                            <div className="bg-[#fffdf2] border-[2px] border-[#111111] shadow-[6px_6px_0_#111111] hover:shadow-[9px_9px_0_#111111] transition-all relative">
                                {/* Washi Tape */}
                                <div className="toolkit-tape" aria-hidden="true" />

                                <WorkbenchPaperHead
                                    category="AUTONOMOUS & CLOUD INFRA"
                                    icon={Sparkles}
                                    headerBg="#fecdd3"
                                />

                                <div className="p-5 sm:p-6">
                                    {/* Chapter Intro */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                        <span
                                            className="font-extrabold text-[44px] sm:text-[56px] md:text-[68px] leading-none select-none shrink-0"
                                            style={{ color: '#d5d3ca' }}
                                        >
                                            02
                                        </span>
                                        <div>
                                            <h2 className="font-black text-lg sm:text-xl md:text-2xl leading-tight text-[#111111] m-0">
                                                Smart agents.<br />Bulletproof shipping.
                                            </h2>
                                            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#111111]/65 mt-1">
                                                LLM ORCHESTRATION · VECTOR RAG &amp; CONTAINERS
                                            </div>
                                        </div>
                                    </div>

                                    <p className="toolkit-card-description mb-6">
                                        Building context-grounded AI agents that reason over real codebases, backed by reproducible Docker &amp; AWS pipelines.
                                    </p>

                                    {/* 2 Clustered Sub-Groups with Image 4 Style Pills */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-[#fff5f6]/70 p-3.5 border border-[#111111]/20">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5 mb-3">
                                                <Cpu className="w-3.5 h-3.5" /> GenAI &amp; Agentic Stack
                                            </span>
                                            <div className="flex flex-wrap gap-2.5">
                                                {aiSkills.map((skill, idx) => (
                                                    <ToolPill
                                                        key={skill.name}
                                                        item={skill}
                                                        index={idx}
                                                        activeProject={activeProject}
                                                        onHover={setInspectedTool}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-[#fff5f6]/70 p-3.5 border border-[#111111]/20">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5 mb-3">
                                                <Cloud className="w-3.5 h-3.5" /> Cloud Ops &amp; CI/CD
                                            </span>
                                            <div className="flex flex-wrap gap-2.5">
                                                {cloudSkills.map((skill, idx) => (
                                                    <ToolPill
                                                        key={skill.name}
                                                        item={skill}
                                                        index={idx + 4}
                                                        activeProject={activeProject}
                                                        onHover={setInspectedTool}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-3.5 border-t-[2px] border-dashed border-[#111111]/25 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#111111]">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#111111] animate-pulse" />
                                            <span>AWS Certified &amp; IBM RAG Verified</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="toolkit-hand-note text-xl text-[#111111] rotate-2">
                                                Grounded context &gt; hype.
                                            </span>
                                            <span className="bg-[#fecdd3] text-[#111111] border-[2px] border-[#111111] px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_#111111]">
                                                08 TOOLS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Handwritten Caption */}
                            <div className="mt-2.5 px-1 flex items-center justify-between text-[#111111]">
                                <span className="toolkit-hand-note text-2xl rotate-1">
                                    Prompts in, production out.
                                </span>
                                <Sparkles className="w-5 h-5 stroke-[2.2]" />
                            </div>
                        </article>
                    )}

                    {/* =====================================================================
                        CHAPTER 03: BACKEND & INFRA (7 Cols) + Live Cluster Ping Simulator
                       ===================================================================== */}
                    {showCard('backend') && (
                        <article
                            className={`workbench-chapter ${
                                activeFilter === 'all' ? 'lg:col-span-7 lg:-mt-2 lg:rotate-[0.6deg]' : ''
                            } relative transition-transform duration-300 hover:rotate-0`}
                        >
                            {/* Corner Stamp Badge */}
                            <div className="absolute -top-3.5 right-4 z-30 bg-[#bbf2f6] text-[#111111] border-[2px] border-[#111111] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#111111] rotate-2 select-none">
                                ⚡ HIGH THROUGHPUT
                            </div>

                            <div className="bg-[#fffdf2] border-[2px] border-[#111111] shadow-[6px_6px_0_#111111] hover:shadow-[9px_9px_0_#111111] transition-all relative">
                                {/* Washi Tape */}
                                <div className="toolkit-tape" aria-hidden="true" />

                                <WorkbenchPaperHead
                                    category="DISTRIBUTED & ASYNC BACKEND"
                                    icon={Server}
                                    headerBg="#fef08a"
                                />

                                <div className="p-5 sm:p-6">
                                    {/* Chapter Intro */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                        <span
                                            className="font-extrabold text-[44px] sm:text-[56px] md:text-[68px] leading-none select-none shrink-0"
                                            style={{ color: '#d5d3ca' }}
                                        >
                                            03
                                        </span>
                                        <div>
                                            <h2 className="font-black text-lg sm:text-xl md:text-2xl leading-tight text-[#111111] m-0">
                                                Low latency.<br />High throughput.
                                            </h2>
                                            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#111111]/65 mt-1">
                                                ASYNC APIS · MESSAGE QUEUES &amp; WEBSOCKETS
                                            </div>
                                        </div>
                                    </div>

                                    <p className="toolkit-card-description mb-6">
                                        Designing non-blocking APIs, background job queues, and bi-directional socket streams that stay resilient under heavy load.
                                    </p>

                                    {/* 2 Sub-Columns with Image 4 Style Pills */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                                        <div className="md:col-span-5 bg-[#fefce8] p-3 sm:p-3.5 border border-[#111111]/20">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block mb-3">
                                                Runtime &amp; APIs
                                            </span>
                                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                                {backendRuntimeSkills.map((skill, idx) => (
                                                    <ToolPill
                                                        key={skill.name}
                                                        item={skill}
                                                        index={idx}
                                                        activeProject={activeProject}
                                                        onHover={setInspectedTool}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-7 bg-[#fefce8] p-3 sm:p-3.5 border border-[#111111]/20">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-[#111111] block mb-3">
                                                Queues, Caching &amp; Realtime
                                            </span>
                                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                                {backendQueueSkills.map((skill, idx) => (
                                                    <ToolPill
                                                        key={skill.name}
                                                        item={skill}
                                                        index={idx + 3}
                                                        activeProject={activeProject}
                                                        onHover={setInspectedTool}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-3.5 border-t-[2px] border-dashed border-[#111111]/25 flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-xs font-extrabold text-[#111111]">
                                            Concurrency, Pub/Sub &amp; Event-Driven Pipelines
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="toolkit-hand-note text-lg sm:text-xl text-[#111111] -rotate-2">
                                                Zero blocking calls!
                                            </span>
                                            <span className="bg-[#fef08a] text-[#111111] border-[2px] border-[#111111] px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_#111111]">
                                                08 TOOLS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Handwritten Caption */}
                            <div className="mt-2.5 px-1 flex items-center justify-between text-[#111111]">
                                <span className="toolkit-hand-note text-2xl -rotate-1">
                                    Built for the traffic spike.
                                </span>
                                <Zap className="w-5 h-5 stroke-[2.2]" />
                            </div>
                        </article>
                    )}

                    {/* =====================================================================
                        CHAPTER 04: LANGUAGES & DATABASES (5 Cols) + Storage Query Switcher
                       ===================================================================== */}
                    {showCard('languages') && (
                        <article
                            className={`workbench-chapter ${
                                activeFilter === 'all' ? 'lg:col-span-5 lg:mt-4 lg:-rotate-[0.9deg]' : ''
                            } relative transition-transform duration-300 hover:rotate-0`}
                        >
                            {/* Corner Stamp Badge */}
                            <div className="absolute -top-3.5 right-4 z-30 bg-[#dcfce7] text-[#111111] border-[2px] border-[#111111] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#111111] rotate-3 select-none">
                                CORE ENGINE &amp; DATA
                            </div>

                            <div className="bg-[#fffdf2] border-[2px] border-[#111111] shadow-[6px_6px_0_#111111] hover:shadow-[9px_9px_0_#111111] transition-all relative">
                                {/* Washi Tape */}
                                <div className="toolkit-tape" aria-hidden="true" />

                                <WorkbenchPaperHead
                                    category="LANGUAGES & PERSISTENCE"
                                    icon={Database}
                                    headerBg="#dcfce7"
                                />

                                <div className="p-5 sm:p-6">
                                    {/* Chapter Intro */}
                                    <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                        <span
                                            className="font-extrabold text-[44px] sm:text-[56px] md:text-[68px] leading-none select-none shrink-0"
                                            style={{ color: '#d5d3ca' }}
                                        >
                                            04
                                        </span>
                                        <div>
                                            <h2 className="font-black text-lg sm:text-xl md:text-2xl leading-tight text-[#111111] m-0">
                                                Strong types.<br />Zero bottlenecks.
                                            </h2>
                                            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase text-[#111111]/65 mt-1">
                                                POLYGLOT SYSTEMS · SQL, NOSQL &amp; TIME-SERIES
                                            </div>
                                        </div>
                                    </div>

                                    <p className="toolkit-card-description mb-6">
                                        Choosing the right data model for the job—backed by 400+ algorithmic problems solved and strict complexity discipline.
                                    </p>

                                    {/* Skill Pills (Image 4 Style with Real Icons) */}
                                    <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-6">
                                        {languageSkills.map((skill, idx) => (
                                            <ToolPill
                                                key={skill.name}
                                                item={skill}
                                                index={idx}
                                                activeProject={activeProject}
                                                onHover={setInspectedTool}
                                            />
                                        ))}
                                    </div>

                                    {/* Sticky Note + Metric Footer (Like Journey's Achievement Streak Card) */}
                                    <div className="pt-3.5 border-t-[2px] border-dashed border-[#111111]/25 flex flex-wrap items-center justify-between gap-2">
                                        <div className="bg-[#fef08a] border-[2px] border-[#111111] px-3 py-1.5 shadow-[3px_3px_0_#111111] -rotate-2">
                                            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#111111]/70">
                                                ALGORITHMIC GRIND
                                            </span>
                                            <span className="font-black text-base text-[#111111]">
                                                <CountUp value={436} duration={1.8} />+ <small className="text-[10px] font-bold">SOLVED</small>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="toolkit-hand-note text-lg sm:text-xl text-[#111111] rotate-2">
                                                O(1) mindset!
                                            </span>
                                            <span className="bg-[#dcfce7] border-[2px] border-[#111111] px-2.5 py-1 text-[10px] font-black uppercase shadow-[2px_2px_0_#111111]">
                                                08 TOOLS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Handwritten Caption */}
                            <div className="mt-2.5 px-1 flex items-center justify-between text-[#111111]">
                                <span className="toolkit-hand-note text-2xl rotate-1">
                                    The bedrock underneath it all.
                                </span>
                                <Braces className="w-5 h-5 stroke-[2.2]" />
                            </div>
                        </article>
                    )}
                </div>

                {/* ── Bottom Note (Matching Journey's Closing Note) ── */}
                <div className="mt-12 flex items-center justify-center gap-3 select-none">
                    <Asterisk className="w-6 h-6 text-[#111111] stroke-[2.5]" />
                    <span className="toolkit-hand-note text-2xl sm:text-3xl bg-[#fffdf2] border-[2px] border-[#111111] px-5 py-1.5 shadow-[4px_4px_0_#111111] -rotate-2 text-[#111111]">
                        Always learning the next tool when the problem demands it.
                    </span>
                </div>
            </div>

            {/* Scoped Typography & Scrapbook Styles */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap');

                .toolkit-scrapbook-section {
                    font-family: var(--font-space-grotesk, 'Space Grotesk', sans-serif);
                }

                .toolkit-card-description {
                    font-family: var(--font-caveat, 'Caveat', cursive);
                    font-size: 23px;
                    line-height: 1.35;
                    font-weight: 600;
                    color: #111111;
                }

                @media (max-width: 640px) {
                    .toolkit-card-description {
                        font-size: 20px;
                    }
                }

                .toolkit-bg-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(to right, rgba(17, 17, 17, 0.065) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(17, 17, 17, 0.065) 1px, transparent 1px);
                    background-size: 36px 36px;
                }

                .toolkit-hand-note {
                    font-family: var(--font-caveat, 'Caveat', cursive);
                    font-weight: 700;
                    line-height: 1.1;
                    display: inline-block;
                }

                .toolkit-tape {
                    position: absolute;
                    top: -13px;
                    left: 50%;
                    width: 112px;
                    height: 26px;
                    transform: translateX(-50%) rotate(-1.5deg);
                    background: rgba(255, 255, 255, 0.72);
                    border-left: 2px dashed rgba(17, 17, 17, 0.28);
                    border-right: 2px dashed rgba(17, 17, 17, 0.28);
                    box-shadow: 0 2px 4px rgba(17, 17, 17, 0.08);
                    backdrop-filter: blur(2px);
                    z-index: 25;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default Skills;
