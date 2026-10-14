'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame, useSpring } from 'framer-motion';

export interface LiquidWord {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface LiquidHeadingProps {
    text?: string;
    words?: LiquidWord[];
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
    intensity?: number;
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
    letterStyle?: React.CSSProperties;
    align?: 'left' | 'center' | 'right';
    startIndex?: number;
}

interface FlattenedLetter {
    letter: string;
    globalIndex: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function LiquidHeading({
    text,
    words,
    as: Component = 'h2',
    intensity = 1,
    speed = 1,
    className = '',
    style,
    letterStyle,
    align = 'center',
    startIndex = 0,
}: LiquidHeadingProps) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener?.('change', handler);
        return () => mediaQuery.removeEventListener?.('change', handler);
    }, []);

    // Global time motion value updated via rAF without triggering React re-renders
    const time = useMotionValue(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useAnimationFrame((t) => {
        if (!prefersReducedMotion) {
            time.set(t / 1000);
        }
    });

    // Flatten words or text into a list of letters with continuous index
    const flatLetters = useMemo<FlattenedLetter[]>(() => {
        const result: FlattenedLetter[] = [];
        let indexCounter = startIndex;

        if (words && words.length > 0) {
            words.forEach((word) => {
                const chars = word.text.split('');
                chars.forEach((char) => {
                    result.push({
                        letter: char,
                        globalIndex: indexCounter++,
                        className: word.className,
                        style: word.style,
                    });
                });
            });
        } else if (text) {
            const chars = text.split('');
            chars.forEach((char) => {
                result.push({
                    letter: char,
                    globalIndex: indexCounter++,
                });
            });
        }

        return result;
    }, [text, words]);

    const justifyMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };

    return (
        <Component
            className={className}
            style={{
                position: 'relative',
                display: 'inline-flex',
                flexWrap: 'wrap',
                justifyContent: justifyMap[align] || 'center',
                alignItems: 'baseline',
                ...style,
            }}
        >
            {flatLetters.map((item) => (
                <LiquidLetter
                    key={item.globalIndex}
                    letter={item.letter}
                    index={item.globalIndex}
                    time={time}
                    hoveredIndex={hoveredIndex}
                    onHoverStart={() => setHoveredIndex(item.globalIndex)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    intensity={intensity}
                    speed={speed}
                    prefersReducedMotion={prefersReducedMotion}
                    className={item.className}
                    style={{ ...letterStyle, ...item.style }}
                />
            ))}
        </Component>
    );
}

interface LiquidLetterProps {
    letter: string;
    index: number;
    time: any;
    hoveredIndex: number | null;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    intensity: number;
    speed: number;
    prefersReducedMotion: boolean;
    className?: string;
    style?: React.CSSProperties;
}

function LiquidLetter({
    letter,
    index,
    time,
    hoveredIndex,
    onHoverStart,
    onHoverEnd,
    intensity,
    speed,
    prefersReducedMotion,
    className = '',
    style,
}: LiquidLetterProps) {
    const isHovered = hoveredIndex === index;

    // 1. Vertical Position (Y): Base wave + hover shake + ripple spreading to neighbors
    const y = useTransform(time, (t: number) => {
        if (prefersReducedMotion) return 0;
        const baseWave = Math.sin(t * 2 * speed + index * 0.5) * 2.5 * intensity;
        const hoverShake = isHovered ? Math.sin(t * 4 * speed) * 0.8 * intensity : 0;
        let ripple = 0;
        if (hoveredIndex !== null) {
            const distance = Math.abs(index - hoveredIndex);
            const strength = Math.max(0, 1 - distance * 0.3);
            ripple = Math.sin(t * 5 * speed - distance * 0.4) * 6 * intensity * strength;
        }
        return baseWave + hoverShake + ripple;
    });

    // 2. Scale: Breathing + hover scale + neighbor pulse
    const scale = useTransform(time, (t: number) => {
        const baseScale = prefersReducedMotion
            ? 1
            : 1 + Math.sin(t * 1.5 * speed + index * 0.3) * 0.03 * intensity;
        const hoverScale = isHovered ? 1.05 : 1;
        let rippleScale = 1;
        if (hoveredIndex !== null && !prefersReducedMotion) {
            const distance = Math.abs(index - hoveredIndex);
            const strength = Math.max(0, 1 - distance * 0.3);
            rippleScale = 1 + Math.sin(t * 5 * speed - distance * 0.4) * 0.06 * intensity * strength;
        }
        return baseScale * hoverScale * rippleScale;
    });

    // 3. Horizontal Skew (liquid wobble)
    const skewX = useTransform(time, (t: number) =>
        prefersReducedMotion ? 0 : Math.sin(t * 2.5 * speed + index * 0.4) * 1.2 * intensity
    );

    // 4. Vertical Skew (distortion frequency)
    const skewY = useTransform(time, (t: number) =>
        prefersReducedMotion ? 0 : Math.cos(t * 2 * speed + index * 0.6) * 0.8 * intensity
    );

    // 5. Subtle blur spring on hover for liquid depth
    const blur = useSpring(isHovered ? 0.25 : 0, { stiffness: 200, damping: 25 });
    const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : 'none'));

    // Handle space cleanly without collapse
    if (letter === ' ') {
        return (
            <span
                style={{
                    display: 'inline-block',
                    width: '0.28em',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                &nbsp;
            </span>
        );
    }

    return (
        <motion.span
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            className={className}
            style={{
                display: 'inline-block',
                cursor: 'pointer',
                userSelect: 'none',
                position: 'relative',
                transformOrigin: 'center center',
                willChange: 'transform',
                y,
                scale,
                skewX,
                skewY,
                filter,
                ...style,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            {letter}
        </motion.span>
    );
}
