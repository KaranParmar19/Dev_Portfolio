'use client';

// Count Up component based on Plainware Count Up
// Counts to any figure with zero layout shift, maintaining prefix, suffix, and separators.

import React, { useEffect, useId, useMemo, useRef } from 'react';
import { animate, useMotionValue } from 'framer-motion';

const FIGURE = /^(\D*?)(\d(?:[\d.,]*\d)?)([\s\S]*)$/;

function parseFigure(value: string) {
    const m = String(value).match(FIGURE);
    if (!m) return null;
    const prefix = m[1];
    const raw = m[2];
    const suffix = m[3];
    const commas = raw.split(',').length - 1;
    const dots = raw.split('.').length - 1;
    let group = '';
    let point = '.';
    if (commas && dots) {
        if (raw.lastIndexOf('.') > raw.lastIndexOf(',')) group = ',';
        else {
            group = '.';
            point = ',';
        }
    } else if (commas) {
        if (commas === 1 && !/^\d{1,3},\d{3}$/.test(raw)) point = ',';
        else group = ',';
    } else if (dots > 1) {
        group = '.';
    }
    const parts = raw.split(point);
    if (parts.length > 2) return null;
    const int = group ? parts[0].split(group).join('') : parts[0];
    const frac = parts[1] || '';
    if (!/^\d+$/.test(int) || (frac && !/^\d+$/.test(frac))) return null;
    const target = parseFloat(int + (frac ? '.' + frac : ''));
    if (!isFinite(target)) return null;
    return { prefix, suffix, target, decimals: frac.length, group, point };
}

function formatNumber(v: number, f: NonNullable<ReturnType<typeof parseFigure>>) {
    const fixed = Math.abs(v).toFixed(f.decimals);
    const [i, d] = fixed.split('.');
    const int = f.group ? i.replace(/\B(?=(\d{3})+(?!\d))/g, f.group) : i;
    const sign = v < 0 && Number(fixed) !== 0 ? '-' : '';
    return sign + int + (d ? f.point + d : '');
}

function prefersReducedMotion() {
    return (
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

const srOnly: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
};

export interface CountUpProps {
    value: string | number;
    from?: number;
    duration?: number;
    delay?: number;
    easing?: 'easeOut' | 'linear' | 'spring';
    trigger?: 'inView' | 'load';
    once?: boolean;
    tabular?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function CountUp({
    value = '0',
    from = 0,
    duration = 1.8,
    delay = 0,
    easing = 'easeOut',
    trigger = 'inView',
    once = true,
    tabular = true,
    className = '',
    style,
}: CountUpProps) {
    const strVal = String(value ?? 0);
    const id = 'pw' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const rootRef = useRef<HTMLSpanElement>(null);
    const liveRef = useRef<HTMLSpanElement>(null);
    const figure = useMemo(() => parseFigure(strVal), [strVal]);

    const ghosts = useMemo(() => {
        const out = new Set([strVal]);
        if (!figure) return Array.from(out);
        const shapes = [formatNumber(from, figure), formatNumber(figure.target, figure)];
        for (const s of shapes) {
            for (const d of '0123456789') {
                out.add(figure.prefix + s.replace(/\d/g, d) + figure.suffix);
            }
        }
        return Array.from(out);
    }, [strVal, from, figure]);

    const count = useMotionValue(from);

    useEffect(() => {
        return count.on('change', (v: number) => {
            if (liveRef.current && figure) {
                liveRef.current.textContent = figure.prefix + formatNumber(v, figure) + figure.suffix;
            }
        });
    }, [count, figure]);

    useEffect(() => {
        const root = rootRef.current;
        const live = liveRef.current;
        if (!root || !live) return;

        if (!figure || prefersReducedMotion()) {
            live.textContent = strVal;
            live.style.opacity = '1';
            return;
        }

        const f = figure;
        const startText = f.prefix + formatNumber(from, f) + f.suffix;
        let alive = true;
        let timer = 0;
        let controls: any = null;
        let io: IntersectionObserver | null = null;

        const stop = () => {
            window.clearTimeout(timer);
            if (controls) controls.stop();
            controls = null;
        };

        const play = () => {
            stop();
            count.set(from);
            live.textContent = startText;
            live.style.opacity = '1';
            timer = window.setTimeout(() => {
                if (!alive) return;
                const options =
                    easing === 'spring'
                        ? { type: 'spring' as const, duration, bounce: 0 }
                        : { duration, ease: easing === 'linear' ? ('linear' as const) : ([0, 0, 0.58, 1] as const) };

                controls = animate(count, f.target, {
                    ...options,
                    onComplete: () => {
                        live.textContent = strVal;
                    },
                });
            }, Math.max(0, delay) * 1000);
        };

        if (trigger === 'load' || typeof IntersectionObserver === 'undefined') {
            play();
        } else {
            io = new IntersectionObserver(
                (entries) => {
                    const e = entries[entries.length - 1];
                    if (e.isIntersecting) {
                        play();
                        if (once && io) {
                            io.disconnect();
                            io = null;
                        }
                    } else if (!once) {
                        stop();
                        live.textContent = startText;
                    }
                },
                { threshold: 0.1 }
            );
            io.observe(root);
        }

        return () => {
            alive = false;
            stop();
            if (io) io.disconnect();
            live.textContent = strVal;
        };
    }, [strVal, from, duration, delay, easing, trigger, once, figure]);

    const cell: React.CSSProperties = { gridArea: '1 / 1' };

    return (
        <span
            ref={rootRef}
            data-pw-count={id}
            className={className}
            style={{
                position: 'relative',
                display: 'inline-grid',
                margin: 0,
                whiteSpace: 'pre',
                fontVariantNumeric: tabular ? 'tabular-nums' : 'normal',
                width: 'max-content',
                verticalAlign: 'baseline',
                ...style,
            }}
        >
            <span style={srOnly}>{strVal}</span>
            {ghosts.map((g) => (
                <span key={g} aria-hidden="true" style={{ ...cell, visibility: 'hidden' }}>
                    {g}
                </span>
            ))}
            <span ref={liveRef} aria-hidden="true" style={cell}>
                {strVal}
            </span>
        </span>
    );
}
