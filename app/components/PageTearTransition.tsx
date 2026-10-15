'use client';

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

/** Small deterministic PRNG so a given seed always tears the same way. */
function mulberry32(seed: number) {
    let a = (seed >>> 0) || 1;
    return function next() {
        a |= 0;
        a = (a + 1831565813) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function clamp(value: number, min: number, max: number) {
    return value < min ? min : value > max ? max : value;
}

/**
 * Offsets along the tear, each in [-0.5, 0.5] of the tear depth.
 * A correlated walk so the edge reads as a realistic torn paper fibre.
 */
function buildEdge(points: number, seed: number, roughness: number) {
    const random = mulberry32(seed);
    const out: number[] = [];
    let value = 0;
    let velocity = 0;
    for (let i = 0; i < points; i++) {
        const wander = 0.3 * Math.sin(i * 0.085 + 1.1) + 0.14 * Math.sin(i * 0.23 + 0.4);
        velocity = velocity * 0.62 + (random() - 0.5) * 0.11 * roughness;
        velocity = clamp(velocity, -0.15, 0.15);
        value += velocity;
        value += (0 - value) * 0.06;
        let offset = value + wander * roughness;
        if (random() < 0.05) {
            // occasional single-point fibre
            offset += (random() < 0.5 ? -1 : 1) * (0.1 + random() * 0.14) * roughness;
        }
        out.push(clamp(offset, -0.5, 0.5));
    }
    return out;
}

/**
 * Both halves are built from the exact same edge offsets, so one side's teeth are
 * the negative of the other's and they mesh with zero gap.
 */
function buildClip(edge: number[], depth: number, side: 'start' | 'end') {
    const span = 50 + depth / 2; // panel size, % of viewport
    const count = edge.length;
    const points: string[] = [];
    for (let i = 0; i < count; i++) {
        const along = (i / (count - 1)) * 100;
        const seam = 50 + edge[i] * depth; // seam position, % of viewport
        const across = side === 'start' ? (seam / span) * 100 : ((depth / 2 + edge[i] * depth) / span) * 100;
        const a = across.toFixed(3);
        const b = along.toFixed(3);
        points.push(`${a}% ${b}%`);
    }
    const corner = side === 'start' ? '0%' : '100%';
    const head = `${corner} 0%`;
    const tail = `${corner} 100%`;
    return `polygon(${head}, ${points.join(', ')}, ${tail})`;
}

export interface PageTearTransitionProps {
    phase: 'closing' | 'tearing';
    onCloseComplete?: () => void;
    onTearComplete?: () => void;
    depth?: number;
    roughness?: number;
    detail?: number;
    seed?: number;
    color?: string;
}

export default function PageTearTransition({
    phase,
    depth = 8,
    roughness = 1,
    detail = 160,
    seed = 42,
    color = '#1b1b1a',
}: PageTearTransitionProps) {
    const { startClip, endClip } = useMemo(() => {
        const points = Math.max(8, Math.round(detail));
        const edge = buildEdge(points, Math.round(seed), roughness);
        return {
            startClip: buildClip(edge, depth, 'start'),
            endClip: buildClip(edge, depth, 'end'),
        };
    }, [detail, seed, roughness, depth]);

    if (typeof document === 'undefined') return null;

    const span = `calc(50% + ${depth / 2}%)`;

    const isMint =
        color === '#dcfce7' ||
        color.toLowerCase().includes('dcfce7');

    const isCream =
        color === '#f4f1eb' ||
        color.toLowerCase().includes('f4f1eb');

    const isYellow =
        color === '#fef08a' ||
        color === '#f2c94c' ||
        color === '#ffe14d' ||
        color.toLowerCase().includes('yellow');

    const sharedStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        width: span,
        backgroundColor: color,
        backgroundImage: isMint
            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
            : isCream
            ? 'linear-gradient(135deg, #f7f5ef 0%, #ede8de 100%)'
            : isYellow
            ? 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
            : color.startsWith('#') && color !== '#1b1b1a'
            ? `linear-gradient(135deg, ${color} 0%, ${color} 100%)`
            : 'linear-gradient(135deg, #22262d 0%, #15171c 100%)',
        pointerEvents: 'none',
        willChange: 'transform',
        zIndex: 2147483000,
        boxShadow: isMint
            ? '0 0 32px rgba(16, 185, 129, 0.28)'
            : isCream
            ? '0 0 32px rgba(0, 0, 0, 0.32)'
            : isYellow
            ? '0 0 28px rgba(0, 0, 0, 0.35)'
            : '0 0 24px rgba(0, 0, 0, 0.45)',
    };

    return createPortal(
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2147483000,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
        >
            {/* Left torn panel */}
            <motion.div
                initial={phase === 'closing' ? { x: '-100%' } : { x: '0%' }}
                animate={phase === 'closing' ? { x: '0%' } : { x: '-100%' }}
                transition={{
                    duration: phase === 'closing' ? 0.58 : 1.05,
                    ease: phase === 'closing' ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
                }}
                style={{
                    ...sharedStyle,
                    left: 0,
                    clipPath: startClip,
                    WebkitClipPath: startClip,
                }}
            />

            {/* Right torn panel */}
            <motion.div
                initial={phase === 'closing' ? { x: '100%' } : { x: '0%' }}
                animate={phase === 'closing' ? { x: '0%' } : { x: '100%' }}
                transition={{
                    duration: phase === 'closing' ? 0.58 : 1.05,
                    ease: phase === 'closing' ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
                }}
                style={{
                    ...sharedStyle,
                    right: 0,
                    clipPath: endClip,
                    WebkitClipPath: endClip,
                }}
            />
        </div>,
        document.body
    );
}
