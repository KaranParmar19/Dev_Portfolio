'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useLenis } from '@/lenis/LenisScroll';

export interface SectionMorphProps {
    topColor?: string;
    bottomColor?: string;
    visualHeight?: number;
    curveDepth?: number;
    curveWidth?: number;
    responseMode?: 'smooth' | 'elastic' | 'cinematic' | 'custom';
    sensitivity?: number;
    velocitySmoothing?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    overshoot?: number;
    settleDelay?: number;
    verticalShift?: number;
    edgeTension?: number;
    highlightStrength?: number;
    reverseMorph?: boolean;
    fullBleed?: boolean;
    reducedMotion?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const PRESETS = {
    smooth: {
        spring: { stiffness: 140, damping: 30, mass: 0.8 },
        sensitivity: 0.55,
        overshoot: 0.03,
        verticalShift: 4,
        smoothing: 0.14,
    },
    elastic: {
        spring: { stiffness: 125, damping: 24, mass: 0.85 },
        sensitivity: 0.65,
        overshoot: 0.06,
        verticalShift: 5,
        smoothing: 0.16,
    },
    cinematic: {
        spring: { stiffness: 110, damping: 26, mass: 0.9 },
        sensitivity: 0.6,
        overshoot: 0.05,
        verticalShift: 5,
        smoothing: 0.16,
    },
};

const OVERSCAN = 3;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function mix(from: number, to: number, amount: number): number {
    return from + (to - from) * amount;
}

export default function SectionMorph({
    topColor = '#111111',
    bottomColor = '#F4F1E8',
    visualHeight = 150,
    curveDepth = 85,
    curveWidth = 72,
    responseMode = 'elastic',
    sensitivity = 0.65,
    velocitySmoothing = 0.16,
    stiffness = 125,
    damping = 24,
    mass = 0.85,
    overshoot = 0.06,
    settleDelay = 70,
    verticalShift = 5,
    edgeTension = 78,
    highlightStrength = 0.08,
    reverseMorph = false,
    fullBleed = true,
    reducedMotion = true,
    style,
    className,
}: SectionMorphProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const settleTimerRef = useRef<number | null>(null);
    const returnTimerRef = useRef<number | null>(null);
    const previousScrollRef = useRef(0);
    const smoothedVelocityRef = useRef(0);
    const lastDirectionRef = useRef(1);

    const lenis = useLenis();

    const [prefersReduced, setPrefersReduced] = useState(false);
    useEffect(() => {
        if (!reducedMotion || typeof window === 'undefined') return;
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReduced(query.matches);
        const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        query.addEventListener?.('change', listener);
        return () => query.removeEventListener?.('change', listener);
    }, [reducedMotion]);

    const settings = useMemo(() => {
        if (responseMode !== 'custom') return PRESETS[responseMode];
        return {
            spring: { stiffness, damping, mass },
            sensitivity,
            overshoot,
            verticalShift,
            smoothing: velocitySmoothing,
        };
    }, [responseMode, stiffness, damping, mass, sensitivity, overshoot, verticalShift, velocitySmoothing]);

    const impulse = useMotionValue(0);
    const spring = useSpring(impulse, {
        stiffness: prefersReduced ? 300 : settings.spring.stiffness,
        damping: prefersReduced ? 45 : settings.spring.damping,
        mass: prefersReduced ? 0.5 : settings.spring.mass,
        restDelta: 0.0005,
        restSpeed: 0.0005,
    });

    const [morphAmount, setMorphAmount] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        return spring.on('change', (latest) => {
            setMorphAmount(clamp(latest, -1.2, 1.2));
        });
    }, [spring]);

    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        previousScrollRef.current = window.scrollY;
        smoothedVelocityRef.current = 0;
        impulse.set(0);
        spring.jump(0);
        setMorphAmount(0);
        setIsReady(true);

        const clearTimers = () => {
            if (settleTimerRef.current !== null) {
                window.clearTimeout(settleTimerRef.current);
                settleTimerRef.current = null;
            }
            if (returnTimerRef.current !== null) {
                window.clearTimeout(returnTimerRef.current);
                returnTimerRef.current = null;
            }
        };

        const scheduleSettle = () => {
            clearTimers();
            settleTimerRef.current = window.setTimeout(() => {
                if (prefersReduced || settings.overshoot === 0) {
                    impulse.set(0);
                    return;
                }
                impulse.set(-lastDirectionRef.current * settings.overshoot);
                returnTimerRef.current = window.setTimeout(() => impulse.set(0), 55);
            }, settleDelay);
        };

        const updateFromScroll = (scrollPos?: number) => {
            animationFrameRef.current = null;
            const element = wrapperRef.current;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const visibilityBuffer = visualHeight * 1.5;
            const isNearViewport =
                rect.bottom > -visibilityBuffer &&
                rect.top < window.innerHeight + visibilityBuffer;

            const currentScroll = typeof scrollPos === 'number' ? scrollPos : window.scrollY;
            const scrollDelta = currentScroll - previousScrollRef.current;
            previousScrollRef.current = currentScroll;

            if (!isNearViewport) {
                clearTimers();
                smoothedVelocityRef.current = 0;
                impulse.set(0);
                return;
            }

            if (scrollDelta === 0) return;

            lastDirectionRef.current = Math.sign(scrollDelta) || 1;
            const rawVelocity = (scrollDelta / 38) * settings.sensitivity;
            smoothedVelocityRef.current = mix(
                smoothedVelocityRef.current,
                rawVelocity,
                clamp(settings.smoothing, 0.02, 1)
            );

            let nextImpulse = clamp(smoothedVelocityRef.current, -1, 1);
            if (prefersReduced) nextImpulse *= 0.18;
            impulse.set(nextImpulse);
            scheduleSettle();
        };

        const requestScrollUpdate = () => {
            if (animationFrameRef.current !== null) return;
            animationFrameRef.current = window.requestAnimationFrame(() => updateFromScroll());
        };

        const handleResize = () => {
            previousScrollRef.current = window.scrollY;
            smoothedVelocityRef.current = 0;
            clearTimers();
            impulse.set(0);
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        window.addEventListener('resize', handleResize);

        // Also hook directly into Lenis if available for maximum fluidity
        let unsubLenis: (() => void) | undefined;
        if (lenis) {
            unsubLenis = lenis.on('scroll', (e: { scroll: number }) => {
                updateFromScroll(e.scroll);
            });
        }

        return () => {
            window.removeEventListener('scroll', requestScrollUpdate);
            window.removeEventListener('resize', handleResize);
            if (unsubLenis) unsubLenis();
            clearTimers();
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [visualHeight, settleDelay, prefersReduced, settings, impulse, spring, lenis]);

    const svgWidth = 1000;
    const signedAmount = morphAmount * (reverseMorph ? -1 : 1);
    const signedDepth = signedAmount * curveDepth;

    const dividerShift = signedAmount * settings.verticalShift;
    const centerY = visualHeight / 2 + dividerShift;
    const curveY = centerY + signedDepth;

    const normalizedCurveWidth = clamp(curveWidth, 10, 100) / 100;
    const normalizedTension = clamp(edgeTension, 0, 100) / 100;
    const baseInset = normalizedCurveWidth * 500;
    const tensionAdjustment = mix(130, 20, normalizedTension);
    const handleInset = clamp(baseInset + tensionAdjustment, 40, 475);
    const edgeLift = signedDepth * mix(0.18, 0.03, normalizedTension);
    const edgeY = centerY + edgeLift;

    const isTopTransparent = topColor === 'transparent';
    const isBottomTransparent = bottomColor === 'transparent';

    const curveTail = `V ${edgeY} C ${svgWidth - handleInset} ${curveY}, ${handleInset} ${curveY}, 0 ${edgeY} Z`;
    const pathData = `M 0 -40 H ${svgWidth} ${curveTail}`;
    const bottomPathData = `M 0 ${visualHeight + 40} H ${svgWidth} ${curveTail}`;
    const highlightPathData = `M 0 0 H ${svgWidth} ${curveTail}`;
    const highlightOpacity = clamp(highlightStrength, 0, 0.4);

    const rawId = useId();
    const id = rawId.replace(/:/g, '');

    const edgeMask = `linear-gradient(to bottom, transparent 0px, #000 ${OVERSCAN}px, #000 calc(100% - ${OVERSCAN}px), transparent 100%)`;

    const bleedStyles: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%',
    };

    return (
        <div
            ref={wrapperRef}
            className={className}
            style={{
                ...style,
                ...bleedStyles,
                marginTop: -OVERSCAN,
                marginBottom: -OVERSCAN,
                height: visualHeight + OVERSCAN * 2,
                minHeight: visualHeight + OVERSCAN * 2,
                overflow: 'hidden',
                pointerEvents: 'none',
                boxSizing: 'border-box',
                background: isTopTransparent || isBottomTransparent
                    ? 'transparent'
                    : `linear-gradient(to bottom, ${topColor} 50%, ${bottomColor} 50%)`,
                isolation: 'isolate',
                WebkitMaskImage: isTopTransparent || isBottomTransparent ? undefined : edgeMask,
                maskImage: isTopTransparent || isBottomTransparent ? undefined : edgeMask,
                visibility: isReady ? 'visible' : 'hidden',
                opacity: isReady ? 1 : 0,
            }}
        >
            <svg
                viewBox={`0 ${-OVERSCAN} ${svgWidth} ${visualHeight + OVERSCAN * 2}`}
                preserveAspectRatio="none"
                shapeRendering="geometricPrecision"
                aria-hidden="true"
                focusable="false"
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <defs>
                    <linearGradient id={`${id}-highlight`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                        <stop offset="85%" stopColor="#FFFFFF" stopOpacity={highlightOpacity} />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {isTopTransparent ? (
                    <path d={bottomPathData} fill={bottomColor} />
                ) : isBottomTransparent ? (
                    <path d={pathData} fill={topColor} />
                ) : (
                    <>
                        <rect x="0" y="-40" width={svgWidth} height={visualHeight + 80} fill={bottomColor} />
                        <path d={pathData} fill={topColor} />
                    </>
                )}
                {highlightStrength > 0 && (
                    <path d={highlightPathData} fill={`url(#${id}-highlight)`} />
                )}
            </svg>
        </div>
    );
}
