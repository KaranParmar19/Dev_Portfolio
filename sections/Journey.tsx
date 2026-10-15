'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { Award, BookOpen, Code2, Flame, BadgeCheck, Sparkles, ArrowDownRight, Star, Asterisk, X, ExternalLink, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';
import leetcodeInitialData from '@/public/data/leetcodeFallback.json';
import CountUp from '@/app/components/CountUp';
import SVGPathAnimation from '@/app/components/SVGPathAnimation';
import LiquidHeading from '@/app/components/LiquidHeading';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true });

// ─── Categories from scrapbook repo ──────────────────────────────────────────
export const categories = [
    { id: 'all',         label: 'Everything',   icon: Star       },
    { id: 'education',   label: 'Education',    icon: BookOpen   },
    { id: 'training',    label: 'Training',     icon: Code2      },
    { id: 'certified',   label: 'Certified',    icon: BadgeCheck },
    { id: 'achievement', label: 'Achievements', icon: Award      },
] as const;

export type Category = typeof categories[number]['id'];

// ─── Sub-components copied directly from chapters.tsx ────────────────────────
function PaperHead({ category, date, icon: Icon }: { category: string; date: string; icon: React.ElementType }) {
    return (
        <div className="paper-head">
            <span className="category-tag"><Icon />{category}</span>
            <span>{date}</span>
        </div>
    );
}

export function Education() {
    return (
        <article className="chapter education" aria-label="Education milestone">
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead category="THE FOUNDATION" date="2023 — 2027" icon={BookOpen} />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">01</span>
                        <div>
                            <h2>A little curiosity.<br />A lot of possibilities.</h2>
                            <div className="org">B.TECH · COMPUTER SCIENCE &amp; ENGINEERING<br />LOVELY PROFESSIONAL UNIVERSITY</div>
                        </div>
                    </div>
                    <p className="chapter-description">
                        Building a foundation in how things work, one lecture, late-night debugging session, and &ldquo;oh, that makes sense&rdquo; moment at a time.
                    </p>
                    <div className="course-list">
                        <span>Data Structures &amp; Algorithms</span>
                        <span>OOP</span>
                        <span>DBMS</span>
                        <span>Computer Networks</span>
                        <span>Operating Systems</span>
                    </div>
                    <div className="education-footer">
                        <div>
                            <span className="metric-label">CURRENT CGPA</span>
                            <span className="cgpa">7.81 <small>/ 10</small></span>
                        </div>
                        <span className="in-progress">DEGREE IN PROGRESS</span>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Where it all started.</span>
                <ArrowDownRight aria-hidden="true" />
            </div>
        </article>
    );
}

export function Training() {
    return (
        <article className="chapter training" aria-label="Training milestone">
            <img
                src="/images/coding-cat.png"
                width={816}
                height={816}
                className="cat-sticker"
                alt="A ginger cat coding on a laptop"
                loading="lazy"
            />
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead category="GETTING MY HANDS DIRTY" date="JUN — AUG 2025" icon={Code2} />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">02</span>
                        <div>
                            <h2>Less guessing.<br />More problem-solving.</h2>
                            <div className="org">DATA STRUCTURES &amp; ALGORITHMS TRAINING<br />SKILLSTONE · 2 MONTHS</div>
                        </div>
                    </div>
                    <p className="chapter-description">
                        An intensive dive into C++, from arrays and linked lists to trees, graphs, and the art of making a solution a little more efficient.
                    </p>
                    <div className="code-sample">
                        <span>while</span> ( !understood ) {'{'}<br />
                        &nbsp;&nbsp;practice(); learn(); repeat();<br />
                        {'}'}
                    </div>
                    <div className="skill-tags">
                        <span>C++</span>
                        <span>Trees &amp; Graphs</span>
                        <span>Complexity Analysis</span>
                        <span>Greedy Algorithms</span>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Trust the process (and the compiler).</span>
            </div>
        </article>
    );
}

interface CertItemData {
    id: string;
    title: string;
    issuer: string;
    date: string;
    logo: string;
    logoClass: string;
    logoWidth: number;
    logoHeight: number;
    certImg: string;
    aspect: 'landscape' | 'portrait';
    tilt: string;
    verifyUrl?: string;
}

const certList: CertItemData[] = [
    {
        id: 'aws',
        title: 'Cloud Practitioner Essentials',
        issuer: 'Amazon Web Services',
        date: 'May 20, 2026',
        logo: '/images/aws-logo.png',
        logoClass: 'aws',
        logoWidth: 36,
        logoHeight: 32,
        certImg: '/images/cert-aws.png',
        aspect: 'landscape',
        tilt: '-2deg',
    },
    {
        id: 'ibm',
        title: 'Fundamentals of AI Agents',
        issuer: 'RAG & LangChain · IBM',
        date: 'May 8, 2026',
        verifyUrl: 'https://coursera.org/verify/0VHIWFZD0RX4',
        logo: '/images/ibm-logo.png',
        logoClass: 'ibm',
        logoWidth: 42,
        logoHeight: 20,
        certImg: '/images/cert-ibm.png',
        aspect: 'landscape',
        tilt: '2.5deg',
    },
    {
        id: 'cipherschools',
        title: 'DSA, Backend & GenAI Development',
        issuer: "CipherSchools · Jun '26 — Aug '26",
        date: "Jun '26 — Aug '26",
        logo: '/images/cipherschools-logo.png',
        logoClass: 'cipherschools',
        logoWidth: 32,
        logoHeight: 32,
        certImg: '/images/cert-cipherschools.png',
        aspect: 'portrait',
        tilt: '-1.5deg',
    },
];

export function Certifications() {
    const [selectedCert, setSelectedCert] = useState<CertItemData | null>(null);
    const [activeCertId, setActiveCertId] = useState<string>('aws');

    // Close modal on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedCert(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <article className="chapter certified" aria-label="Certification milestone">
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead category="ADDING TO THE TOOLKIT" date="CERTIFICATION" icon={BadgeCheck} />
                <div className="paper-body">
                    <div className="chapter-intro">
                        <span className="chapter-number">03</span>
                        <div>
                            <h2>New skills.<br />New rabbit holes.</h2>
                            <div className="org">CLOUD &amp; GENERATIVE AI</div>
                        </div>
                    </div>
                    <p className="chapter-description">
                        Taking my curiosity beyond the classroom. Exploring the cloud and learning to build AI agents that do more than just chat.
                    </p>

                    <div 
                        className="cert-list-wrapper"
                        onMouseLeave={() => setActiveCertId('aws')}
                    >
                        {certList.map((cert) => {
                            const isActive = activeCertId === cert.id;
                            return (
                                <div
                                    key={cert.id}
                                    className={`cert-item ${isActive ? 'active' : ''}`}
                                    style={{ '--cert-tilt': cert.tilt } as React.CSSProperties}
                                    onClick={() => setSelectedCert(cert)}
                                    onMouseEnter={() => setActiveCertId(cert.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedCert(cert);
                                        }
                                    }}
                                >
                                    <div className={`cert-logo ${cert.logoClass}`}>
                                        <Image
                                            src={cert.logo}
                                            alt={cert.issuer}
                                            width={cert.logoWidth}
                                            height={cert.logoHeight}
                                            className="object-contain w-auto h-auto max-h-[26px]"
                                        />
                                    </div>
                                    <div>
                                        <h3>{cert.title}</h3>
                                        <p>{cert.issuer}</p>
                                    </div>
                                    <BadgeCheck className="cert-check" />

                                    {/* Floating Certificate Preview that Pops Out on Hover / Active Intentional Showcase */}
                                    <div className="cert-popout-preview" aria-hidden="true">
                                        <div className="cert-popout-card">
                                            <div className="cert-tape-pin" />
                                            <div className="cert-img-frame">
                                                <Image
                                                    src={cert.certImg}
                                                    alt={cert.title}
                                                    width={cert.aspect === 'portrait' ? 180 : 260}
                                                    height={cert.aspect === 'portrait' ? 240 : 170}
                                                    className="object-contain w-full h-auto rounded-[2px]"
                                                    loading="eager"
                                                />
                                            </div>
                                            <div className="cert-popout-footer">
                                                <span className="cert-view-tag">
                                                    <ZoomIn size={11} className="inline mr-1" />
                                                    CLICK TO INSPECT
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cert-footer">
                        <span className="hand-note">Curiosity, certified.</span>
                        <span className="verified"><BadgeCheck size={14} /> CERTIFIED</span>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Still collecting &ldquo;aha!&rdquo; moments.</span>
                <Sparkles aria-hidden="true" />
            </div>

            {/* High-Resolution Certificate Lightbox Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity"
                    onClick={() => setSelectedCert(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-[#fffdf2] border-[3.5px] border-[#111111] p-4 sm:p-6 md:p-8 shadow-[12px_12px_0px_#111111] max-h-[92vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-4">
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-[#F18961] font-sans">
                                    VERIFIED CREDENTIAL
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-black font-futura">
                                    {selectedCert.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-black/70 font-medium">
                                    Issued by {selectedCert.issuer} • {selectedCert.date}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCert(null)}
                                className="w-9 h-9 border-2 border-black bg-white hover:bg-[#F18961] hover:text-white transition-colors flex items-center justify-center font-black shadow-[3px_3px_0px_#111111] cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Certificate Image Frame */}
                        <div className="relative w-full border-2 border-black/80 bg-white p-2 shadow-inner flex items-center justify-center overflow-hidden">
                            <Image
                                src={selectedCert.certImg}
                                alt={selectedCert.title}
                                width={1000}
                                height={700}
                                className="object-contain w-full h-auto max-h-[65vh]"
                                priority
                            />
                        </div>

                        {/* Modal Action Footer */}
                        <div className="mt-4 pt-3 border-t-2 border-black/20 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                            <span className="font-bold text-black/80 flex items-center gap-1.5">
                                <BadgeCheck size={18} className="text-[#F18961]" />
                                Awarded to <strong>Karan Parmar</strong>
                            </span>

                            {selectedCert.verifyUrl && (
                                <a
                                    href={selectedCert.verifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-black bg-[#F18961] text-white font-black uppercase text-xs shadow-[3px_3px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111111] transition-all cursor-pointer"
                                >
                                    Verify on Coursera <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

export function Achievements() {
    const [data, setData] = useState(leetcodeInitialData);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        fetch('/api/leetcode', { cache: 'no-store' })
            .then((res) => (res.ok ? res.json() : null))
            .then((resData) => {
                if (!isMounted || !resData || resData.error || !resData.months) return;
                setData(resData);
            })
            .catch(() => {});
        return () => {
            isMounted = false;
        };
    }, []);

    // Scroll to the latest months (right edge) on mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [data]);

    // Get color for cell based on submission count
    const getCellColor = (count: number) => {
        if (count >= 10) return '#4ade80'; // Brightest lime
        if (count >= 4) return '#22c55e';  // Vibrant medium green
        if (count >= 2) return '#16a34a';  // Rich green
        if (count >= 1) return '#15803d';  // Dark green
        return '#262626';                  // Muted grey (no submission)
    };

    return (
        <article className="chapter achievement" aria-label="Achievement milestone">
            <div className="paper">
                <div className="tape" aria-hidden="true" />
                <PaperHead category="THE EVERYDAY PRACTICE" date="LEETCODE" icon={Flame} />
                <div className="paper-body">
                    <div className="achievement-total">
                        <div className="big-total">
                            <CountUp value={data.totalSolved} duration={2} />
                            <span>+</span>
                        </div>
                        <Flame aria-hidden="true" />
                    </div>
                    <h2 className="total-label">problems. A few thousand lessons.</h2>
                    <p className="chapter-description">
                        Showing up, even when the solution doesn&rsquo;t. A small daily habit that became a big part of my journey.
                    </p>

                    {/* ── Official Full-Year LeetCode Calendar Widget (Image 1) ── */}
                    <div className="bg-[#1a1a1a] text-white rounded-lg p-3 sm:p-4 my-4 border border-black shadow-[3px_3px_0_#111]">
                        {/* Header bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3 pb-2 border-b border-white/10 font-sans">
                            <div className="flex items-center gap-1.5 font-bold">
                                <span className="text-sm font-extrabold text-white">
                                    <CountUp value={data.totalSubmissionsInYear} duration={1.8} delay={0.1} />
                                </span>
                                <span className="text-neutral-400 font-normal">submissions in the past one year</span>
                                <span className="text-neutral-500 text-[11px] cursor-help" title="Based on LeetCode submission calendar">ⓘ</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                                <span>Total active days: <strong className="text-neutral-200"><CountUp value={data.totalActiveDays} duration={1.8} delay={0.15} /></strong></span>
                                <span>Max streak: <strong className="text-neutral-200"><CountUp value={data.maxStreak} duration={1.8} delay={0.2} /></strong></span>
                                <span className="bg-[#2a2a2a] text-neutral-300 px-2 py-0.5 rounded text-[10px] font-medium border border-neutral-700">
                                    Current ▾
                                </span>
                            </div>
                        </div>

                        {/* Calendar Heatmap Grid */}
                        <div
                            ref={scrollRef}
                            className="overflow-x-auto pb-2"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#404040 #1a1a1a',
                            }}
                        >
                            <div className="flex items-start gap-1.5 sm:gap-2 min-w-[580px] justify-between">
                                {data.months.map((month: any, mIdx: number) => (
                                    <div key={mIdx} className="flex flex-col items-center">
                                        {/* Columns of 7 days */}
                                        <div className="flex gap-[3px]">
                                            {month.cols.map((col: any[], cIdx: number) => (
                                                <div key={cIdx} className="flex flex-col gap-[3px]">
                                                    {col.map((day: any, rIdx: number) => (
                                                        day === null ? (
                                                            <div key={rIdx} className="w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] opacity-0" />
                                                        ) : (
                                                            <div
                                                                key={rIdx}
                                                                className="w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] rounded-[1.5px] transition-transform hover:scale-125"
                                                                style={{ backgroundColor: getCellColor(day.count) }}
                                                                title={`${day.date}: ${day.count} submission${day.count === 1 ? '' : 's'}`}
                                                            />
                                                        )
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Month label */}
                                        <span className="text-[10px] text-neutral-400 font-sans mt-2 select-none">
                                            {month.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="streak-metrics">
                        <div>
                            <span className="metric-label">ACTIVE DAYS</span>
                            <strong>
                                <CountUp value={data.totalActiveDays} duration={2} delay={0.2} /> <small>days</small>
                            </strong>
                        </div>
                        <div>
                            <span className="metric-label">MAX STREAK</span>
                            <strong>
                                <CountUp value={data.maxStreak} duration={2} delay={0.3} /> <small>days</small>
                            </strong>
                        </div>
                        <span className="hand-note">One day<br />at a time!</span>
                    </div>
                </div>
            </div>
            <div className="chapter-caption">
                <span>Consistency &gt; motivation.</span>
                <Star aria-hidden="true" />
            </div>
        </article>
    );
}

// ─── Main Journey Component (copied structure from repo's Index page) ────────
export default function Journey() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<Category>('all');
    const show = (category: Category) => filter === 'all' || filter === category;

    useGSAP(() => {
        const cards = gsap.utils.toArray('.chapter');
        gsap.fromTo(
            cards,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: 'back.out(1.4)',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="journey-page" id="journey">
            {/* Previous decorative background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute left-2 top-20 w-20 sm:w-28 md:w-36 aspect-square rotate-12">
                    <Image
                        alt=""
                        src="/images/crab.png"
                        fill
                        className="object-contain drop-shadow-[3px_3px_0px_rgba(241,137,97,0.35)]"
                    />
                </div>
                <div className="absolute right-0 bottom-0 w-24 sm:w-30 md:w-40 aspect-square -rotate-6">
                    <Image
                        alt=""
                        src="/images/birdBig.png"
                        fill
                        className="object-contain drop-shadow-[4px_4px_0px_rgba(17,17,17,0.2)]"
                    />
                </div>
                <div className="absolute bottom-12 left-[8%] hidden md:block w-32 aspect-square opacity-30 -rotate-12">
                    <Image
                        alt=""
                        src="/images/illu9.webp"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <div className="journey-main relative z-10">
                {/* ── Heading ── */}
                <header className="journey-heading">
                    <div className="eyebrow">THE STORY SO FAR / 2023 — NOW</div>
                    <h1>
                        <LiquidHeading
                            as="span"
                            align="left"
                            words={[
                                {
                                    text: 'MY ',
                                    style: {
                                        color: 'var(--foreground)',
                                        textShadow: 'none',
                                    },
                                },
                                {
                                    text: 'JOURNEY.',
                                    className: 'journey-highlight',
                                    style: {
                                        color: 'var(--primary)',
                                        textShadow: '3px 3px 0 var(--foreground)',
                                    },
                                },
                            ]}
                            intensity={1}
                            speed={1}
                        />
                    </h1>
                    <div className="heading-bottom">
                        <p>
                            Not a straight line. Not a finished story.<br />
                            Just a collection of things I&rsquo;ve learned, tried, and kept going.
                        </p>
                        <span className="hand-note">The good stuff is<br />in the little steps.</span>
                    </div>
                    <div className="heading-note">
                        <span className="hand-note">A few pages from<br />my life so far...</span>
                        <div className="arrow-container">
                            <SVGPathAnimation
                                svgPath="M10 8C70 0 80 27 43 35C10 42 15 16 45 24C79 35 83 46 79 61M67 52l12 10 9-15"
                                customViewBox="0 0 100 80"
                                bgColor="rgba(17, 17, 17, 0.18)"
                                animColor="#0099FF"
                                strokeWidth={3}
                                lineCap="round"
                                trigger="inView"
                                playback="once"
                                autoDuration={1.6}
                                highlightGlow={true}
                                replayOnHover={true}
                            />
                        </div>
                        <span className="chapter-label">4 CHAPTERS &amp; COUNTING</span>
                    </div>
                </header>

                {/* ── Filter Bar ── */}
                <nav className="filter-bar" aria-label="Filter journey milestones">
                    <div className="filters">
                        {categories.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                className="scrap-filter"
                                data-active={filter === id}
                                aria-pressed={filter === id}
                                onClick={() => setFilter(id)}
                            >
                                {id === 'all' ? <Icon className="w-3.5 h-3.5" /> : <span className={`filter-dot ${id}`} aria-hidden="true" />}
                                {label}
                            </button>
                        ))}
                    </div>
                    <span className="filter-count" aria-live="polite">
                        {filter === 'all' ? '04' : '01'} LITTLE MILESTONES
                    </span>
                </nav>

                {/* ── Scrap Board ── */}
                <div className={`scrap-board ${filter !== 'all' ? 'filtered' : ''}`} aria-label="Journey chapters">
                    {show('education') && <Education />}
                    {show('training') && <Training />}
                    {show('certified') && <Certifications />}
                    {show('achievement') && <Achievements />}
                </div>

                {/* ── Bottom Note ── */}
                <div className="bottom-note">
                    <Asterisk aria-hidden="true" />
                    <span className="hand-note">The next chapter? Still writing it.</span>
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                        <path d="m5 31 27-25 3 5L10 36l-5-5Zm0 0-2 7 7-2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* ── Scoped CSS matching styles.css from the repo ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

                .journey-page {
                    --font-sans: var(--font-space-grotesk, 'Space Grotesk', sans-serif);
                    --font-hand: var(--font-caveat, 'Caveat', cursive);
                    --background: #f4f1eb;
                    --foreground: #111111;
                    --card: #fffdf2;
                    --primary: #F18961;
                    --secondary: #e2f0cb;
                    --muted: #f4f1eb;
                    --muted-foreground: rgba(17, 17, 17, 0.62);
                    --accent: #fef08a;
                    --border: #111111;
                    --education: #cbf0f8;
                    --training: #e2f0cb;
                    --certified: #ffb7b2;
                    --achievement: #fef3c7;
                    --grid: rgba(17, 17, 17, 0.055);
                    --tape: rgba(255, 255, 255, 0.68);
                    --shadow-paper: 5px 6px 0 var(--foreground);
                    --shadow-lift: 8px 10px 0 var(--foreground);

                    min-height: 100vh;
                    background-color: var(--background);
                    color: var(--foreground);
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-sans);
                }

                .journey-main {
                    max-width: 1240px;
                    margin: auto;
                    padding: 60px 40px 0;
                }

                .journey-heading {
                    position: relative;
                    margin-bottom: 48px;
                }

                .eyebrow {
                    font-size: 13px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 16px;
                    letter-spacing: 0.06em;
                }

                .eyebrow::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: var(--primary);
                    border: 1.5px solid var(--border);
                }

                .journey-heading h1 {
                    margin: 0;
                    font-size: clamp(56px, 8vw, 96px);
                    line-height: .98;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }

                .journey-heading h1 span {
                    color: var(--primary);
                    text-shadow: 3px 3px 0 var(--foreground);
                }

                .heading-bottom {
                    margin-top: 26px;
                    display: flex;
                    align-items: center;
                    gap: 44px;
                }

                .heading-bottom p {
                    font-size: 15px;
                    line-height: 1.85;
                    margin: 0;
                    max-width: 470px;
                    color: var(--muted-foreground);
                    font-weight: 500;
                }

                .hand-note {
                    font-family: var(--font-hand);
                    font-size: 29px;
                    line-height: 1.15;
                    transform: rotate(-7deg);
                }

                .heading-note {
                    position: absolute;
                    right: 30px;
                    top: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    user-select: none;
                }

                .heading-note .hand-note {
                    font-size: 32px;
                }

                .heading-note svg,
                .heading-note .arrow-container {
                    width: 105px;
                    height: 70px;
                    transform: rotate(12deg);
                    margin-left: 36px;
                    color: var(--foreground);
                }

                .heading-note .arrow-container svg {
                    width: 100%;
                    height: 100%;
                    transform: none;
                    margin-left: 0;
                }

                .chapter-label {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    padding: 7px 12px;
                    border: 1.5px solid var(--border);
                    background: var(--accent);
                    transform: rotate(3deg);
                    margin-top: 4px;
                    box-shadow: 2.5px 2.5px 0 var(--foreground);
                }

                .filter-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1.5px solid var(--border);
                    border-bottom: 1.5px solid var(--border);
                    padding: 16px 0;
                    margin-bottom: 48px;
                    gap: 20px;
                }

                .filters {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .scrap-filter {
                    border-radius: 0;
                    font-size: 13px;
                    height: 36px;
                    padding: 0 16px;
                    border: 1.5px solid transparent;
                    background: transparent;
                    font-weight: 700;
                    box-shadow: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-transform: uppercase;
                    transition: all 0.15s ease;
                    color: var(--foreground);
                }

                .scrap-filter:hover {
                    background: var(--secondary);
                    border-color: var(--border);
                }

                .scrap-filter[data-active=true] {
                    background: var(--foreground);
                    color: var(--card);
                    border-color: var(--border);
                    box-shadow: 3.5px 3.5px 0 var(--primary);
                }

                .filter-dot {
                    width: 8px;
                    height: 8px;
                    border: 1px solid var(--border);
                    background: var(--foreground);
                    display: inline-block;
                }

                .filter-dot.education { background: var(--education); }
                .filter-dot.training { background: var(--training); }
                .filter-dot.certified { background: var(--certified); }
                .filter-dot.achievement { background: var(--achievement); }

                .filter-count {
                    font-size: 12px;
                    white-space: nowrap;
                    color: var(--muted-foreground);
                    font-weight: 700;
                    letter-spacing: 0.06em;
                }

                .scrap-board {
                    display: grid;
                    grid-template-columns: 1.08fr 1fr;
                    gap: 48px 70px;
                    align-items: start;
                    padding: 6px 6px 50px;
                }

                .chapter {
                    position: relative;
                    min-width: 0;
                }

                .chapter.education { transform: rotate(-1.5deg); }
                .chapter.training { margin-top: 53px; transform: rotate(1.5deg); }
                .chapter.certified { margin-top: -15px; transform: rotate(.8deg); z-index: 20; }
                .chapter.certified:hover { z-index: 60; }
                .chapter.achievement { margin-top: 40px; transform: rotate(-1.2deg); }

                .scrap-board.filtered {
                    max-width: 700px;
                    grid-template-columns: 1fr;
                    margin: 0 auto;
                    min-height: 480px;
                }

                .scrap-board.filtered .chapter {
                    margin-top: 20px;
                    transform: none;
                }

                .paper {
                    border: 2px solid var(--border);
                    background: var(--card);
                    box-shadow: var(--shadow-paper);
                    position: relative;
                    transition: transform .2s, box-shadow .2s;
                }

                .chapter:hover .paper {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lift);
                }

                .tape {
                    width: 120px;
                    height: 30px;
                    background: var(--tape);
                    position: absolute;
                    top: -15px;
                    left: 38%;
                    transform: rotate(3deg);
                    z-index: 2;
                    border-left: 2px dashed rgba(0, 0, 0, 0.25);
                    border-right: 2px dashed rgba(0, 0, 0, 0.25);
                    backdrop-filter: blur(2px);
                }

                .paper-head {
                    padding: 22px 28px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-bottom: 1.5px solid var(--border);
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

                .education .paper-head { background: var(--education); }
                .training .paper-head { background: var(--training); }
                .certified .paper-head { background: var(--certified); }
                .achievement .paper-head { background: var(--achievement); }

                .paper-body {
                    padding: 28px;
                }

                .chapter-number {
                    font-size: 68px;
                    line-height: 1;
                    font-weight: 800;
                    opacity: .17;
                    user-select: none;
                }

                .chapter-intro {
                    display: flex;
                    align-items: flex-start;
                    gap: 20px;
                }

                .chapter-intro h2 {
                    font-size: 28px;
                    line-height: 1.2;
                    margin: 3px 0 12px;
                    font-weight: 800;
                }

                .org {
                    font-size: 12px;
                    line-height: 1.6;
                    font-weight: 700;
                    color: var(--muted-foreground);
                    letter-spacing: 0.05em;
                }

                .chapter-description {
                    font-family: var(--font-hand);
                    font-size: 23px;
                    line-height: 1.35;
                    font-weight: 600;
                    color: var(--foreground);
                    margin: 18px 0;
                }

                .course-list {
                    border-top: 1px dashed rgba(0, 0, 0, 0.25);
                    padding-top: 15px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px 20px;
                    font-size: 12px;
                }

                .course-list span::before {
                    content: '+';
                    margin-right: 6px;
                    color: var(--primary);
                    font-weight: 700;
                }

                .education-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 22px;
                    gap: 12px;
                }

                .metric-label {
                    display: block;
                    font-size: 11px;
                    color: var(--muted-foreground);
                    margin-bottom: 4px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .cgpa {
                    font-size: 28px;
                    font-weight: 800;
                }

                .cgpa small {
                    font-size: 15px;
                    font-weight: 500;
                }

                .in-progress {
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    border: 1.5px solid var(--border);
                    padding: 6px 9px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                }

                .in-progress::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: var(--primary);
                }

                .chapter-caption {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 8px 0;
                    font-family: var(--font-hand);
                    font-size: 27px;
                }

                .chapter-caption svg {
                    width: 36px;
                    height: 36px;
                }

                .code-sample {
                    background: var(--foreground);
                    color: #e2f0cb;
                    padding: 16px 20px;
                    font-family: monospace;
                    font-size: 13.5px;
                    line-height: 1.85;
                    margin: 18px -28px;
                }

                .code-sample span {
                    color: #fffdf2;
                }

                .skill-tags {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .skill-tags span {
                    border: 1px solid var(--border);
                    padding: 5px 9px;
                    font-size: 11px;
                    background: rgba(0, 0, 0, 0.04);
                    font-weight: 600;
                }

                .cat-sticker {
                    position: absolute;
                    width: 135px;
                    height: 135px;
                    top: -112px;
                    right: 0;
                    z-index: 3;
                    transform: rotate(7deg);
                    object-fit: contain;
                    pointer-events: none;
                }

                .cert-item {
                    display: grid;
                    grid-template-columns: 54px 1fr 24px;
                    align-items: center;
                    gap: 14px;
                    border-top: 1px dashed rgba(0, 0, 0, 0.25);
                    padding: 14px 12px;
                    margin: 4px -12px;
                    border-radius: 8px;
                    border: 2px solid transparent;
                    position: relative;
                    cursor: pointer;
                    transform-origin: center center;
                    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                                box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                                background-color 0.2s ease,
                                border-color 0.2s ease;
                }

                .cert-item:hover,
                .cert-item.active {
                    transform: translateY(-5px) scale(1.02) rotate(-1deg);
                    background: #ffffff;
                    border-color: #111111;
                    box-shadow: 6px 6px 0px #111111;
                    z-index: 5;
                }

                .cert-item:nth-of-type(2):hover,
                .cert-item:nth-of-type(2).active {
                    transform: translateY(-5px) scale(1.02) rotate(1deg);
                }

                .cert-item:nth-of-type(3):hover,
                .cert-item:nth-of-type(3).active {
                    transform: translateY(-5px) scale(1.02) rotate(-0.7deg);
                }

                .cert-logo {
                    font-weight: 800;
                    font-size: 18px;
                    height: 48px;
                    display: grid;
                    place-items: center;
                    border: 1.5px solid var(--border);
                    border-radius: 4px;
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
                }

                .cert-item:hover .cert-logo,
                .cert-item.active .cert-logo {
                    transform: scale(1.1) rotate(-3deg);
                    border-color: #111111;
                    box-shadow: 2px 2px 0px #111111;
                }

                .cert-logo.aws,
                .cert-logo.ibm,
                .cert-logo.cipherschools {
                    background: #ffffff;
                    padding: 4px;
                }

                .cert-item h3 {
                    font-size: 14px;
                    margin: 0 0 4px;
                    font-weight: 800;
                    transition: color 0.2s ease;
                }

                .cert-item:hover h3,
                .cert-item.active h3 {
                    color: #111111;
                }

                .cert-item p {
                    font-size: 12px;
                    margin: 0;
                    color: var(--muted-foreground);
                    line-height: 1.6;
                }

                .cert-check {
                    width: 22px;
                    height: 22px;
                    color: var(--primary);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
                }

                .cert-item:hover .cert-check,
                .cert-item.active .cert-check {
                    transform: scale(1.28) rotate(8deg);
                    filter: drop-shadow(0 2px 5px rgba(241, 137, 97, 0.45));
                }

                .cert-popout-preview {
                    position: absolute;
                    right: calc(100% + 18px);
                    left: auto;
                    top: 50%;
                    transform: translateY(-50%) scale(0.82) rotate(3deg);
                    opacity: 0;
                    pointer-events: none;
                    z-index: 100;
                    width: 280px;
                    transition: opacity 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                                transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .cert-item:hover .cert-popout-preview,
                .cert-item.active .cert-popout-preview {
                    opacity: 1;
                    transform: translateY(-50%) scale(1) rotate(var(--cert-tilt, -2deg));
                    pointer-events: auto;
                }

                .cert-popout-card {
                    background: #ffffff;
                    border: 2.5px solid #111111;
                    box-shadow: 8px 8px 0px #111111, 0 18px 38px rgba(0, 0, 0, 0.32);
                    padding: 8px;
                    border-radius: 4px;
                    position: relative;
                }

                .cert-tape-pin {
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%) rotate(-2deg);
                    width: 64px;
                    height: 17px;
                    background: rgba(254, 240, 138, 0.92);
                    border: 1px dashed rgba(0, 0, 0, 0.35);
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
                    z-index: 5;
                }

                .cert-img-frame {
                    background: #fafaf9;
                    border: 1.5px solid rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cert-popout-footer {
                    margin-top: 6px;
                    text-align: center;
                }

                .cert-view-tag {
                    font-size: 9px;
                    font-weight: 900;
                    letter-spacing: 0.06em;
                    color: #111111;
                    text-transform: uppercase;
                    display: inline-flex;
                    align-items: center;
                    background: #fef08a;
                    padding: 3px 8px;
                    border: 1px solid #111111;
                    border-radius: 2px;
                }

                @media (max-width: 1180px) {
                    .cert-popout-preview {
                        right: auto;
                        left: 50%;
                        top: auto;
                        bottom: calc(100% + 12px);
                        transform: translateX(-50%) translateY(12px) scale(0.85) rotate(-2deg);
                        width: 240px;
                    }

                    .cert-item:hover .cert-popout-preview,
                    .cert-item.active .cert-popout-preview {
                        transform: translateX(-50%) translateY(0) scale(1) rotate(var(--cert-tilt, 1.5deg));
                    }
                }

                @media (max-width: 768px) {
                    /* On narrow screens, keep passive active popout hidden until explicitly tapped/hovered to avoid overlapping headings */
                    .cert-item.active:not(:hover) .cert-popout-preview {
                        opacity: 0;
                        pointer-events: none;
                    }
                }

                .verified {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: 2px solid var(--primary);
                    color: var(--primary);
                    font-size: 12px;
                    font-weight: 800;
                    padding: 6px 10px;
                    transform: rotate(-7deg);
                }

                .cert-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 12px;
                }

                .achievement-total {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .big-total {
                    font-size: 82px;
                    font-weight: 800;
                    line-height: 1;
                }

                .big-total span {
                    color: var(--primary);
                    font-size: 58px;
                }

                .achievement-total svg {
                    width: 70px;
                    height: 70px;
                    color: var(--primary);
                    stroke-width: 1.5;
                    transform: rotate(9deg);
                }

                .total-label {
                    margin: 8px 0 20px;
                    font-size: 14px;
                    font-weight: 700;
                }

                .streak-grid {
                    display: grid;
                    grid-template-columns: repeat(24, 1fr);
                    gap: 4px;
                    margin: 17px 0;
                }

                .streak-cell {
                    aspect-ratio: 1;
                    background: rgba(0, 0, 0, 0.06);
                    border: 1px solid var(--border);
                }

                .streak-cell.active { background: var(--accent); }
                .streak-cell.hot { background: var(--primary); }

                .streak-metrics {
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px dashed rgba(0, 0, 0, 0.25);
                    padding-top: 18px;
                }

                .streak-metrics strong {
                    font-size: 26px;
                }

                .streak-metrics small {
                    font-size: 13px;
                    font-weight: 500;
                }

                .streak-metrics .hand-note {
                    font-size: 26px;
                    color: var(--primary);
                }

                .bottom-note {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 22px;
                    padding: 28px 0 55px;
                }

                .bottom-note .hand-note {
                    font-size: 33px;
                    transform: rotate(-3deg);
                }

                .bottom-note svg {
                    color: var(--primary);
                    width: 36px;
                    height: 36px;
                }

                @media (max-width: 800px) {
                    .journey-main { padding: 42px 24px 0; }
                    .journey-heading h1 { font-size: 70px; }
                    .heading-note { right: 0; top: 10px; }
                    .heading-note .hand-note { font-size: 26px; }
                    .scrap-board { gap: 40px 28px; }
                    .paper-body { padding: 22px; }
                    .paper-head { padding: 20px 22px 16px; font-size: 11px; }
                    .chapter-intro { gap: 14px; }
                    .chapter-intro h2 { font-size: 24px; }
                    .chapter-number { font-size: 52px; }
                    .code-sample { margin-left: -22px; margin-right: -22px; font-size: 12.5px; }
                    .filter-count { display: none; }
                    .hand-note { font-size: 24px; }
                    .chapter-description { font-size: 20px; }
                }

                @media (max-width: 600px) {
                    .journey-main { padding: 36px 16px 0; }
                    .journey-heading h1 { font-size: 52px; }
                    .heading-note { position: static; display: flex; align-items: center; gap: 10px; margin-top: 20px; }
                    .heading-note svg { display: none; }
                    .heading-note .hand-note { font-size: 23px; transform: rotate(-3deg); }
                    .chapter-label { font-size: 10px; margin-left: 12px; }
                    .heading-bottom { margin-top: 20px; gap: 12px; }
                    .heading-bottom p { font-size: 13.5px; }
                    .heading-bottom > .hand-note { display: none; }
                    .journey-heading { margin-bottom: 28px; }
                    .filter-bar { margin-bottom: 36px; padding: 14px 0; }
                    .filters { gap: 6px; }
                    .scrap-filter { font-size: 11px; padding: 0 11px; height: 33px; }
                    .scrap-board { grid-template-columns: 1fr; gap: 40px; padding: 6px 3px 30px; }
                    .chapter.training, .chapter.certified, .chapter.achievement { margin-top: 10px; }
                    .chapter.training { margin-top: 64px; }
                    .cat-sticker { width: 110px; height: 110px; top: -90px; }
                    .chapter-intro h2 { font-size: 24px; }
                    .chapter-number { font-size: 56px; }
                    .bottom-note { gap: 14px; padding-bottom: 36px; }
                    .bottom-note .hand-note { font-size: 25px; }
                }
            `}</style>
        </section>
    );
}
