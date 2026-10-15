'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import {
    Layers,
    Cpu,
    Server,
    Database,
    Sparkles,
    Zap,
    Terminal,
    Code2,
    Wrench,
    ArrowUpRight,
    CheckCircle2,
    Asterisk,
    Flame,
    Box,
    Workflow,
    Braces,
    Cloud,
    Activity,
} from 'lucide-react';
import SVGPathAnimation from '@/app/components/SVGPathAnimation';
import LiquidHeading from '@/app/components/LiquidHeading';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });

// ─── Filter Categories ───────────────────────────────────────────────────────
export const toolkitCategories = [
    { id: 'all',       label: 'All Stack (32)',        icon: Zap,      count: 32 },
    { id: 'frontend',  label: 'Frontend',              icon: Layers,   count: 8  },
    { id: 'ai',        label: 'AI & Cloud',            icon: Sparkles, count: 8  },
    { id: 'backend',   label: 'Backend & Infra',       icon: Server,   count: 8  },
    { id: 'languages', label: 'Languages & Databases', icon: Database, count: 8  },
] as const;

export type ToolkitCategory = typeof toolkitCategories[number]['id'];

// ─── Shared Paper Header Sub-component ───────────────────────────────────────
function PaperHead({
    category,
    tag,
    icon: Icon,
}: {
    category: string;
    tag: string;
    icon: React.ElementType;
}) {
    return (
        <div className="paper-head">
            <span className="category-tag">
                <Icon />
                {category}
            </span>
            <span className="head-code">{tag}</span>
        </div>
    );
}

// ─── Interactive Skill Pill Sub-component ────────────────────────────────────
function SkillPill({
    name,
    role,
    accentColor,
}: {
    name: string;
    role: string;
    accentColor: string;
}) {
    return (
        <div
            className="skill-pill"
            style={{ '--pill-accent': accentColor } as React.CSSProperties}
        >
            <span className="pill-dot" aria-hidden="true" />
            <span className="pill-name">{name}</span>
            <span className="pill-tooltip" role="tooltip">
                {role}
            </span>
        </div>
    );
}

// ─── 01. FRONTEND CORE ───────────────────────────────────────────────────────
export function FrontendWorkbench() {
    const tools = [
        { name: 'React.js',       role: 'Component Architecture & Hooks' },
        { name: 'Next.js',        role: 'App Router, SSR & Edge Routes' },
        { name: 'TypeScript',     role: 'Strict Type-Safe Interfaces' },
        { name: 'JavaScript',     role: 'ES6+ Async Runtime & DOM' },
        { name: 'Tailwind CSS',   role: 'Utility-First Design System' },
        { name: 'Fabric.js',      role: 'Interactive HTML5 Canvas Engine' },
        { name: 'HTML5 & CSS3',   role: 'Semantic Markup & Keyframes' },
        { name: 'Responsive UI',  role: 'Fluid Multi-Device Layouts' },
    ];

    return (
        <article className="toolkit-chapter frontend" aria-label="Frontend Core">
            <div className="corner-badge">UI / UX CORE</div>
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead
                    category="CLIENT WORKBENCH"
                    tag="MODULE // 01"
                    icon={Layers}
                />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">01</span>
                        <div>
                            <h2>
                                Pixel precision.<br />
                                Fluid interactions.
                            </h2>
                            <div className="org">
                                FRONTEND CORE · REACTIVE INTERFACES &amp; CANVAS SYSTEMS
                            </div>
                        </div>
                    </div>

                    <p className="chapter-description">
                        Architecting reactive interfaces, dynamic component trees, and tactile web experiences that feel snappy from the first paint.
                    </p>

                    <div className="code-sample">
                        <span className="code-keyword">&lt;Canvas</span>{' '}
                        <span className="code-prop">engine</span>=&quot;Fabric.js&quot;{' '}
                        <span className="code-prop">fps</span>={'{60}'}{' '}
                        <span className="code-prop">state</span>=&quot;reactive&quot;{' '}
                        <span className="code-keyword">/&gt;</span>
                    </div>

                    <div className="sub-group-label">
                        <Code2 size={13} /> INTERFACE &amp; RENDERING STACK
                    </div>
                    <div className="pill-grid">
                        {tools.map((t) => (
                            <SkillPill
                                key={t.name}
                                name={t.name}
                                role={t.role}
                                accentColor="#cbf0f8"
                            />
                        ))}
                    </div>

                    <div className="card-footer">
                        <div className="footer-status">
                            <span className="status-dot cyan" />
                            <span>Primary Client Workbench</span>
                        </div>
                        <div className="footer-right">
                            <span className="hand-note-small">60fps or bust!</span>
                            <span className="item-count-badge">8 ITEMS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Where design meets the browser.</span>
                <ArrowUpRight aria-hidden="true" />
            </div>
        </article>
    );
}

// ─── 02. AI & CLOUD ──────────────────────────────────────────────────────────
export function AiCloudWorkbench() {
    const genAiTools = [
        { name: 'LangChain',             role: 'Agentic Chains & Tool Calling' },
        { name: 'RAG & Embeddings',      role: 'Vector Retrieval & Grounding' },
        { name: 'OpenAI API',            role: 'LLM Completions & Structured Outputs' },
        { name: 'Claude Code & Copilot', role: 'AI-Augmented Engineering Workflows' },
    ];

    const cloudTools = [
        { name: 'AWS Cloud',           role: 'EC2, S3, Lambda & IAM Infra' },
        { name: 'Docker',              role: 'Deterministic Container Images' },
        { name: 'CI/CD Pipelines',     role: 'Automated Build & Zero-Downtime Deploy' },
        { name: 'Git / GitHub Actions', role: 'Version Control & Workflow Runners' },
    ];

    return (
        <article className="toolkit-chapter ai" aria-label="AI and Cloud">
            <div className="corner-badge accent">⚡ INTELLIGENT INFRA</div>
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead
                    category="AUTONOMOUS & CLOUD"
                    tag="MODULE // 02"
                    icon={Sparkles}
                />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">02</span>
                        <div>
                            <h2>
                                Smart agents.<br />
                                Bulletproof shipping.
                            </h2>
                            <div className="org">
                                AI &amp; CLOUD · LLM PIPELINES &amp; CONTAINER INFRASTRUCTURE
                            </div>
                        </div>
                    </div>

                    <p className="chapter-description">
                        Deploying context-aware RAG workflows, autonomous agent loops, and reproducible Dockerized infrastructure in the cloud.
                    </p>

                    <div className="split-compartments">
                        <div className="compartment">
                            <div className="compartment-header">
                                <Sparkles size={13} />
                                <span>GENERATIVE AI &amp; AGENTIC STACK</span>
                            </div>
                            <div className="pill-grid">
                                {genAiTools.map((t) => (
                                    <SkillPill
                                        key={t.name}
                                        name={t.name}
                                        role={t.role}
                                        accentColor="#ffb7b2"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="compartment">
                            <div className="compartment-header">
                                <Cloud size={13} />
                                <span>CLOUD OPS &amp; CI/CD</span>
                            </div>
                            <div className="pill-grid">
                                {cloudTools.map((t) => (
                                    <SkillPill
                                        key={t.name}
                                        name={t.name}
                                        role={t.role}
                                        accentColor="#ffb7b2"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="footer-status">
                            <span className="status-dot green pulse" />
                            <span>Autoscaling &amp; Containerized</span>
                        </div>
                        <div className="footer-right">
                            <span className="hand-note-small">Prompts to prod.</span>
                            <span className="item-count-badge">8 ITEMS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Teaching code to think &amp; scale.</span>
                <Sparkles aria-hidden="true" />
            </div>
        </article>
    );
}

// ─── 03. BACKEND & INFRA ─────────────────────────────────────────────────────
export function BackendWorkbench() {
    const runtimeTools = [
        { name: 'FastAPI',    role: 'High-Performance Async Python APIs' },
        { name: 'Express.js', role: 'Modular REST & Middleware Routing' },
        { name: 'Node.js',    role: 'Event-Driven V8 Server Runtime' },
    ];

    const queueTools = [
        { name: 'Celery',               role: 'Distributed Task Queue Workers' },
        { name: 'Redis',                role: 'In-Memory Pub/Sub & Caching Layer' },
        { name: 'BullMQ',               role: 'Robust Node.js Job Scheduling' },
        { name: 'Socket.IO',            role: 'Bi-Directional Event Rooms' },
        { name: 'WebSockets & WebRTC',  role: 'Sub-Second Streaming & P2P Media' },
    ];

    return (
        <article className="toolkit-chapter backend" aria-label="Backend and Infrastructure">
            <div className="corner-badge">HIGH THROUGHPUT</div>
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead
                    category="SYSTEMS & PIPELINES"
                    tag="MODULE // 03"
                    icon={Server}
                />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">03</span>
                        <div>
                            <h2>
                                Async workers.<br />
                                Zero bottlenecks.
                            </h2>
                            <div className="org">
                                BACKEND &amp; INFRA · EVENT PIPELINES &amp; REALTIME SOCKETS
                            </div>
                        </div>
                    </div>

                    <p className="chapter-description">
                        Constructing resilient microservices, background worker queues, and low-latency WebSocket channels that handle heavy lifting without blocking.
                    </p>

                    <div className="dual-blueprint-grid">
                        <div className="blueprint-box">
                            <div className="blueprint-title">
                                <Terminal size={13} />
                                <span>RUNTIME &amp; APIS</span>
                            </div>
                            <div className="pill-grid">
                                {runtimeTools.map((t) => (
                                    <SkillPill
                                        key={t.name}
                                        name={t.name}
                                        role={t.role}
                                        accentColor="#fef3c7"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="blueprint-box">
                            <div className="blueprint-title">
                                <Workflow size={13} />
                                <span>QUEUES &amp; REALTIME</span>
                            </div>
                            <div className="pill-grid">
                                {queueTools.map((t) => (
                                    <SkillPill
                                        key={t.name}
                                        name={t.name}
                                        role={t.role}
                                        accentColor="#fef3c7"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="code-sample">
                        <span className="code-keyword">Client</span> &rarr;{' '}
                        <span className="code-prop">FastAPI</span> &rarr;{' '}
                        <span className="code-prop">Redis Broker</span> &rarr;{' '}
                        <span className="code-keyword">Celery Worker</span> &rarr;{' '}
                        <span className="code-prop">Socket.IO</span>
                    </div>

                    <div className="card-footer">
                        <div className="footer-status">
                            <span className="status-dot amber" />
                            <span>Concurrency &amp; Async Architectures</span>
                        </div>
                        <div className="footer-right">
                            <span className="hand-note-small">Sub-ms vibes.</span>
                            <span className="item-count-badge">8 ITEMS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>The engine room under the hood.</span>
                <Activity aria-hidden="true" />
            </div>
        </article>
    );
}

// ─── 04. LANGUAGES & DATABASES ───────────────────────────────────────────────
export function LanguagesDatabaseWorkbench() {
    const tools = [
        { name: 'Python',               role: 'AI Pipelines, FastAPI & Scripting' },
        { name: 'C/C++',                role: 'Memory-Safe DSA & Competitive Speed' },
        { name: 'PostgreSQL',           role: 'ACID Relational Storage & Indexing' },
        { name: 'MongoDB',              role: 'Flexible Document Aggregations' },
        { name: 'MySQL',                role: 'Structured Relational Transactions' },
        { name: 'InfluxDB',             role: 'High-Ingestion Time-Series Metrics' },
        { name: 'DSA & Algorithms',     role: 'Trees, Graphs & Optimal Complexity' },
        { name: 'System Design & OOP',  role: 'Scalable Patterns & Clean Contracts' },
    ];

    return (
        <article className="toolkit-chapter languages" aria-label="Languages and Databases">
            <div className="corner-badge mint">CORE ENGINE</div>
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead
                    category="FOUNDATION & DATA"
                    tag="MODULE // 04"
                    icon={Database}
                />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">04</span>
                        <div>
                            <h2>
                                Strong types.<br />
                                Clean schemas.
                            </h2>
                            <div className="org">
                                LANGUAGES &amp; DATABASES · PERSISTENCE &amp; CORE CS
                            </div>
                        </div>
                    </div>

                    <p className="chapter-description">
                        Core programming languages, multi-model persistence layers, and the algorithmic fundamentals that keep queries fast and architectures clean.
                    </p>

                    <div className="storage-paradigms">
                        <div className="paradigm-chip">
                            <strong>SQL</strong>
                            <span>Relational ACID</span>
                        </div>
                        <div className="paradigm-chip">
                            <strong>NoSQL</strong>
                            <span>Document Store</span>
                        </div>
                        <div className="paradigm-chip">
                            <strong>TSDB</strong>
                            <span>Time-Series</span>
                        </div>
                        <div className="paradigm-chip">
                            <strong>O(log n)</strong>
                            <span>DSA Optimized</span>
                        </div>
                    </div>

                    <div className="pill-grid">
                        {tools.map((t) => (
                            <SkillPill
                                key={t.name}
                                name={t.name}
                                role={t.role}
                                accentColor="#e2f0cb"
                            />
                        ))}
                    </div>

                    <div className="card-footer">
                        <div className="footer-status">
                            <span className="status-dot emerald" />
                            <span>Relational · Document · Time-series</span>
                        </div>
                        <div className="footer-right">
                            <span className="hand-note-small"> rock solid.</span>
                            <span className="item-count-badge">8 ITEMS</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Fundamentals never go out of style.</span>
                <Braces aria-hidden="true" />
            </div>
        </article>
    );
}

// ─── Main Toolkit Component ──────────────────────────────────────────────────
export default function Toolkit() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<ToolkitCategory>('all');
    const show = (category: ToolkitCategory) => filter === 'all' || filter === category;

    const activeCategoryObj = toolkitCategories.find((c) => c.id === filter) || toolkitCategories[0];

    useGSAP(
        () => {
            const cards = gsap.utils.toArray('.toolkit-chapter');
            gsap.fromTo(
                cards,
                { y: 55, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.72,
                    stagger: 0.15,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        },
        { scope: sectionRef, dependencies: [filter] }
    );

    return (
        <section ref={sectionRef} className="toolkit-page" id="toolkit">
            {/* Subtle Engineering Blueprint Grid & Decorative Illustrations */}
            <div
                className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
            >
                <div className="blueprint-bg-grid" />
                <div className="absolute right-4 top-20 w-20 sm:w-28 md:w-36 aspect-square -rotate-12 opacity-90">
                    <Image
                        alt=""
                        src="/images/crab.png"
                        fill
                        className="object-contain drop-shadow-[4px_4px_0px_rgba(17,17,17,0.28)]"
                    />
                </div>
                <div className="absolute left-2 bottom-6 w-24 sm:w-32 md:w-40 aspect-square rotate-6 opacity-90">
                    <Image
                        alt=""
                        src="/images/birdBig.png"
                        fill
                        className="object-contain drop-shadow-[4px_4px_0px_rgba(17,17,17,0.25)]"
                    />
                </div>
            </div>

            <div className="toolkit-main relative z-10">
                {/* ── Heading ── */}
                <header className="toolkit-heading">
                    <div className="eyebrow">THE ENGINEERING WORKBENCH / 32 TOOLS IN ROTATION</div>
                    <h1>
                        <LiquidHeading
                            as="span"
                            align="left"
                            words={[
                                {
                                    text: 'MY ',
                                    style: {
                                        color: '#111111',
                                        textShadow: 'none',
                                    },
                                },
                                {
                                    text: 'TOOLKIT.',
                                    className: 'toolkit-highlight',
                                    style: {
                                        color: '#fffdf2',
                                        textShadow: '4px 4px 0 #111111',
                                    },
                                },
                            ]}
                            intensity={1}
                            speed={1}
                        />
                    </h1>

                    <div className="heading-bottom">
                        <div className="subtitle-placa">
                            <Wrench size={15} />
                            <span>What I use to build, ship &amp; scale the web.</span>
                        </div>
                        <p>
                            Not just a list of buzzwords. Every framework, queue, and database here has survived late-night debugging and real production workloads.
                        </p>
                    </div>

                    <div className="heading-note">
                        <span className="hand-note">
                            Hover any tool to<br />
                            see how I use it!
                        </span>
                        <div className="arrow-container">
                            <SVGPathAnimation
                                svgPath="M10 8C70 0 80 27 43 35C10 42 15 16 45 24C79 35 83 46 79 61M67 52l12 10 9-15"
                                customViewBox="0 0 100 80"
                                bgColor="rgba(17, 17, 17, 0.22)"
                                animColor="#fef08a"
                                strokeWidth={3}
                                lineCap="round"
                                trigger="inView"
                                playback="once"
                                autoDuration={1.6}
                                highlightGlow={true}
                                replayOnHover={true}
                            />
                        </div>
                        <span className="chapter-label">04 WORKBENCHES · 32 TOOLS</span>
                    </div>
                </header>

                {/* ── Filter Bar ── */}
                <nav className="filter-bar" aria-label="Filter toolkit categories">
                    <div className="filters">
                        {toolkitCategories.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                className="scrap-filter"
                                data-active={filter === id}
                                aria-pressed={filter === id}
                                onClick={() => setFilter(id)}
                            >
                                {id === 'all' ? (
                                    <Icon className="w-3.5 h-3.5 text-[#F18961]" />
                                ) : (
                                    <span className={`filter-dot ${id}`} aria-hidden="true" />
                                )}
                                {label}
                            </button>
                        ))}
                    </div>
                    <span className="filter-count" aria-live="polite">
                        SHOWING {String(activeCategoryObj.count).padStart(2, '0')} / 32 SPECS
                    </span>
                </nav>

                {/* ── Scrap Board Grid ── */}
                <div
                    className={`scrap-board ${filter !== 'all' ? 'filtered' : ''}`}
                    aria-label="Toolkit modules"
                >
                    {show('frontend') && <FrontendWorkbench />}
                    {show('ai') && <AiCloudWorkbench />}
                    {show('backend') && <BackendWorkbench />}
                    {show('languages') && <LanguagesDatabaseWorkbench />}
                </div>

                {/* ── Bottom Note ── */}
                <div className="bottom-note">
                    <Asterisk aria-hidden="true" />
                    <span className="hand-note">
                        Always picking up the right tool for the job.
                    </span>
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                        <path
                            d="m5 31 27-25 3 5L10 36l-5-5Zm0 0-2 7 7-2"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* ── Scoped CSS ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

                .toolkit-page {
                    --font-sans: var(--font-space-grotesk, 'Space Grotesk', sans-serif);
                    --font-hand: var(--font-caveat, 'Caveat', cursive);
                    --background: #F18961;
                    --foreground: #111111;
                    --card: #fffdf2;
                    --primary: #F18961;
                    --accent: #fef08a;
                    --border: #111111;
                    --muted-foreground: rgba(17, 17, 17, 0.68);
                    --frontend: #cbf0f8;
                    --ai: #ffb7b2;
                    --backend: #fef3c7;
                    --languages: #e2f0cb;
                    --tape: rgba(255, 255, 255, 0.72);
                    --shadow-paper: 6px 7px 0 var(--foreground);
                    --shadow-lift: 10px 12px 0 var(--foreground);

                    min-height: 100vh;
                    background-color: var(--background);
                    color: var(--foreground);
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-sans);
                }

                .blueprint-bg-grid {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(to right, rgba(17, 17, 17, 0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(17, 17, 17, 0.06) 1px, transparent 1px);
                    background-size: 36px 36px;
                }

                .toolkit-main {
                    max-width: 1240px;
                    margin: auto;
                    padding: 64px 40px 0;
                }

                /* ── Header Styling ── */
                .toolkit-heading {
                    position: relative;
                    margin-bottom: 44px;
                }

                .eyebrow {
                    font-size: 13px;
                    font-weight: 800;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 16px;
                    letter-spacing: 0.07em;
                    background: var(--card);
                    padding: 5px 12px;
                    border: 1.5px solid var(--border);
                    box-shadow: 2.5px 2.5px 0 var(--foreground);
                }

                .eyebrow::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: var(--accent);
                    border: 1.5px solid var(--border);
                }

                .toolkit-heading h1 {
                    margin: 0;
                    font-size: clamp(54px, 8vw, 94px);
                    line-height: 0.98;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }

                .heading-bottom {
                    margin-top: 24px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 24px 36px;
                }

                .subtitle-placa {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    background: var(--accent);
                    border: 2px solid var(--border);
                    padding: 9px 18px;
                    font-weight: 800;
                    font-size: 15px;
                    box-shadow: 4px 4px 0 var(--foreground);
                    transform: rotate(-1.5deg);
                }

                .heading-bottom p {
                    font-size: 15px;
                    line-height: 1.75;
                    margin: 0;
                    max-width: 510px;
                    color: #111111;
                    font-weight: 600;
                }

                .hand-note {
                    font-family: var(--font-hand);
                    font-size: 29px;
                    line-height: 1.12;
                    font-weight: 700;
                    transform: rotate(-6deg);
                    color: var(--foreground);
                }

                .heading-note {
                    position: absolute;
                    right: 20px;
                    top: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    user-select: none;
                }

                .heading-note .hand-note {
                    font-size: 31px;
                    text-align: center;
                }

                .heading-note .arrow-container {
                    width: 105px;
                    height: 70px;
                    transform: rotate(12deg);
                    margin-left: 32px;
                }

                .chapter-label {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    padding: 7px 12px;
                    border: 1.5px solid var(--border);
                    background: var(--card);
                    transform: rotate(2.5deg);
                    margin-top: 4px;
                    box-shadow: 3px 3px 0 var(--foreground);
                }

                /* ── Filter Bar ── */
                .filter-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 2px solid var(--border);
                    border-bottom: 2px solid var(--border);
                    background: rgba(255, 253, 242, 0.35);
                    backdrop-filter: blur(4px);
                    padding: 14px 18px;
                    margin-bottom: 52px;
                    gap: 20px;
                }

                .filters {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .scrap-filter {
                    border-radius: 0;
                    font-size: 12.5px;
                    height: 36px;
                    padding: 0 15px;
                    border: 1.5px solid var(--border);
                    background: var(--card);
                    font-weight: 800;
                    box-shadow: 2.5px 2.5px 0 var(--foreground);
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-transform: uppercase;
                    transition: all 0.15s ease;
                    color: var(--foreground);
                }

                .scrap-filter:hover {
                    transform: translate(-1.5px, -1.5px);
                    box-shadow: 4px 4px 0 var(--foreground);
                    background: var(--accent);
                }

                .scrap-filter[data-active=true] {
                    background: var(--foreground);
                    color: var(--card);
                    border-color: var(--border);
                    box-shadow: 3.5px 3.5px 0 var(--accent);
                    transform: translate(-1px, -1px);
                }

                .filter-dot {
                    width: 9px;
                    height: 9px;
                    border: 1.5px solid var(--border);
                    display: inline-block;
                }

                .filter-dot.frontend { background: var(--frontend); }
                .filter-dot.ai { background: var(--ai); }
                .filter-dot.backend { background: var(--backend); }
                .filter-dot.languages { background: var(--languages); }

                .filter-count {
                    font-size: 12px;
                    white-space: nowrap;
                    color: var(--foreground);
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    background: var(--accent);
                    padding: 5px 10px;
                    border: 1.5px solid var(--border);
                    box-shadow: 2px 2px 0 var(--foreground);
                }

                /* ── Scrap Board Grid ── */
                .scrap-board {
                    display: grid;
                    grid-template-columns: 1fr 1.05fr;
                    gap: 54px 64px;
                    align-items: start;
                    padding: 8px 6px 50px;
                }

                .scrap-board.filtered {
                    max-width: 740px;
                    grid-template-columns: 1fr;
                    margin: 0 auto;
                    min-height: 480px;
                }

                .toolkit-chapter {
                    position: relative;
                    min-width: 0;
                }

                .toolkit-chapter.frontend { transform: rotate(-1.2deg); }
                .toolkit-chapter.ai { margin-top: 38px; transform: rotate(1.1deg); }
                .toolkit-chapter.backend { margin-top: -10px; transform: rotate(0.9deg); }
                .toolkit-chapter.languages { margin-top: 32px; transform: rotate(-1.1deg); }

                .scrap-board.filtered .toolkit-chapter {
                    margin-top: 16px;
                    transform: none;
                }

                /* ── Corner Sticker Tab ── */
                .corner-badge {
                    position: absolute;
                    top: -13px;
                    right: 22px;
                    z-index: 6;
                    background: var(--card);
                    border: 2px solid var(--border);
                    padding: 3px 10px;
                    font-size: 10.5px;
                    font-weight: 900;
                    letter-spacing: 0.06em;
                    box-shadow: 2.5px 2.5px 0 var(--foreground);
                    transform: rotate(3.5deg);
                    text-transform: uppercase;
                }

                .corner-badge.accent {
                    background: var(--accent);
                    transform: rotate(2.5deg);
                }

                .corner-badge.mint {
                    background: #6ee7b7;
                    transform: rotate(3deg);
                }

                /* ── Paper Card ── */
                .paper {
                    border: 2.5px solid var(--border);
                    background: var(--card);
                    box-shadow: var(--shadow-paper);
                    position: relative;
                    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease;
                }

                .toolkit-chapter:hover .paper {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lift);
                }

                .tape {
                    width: 118px;
                    height: 28px;
                    background: var(--tape);
                    position: absolute;
                    top: -14px;
                    left: 36%;
                    transform: rotate(-2.5deg);
                    z-index: 4;
                    border-left: 2px dashed rgba(0, 0, 0, 0.25);
                    border-right: 2px dashed rgba(0, 0, 0, 0.25);
                    backdrop-filter: blur(2px);
                }

                .paper-head {
                    padding: 20px 26px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-bottom: 2px solid var(--border);
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                }

                .category-tag {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .category-tag svg {
                    width: 16px;
                    height: 16px;
                }

                .head-code {
                    font-family: monospace;
                    font-size: 11.5px;
                    background: rgba(255, 255, 255, 0.65);
                    padding: 2px 7px;
                    border: 1px solid var(--border);
                }

                .frontend .paper-head { background: var(--frontend); }
                .ai .paper-head { background: var(--ai); }
                .backend .paper-head { background: var(--backend); }
                .languages .paper-head { background: var(--languages); }

                .paper-body {
                    padding: 26px;
                }

                .chapter-intro {
                    display: flex;
                    align-items: flex-start;
                    gap: 18px;
                }

                .chapter-number {
                    font-size: 64px;
                    line-height: 0.95;
                    font-weight: 800;
                    opacity: 0.16;
                    user-select: none;
                }

                .chapter-intro h2 {
                    font-size: 26px;
                    line-height: 1.18;
                    margin: 0 0 8px;
                    font-weight: 800;
                }

                .org {
                    font-size: 11.5px;
                    line-height: 1.5;
                    font-weight: 800;
                    color: var(--muted-foreground);
                    letter-spacing: 0.05em;
                }

                .chapter-description {
                    font-family: var(--font-hand);
                    font-size: 22.5px;
                    line-height: 1.32;
                    font-weight: 600;
                    color: var(--foreground);
                    margin: 16px 0 18px;
                }

                /* ── Code / Pipeline Strip ── */
                .code-sample {
                    background: var(--foreground);
                    color: #e2f0cb;
                    padding: 12px 18px;
                    font-family: monospace;
                    font-size: 12.5px;
                    line-height: 1.6;
                    margin: 16px -26px;
                    border-top: 1.5px solid var(--border);
                    border-bottom: 1.5px solid var(--border);
                    overflow-x: auto;
                    white-space: nowrap;
                }

                .code-keyword { color: #fef08a; font-weight: 700; }
                .code-prop { color: #cbf0f8; }

                /* ── Sub-group & Compartments ── */
                .sub-group-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    color: var(--muted-foreground);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                }

                .split-compartments {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-top: 6px;
                }

                .compartment {
                    border: 1.5px dashed rgba(17, 17, 17, 0.3);
                    background: rgba(255, 183, 178, 0.12);
                    padding: 13px 14px;
                }

                .compartment-header {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    margin-bottom: 10px;
                    color: var(--foreground);
                }

                .dual-blueprint-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 14px;
                    margin: 12px 0;
                }

                .blueprint-box {
                    border: 1.5px solid var(--border);
                    background: rgba(254, 243, 199, 0.25);
                    padding: 13px 14px;
                    box-shadow: 2.5px 2.5px 0 rgba(17, 17, 17, 0.12);
                }

                .blueprint-title {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 1px dashed rgba(17, 17, 17, 0.25);
                }

                /* ── Storage Paradigm Strip (Card 04) ── */
                .storage-paradigms {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    margin-bottom: 16px;
                    padding: 10px;
                    background: rgba(226, 240, 203, 0.35);
                    border: 1.5px dashed rgba(17, 17, 17, 0.3);
                }

                .paradigm-chip {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 4px;
                }

                .paradigm-chip strong {
                    font-size: 13px;
                    font-weight: 800;
                }

                .paradigm-chip span {
                    font-size: 10px;
                    color: var(--muted-foreground);
                    font-weight: 600;
                }

                /* ── Interactive Skill Pills ── */
                .pill-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 9px;
                }

                .skill-pill {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 7px 13px;
                    background: #ffffff;
                    border: 2px solid var(--border);
                    box-shadow: 2.5px 2.5px 0 var(--border);
                    font-size: 12.5px;
                    font-weight: 800;
                    cursor: default;
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                                box-shadow 0.2s ease,
                                background-color 0.15s ease;
                }

                .skill-pill:hover {
                    transform: translate(-2px, -3px) rotate(-1deg);
                    box-shadow: 4.5px 4.5px 0 var(--border);
                    background: var(--pill-accent, var(--accent));
                    z-index: 30;
                }

                .pill-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                    border: 1px solid var(--border);
                    flex-shrink: 0;
                }

                .pill-tooltip {
                    position: absolute;
                    bottom: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%) translateY(4px) scale(0.92);
                    background: var(--foreground);
                    color: var(--card);
                    font-size: 10.5px;
                    font-weight: 700;
                    padding: 5px 10px;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    border: 1.5px solid var(--border);
                    box-shadow: 2.5px 2.5px 0 var(--primary);
                    transition: opacity 0.18s ease, transform 0.18s ease;
                    z-index: 50;
                }

                .skill-pill:hover .pill-tooltip {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                }

                /* ── Card Footer ── */
                .card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 22px;
                    padding-top: 14px;
                    border-top: 1.5px dashed rgba(17, 17, 17, 0.25);
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .footer-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11.5px;
                    font-weight: 700;
                    color: var(--muted-foreground);
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    border: 1.5px solid var(--border);
                    display: inline-block;
                }

                .status-dot.cyan { background: #38bdf8; }
                .status-dot.green { background: #22c55e; }
                .status-dot.amber { background: #f59e0b; }
                .status-dot.emerald { background: #10b981; }

                .footer-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .hand-note-small {
                    font-family: var(--font-hand);
                    font-size: 21px;
                    font-weight: 700;
                    color: var(--foreground);
                    transform: rotate(-4deg);
                }

                .item-count-badge {
                    background: var(--foreground);
                    color: var(--card);
                    font-size: 10.5px;
                    font-weight: 800;
                    padding: 4px 9px;
                    letter-spacing: 0.05em;
                }

                /* ── Outside Card Caption ── */
                .chapter-caption {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 8px 0;
                    font-family: var(--font-hand);
                    font-size: 27px;
                    font-weight: 700;
                    color: var(--foreground);
                }

                .chapter-caption svg {
                    width: 30px;
                    height: 30px;
                }

                /* ── Bottom Closing Note ── */
                .bottom-note {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 18px;
                    padding: 24px 0 60px;
                }

                .bottom-note .hand-note {
                    font-size: 33px;
                    transform: rotate(-2.5deg);
                    background: var(--card);
                    padding: 6px 20px;
                    border: 2px solid var(--border);
                    box-shadow: 4px 4px 0 var(--foreground);
                }

                .bottom-note svg {
                    color: var(--foreground);
                    width: 34px;
                    height: 34px;
                }

                /* ── Responsive Breakpoints ── */
                @media (max-width: 900px) {
                    .toolkit-main { padding: 44px 24px 0; }
                    .heading-note { right: 0; top: 4px; }
                    .heading-note .hand-note { font-size: 25px; }
                    .scrap-board { grid-template-columns: 1fr; gap: 44px; }
                    .toolkit-chapter.ai,
                    .toolkit-chapter.backend,
                    .toolkit-chapter.languages { margin-top: 8px; }
                    .filter-count { display: none; }
                }

                @media (max-width: 600px) {
                    .toolkit-main { padding: 36px 16px 0; }
                    .toolkit-heading h1 { font-size: 50px; }
                    .heading-note {
                        position: static;
                        flex-direction: row;
                        justify-content: space-between;
                        margin-top: 18px;
                    }
                    .heading-note .arrow-container { display: none; }
                    .paper-body { padding: 20px; }
                    .code-sample { margin: 14px -20px; font-size: 11.5px; }
                    .storage-paradigms { grid-template-columns: repeat(2, 1fr); }
                    .chapter-intro h2 { font-size: 22px; }
                    .chapter-number { font-size: 48px; }
                    .bottom-note .hand-note { font-size: 24px; text-align: center; }
                }
            `}</style>
        </section>
    );
}