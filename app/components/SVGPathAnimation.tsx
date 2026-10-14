'use client';

// SVG Path Animation Component matching Framer SVGPathAnimation
// Animates SVG paths with hand-drawn stroke draw-in and highlight effect (Once mode).

import React, { useState, useEffect, useMemo, useRef, startTransition } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export interface SVGPathAnimationProps {
    svgPath?: string;
    useFile?: boolean;
    svgFile?: string;
    bgColor?: string;
    animColor?: string;
    strokeWidth?: number;
    trigger?: 'appear' | 'inView';
    playback?: 'once' | 'loop';
    autoDuration?: number;
    lineCap?: 'butt' | 'round' | 'square';
    highlightGlow?: boolean;
    customViewBox?: string;
    className?: string;
    style?: React.CSSProperties;
    replayOnHover?: boolean;
}

export default function SVGPathAnimation({
    svgPath = 'M10 80 Q 95 10 180 80',
    useFile = false,
    svgFile = '',
    bgColor = 'rgba(17, 17, 17, 0.18)',
    animColor = '#0099FF',
    strokeWidth = 3,
    trigger = 'inView',
    playback = 'once',
    autoDuration = 1.8,
    lineCap = 'round',
    highlightGlow = true,
    customViewBox,
    className = '',
    style,
    replayOnHover = false,
}: SVGPathAnimationProps) {
    const [extractedPath, setExtractedPath] = useState('');
    const [viewBox, setViewBox] = useState(customViewBox || '0 0 100 80');
    const [svgDimensions, setSvgDimensions] = useState({ width: 100, height: 70 });
    const [isRevealed, setIsRevealed] = useState(false);
    const [hoverKey, setHoverKey] = useState(0);

    const pathRef = useRef<SVGPathElement>(null);
    const bgPathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Accurate scroll reveal linked with Lenis / ScrollTrigger
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (trigger === 'appear') {
            setIsRevealed(true);
            return;
        }

        const el = containerRef.current;
        if (!el) return;

        // GSAP ScrollTrigger ensures it ONLY fires when user actually scrolls to it
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: playback === 'once',
            onEnter: () => {
                setIsRevealed(true);
            },
            onEnterBack: () => {
                if (playback !== 'once') {
                    setIsRevealed(true);
                }
            },
            onLeaveBack: () => {
                if (playback !== 'once') {
                    setIsRevealed(false);
                }
            },
        });

        // IntersectionObserver fallback
        let observer: IntersectionObserver | null = null;
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                ([entry]) => {
                    // Only trigger if actually scrolled down into view
                    if (entry.isIntersecting && (window.scrollY > 150 || el.getBoundingClientRect().top < window.innerHeight * 0.85)) {
                        setIsRevealed(true);
                        if (playback === 'once' && observer) {
                            observer.disconnect();
                        }
                    }
                },
                { threshold: 0.15 }
            );
            observer.observe(el);
        }

        return () => {
            st.kill();
            if (observer) observer.disconnect();
        };
    }, [trigger, playback]);

    useEffect(() => {
        if (useFile && svgFile) {
            fetch(svgFile)
                .then((res) => res.text())
                .then((svgText) => {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                    const pathElement = svgDoc.querySelector('path');
                    if (pathElement) {
                        const d = pathElement.getAttribute('d');
                        if (d) {
                            startTransition(() => setExtractedPath(d));
                        }
                    }
                })
                .catch((err) => console.error('Error loading SVG file:', err));
        }
    }, [useFile, svgFile]);

    const activePath = useFile && extractedPath ? extractedPath : svgPath;

    useEffect(() => {
        const el = bgPathRef.current || pathRef.current;
        if (!el || customViewBox) return;

        try {
            const bbox = el.getBBox();
            const padding = 5;
            const newViewBox = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;
            startTransition(() => setViewBox(newViewBox));
        } catch (error) {
            console.error('Error calculating viewBox:', error);
        }
    }, [activePath, strokeWidth, customViewBox]);

    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    startTransition(() =>
                        setSvgDimensions({ width: rect.width, height: rect.height })
                    );
                }
            }
        };
        updateDimensions();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    const scaledStrokeWidth = useMemo(() => {
        if (!svgDimensions.width || svgDimensions.width <= 1) return strokeWidth;
        const parts = viewBox.split(' ').map(Number);
        if (parts.length < 4) return strokeWidth;
        const [, , vbWidth, vbHeight] = parts;
        const scaleX = vbWidth / svgDimensions.width;
        const scaleY = vbHeight / svgDimensions.height;
        const scale = Math.max(scaleX, scaleY);
        return strokeWidth * (scale || 1);
    }, [viewBox, svgDimensions, strokeWidth]);

    const shouldDraw = isRevealed;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: '100%', height: '100%', display: 'inline-block', position: 'relative', ...style }}
            onMouseEnter={replayOnHover ? () => setHoverKey((k) => k + 1) : undefined}
        >
            <svg
                ref={svgRef}
                viewBox={viewBox}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    filter: highlightGlow ? `drop-shadow(0 0 6px ${animColor}88)` : undefined,
                }}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
            >
                {/* 1. Background Track Path (base faint line) */}
                <path
                    ref={bgPathRef}
                    d={activePath}
                    stroke={bgColor}
                    strokeWidth={scaledStrokeWidth}
                    fill="none"
                    strokeLinecap={lineCap}
                    strokeLinejoin="round"
                />

                {/* 2. Highlight Animated Path (draws once when revealed and stays highlighted) */}
                <motion.path
                    key={hoverKey}
                    ref={pathRef}
                    d={activePath}
                    stroke={animColor}
                    strokeWidth={scaledStrokeWidth}
                    fill="none"
                    strokeLinecap={lineCap}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                        shouldDraw
                            ? { pathLength: 1, opacity: 1 }
                            : { pathLength: 0, opacity: 0 }
                    }
                    transition={{
                        pathLength: {
                            duration: autoDuration,
                            ease: [0.16, 1, 0.3, 1],
                        },
                        opacity: {
                            duration: 0.15,
                        },
                    }}
                />
            </svg>
        </div>
    );
}
