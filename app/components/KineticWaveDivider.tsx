'use client';

// Kinetic Wave Divider Component based on Framer WaveDivider
// Source: https://framer.com/m/KineticWaveDivider-Cl6ipY.js@bxQ2ujyfu74bwfi6qc0Z

import React, { useEffect, useRef } from 'react';

const LAYER_OPACITY = [1, 0.5, 0.25];

export interface KineticWaveDividerProps {
    colour?: string;
    background?: string;
    direction?: 'up' | 'down';
    layers?: number;
    swell?: number;
    waveLength?: number;
    speed?: number;
    flow?: 'left' | 'right';
    responsive?: boolean;
    animate?: boolean;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

export default function KineticWaveDivider({
    colour = '#00529B',
    background = 'transparent',
    direction = 'up',
    layers = 1,
    swell = 18,
    waveLength = 460,
    speed = 1,
    flow = 'right',
    responsive = true,
    animate = true,
    height = 64,
    className = '',
    style,
}: KineticWaveDividerProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const count = Math.max(1, Math.min(3, Math.round(layers)));

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        let w = 0;
        let h = 0;

        const measure = () => {
            const r = svg.getBoundingClientRect();
            w = r.width;
            h = r.height;
            svg.setAttribute('viewBox', `0 0 ${Math.max(1, w)} ${Math.max(1, h)}`);
        };
        measure();

        const reduced =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const still = reduced || !animate;
        const sign = flow === 'left' ? -1 : 1;

        const draw = (ms: number) => {
            if (!w || !h) return;
            const t = ms / 1000;

            // Smart width: narrow screens get a gentler swell and tighter waves
            const scale = responsive ? Math.min(1, Math.max(0.55, w / 1000)) : 1;
            const lambda = Math.max(40, waveLength * (0.7 + 0.3 * scale));
            const k1 = (Math.PI * 2) / lambda;
            const k2 = (Math.PI * 2) / (lambda / 2.4);
            const gapRatio = 0.6 * (count - 1);

            // Keep the wave inside the element no matter how short it is
            let A = swell * scale;
            A = Math.min(A, (h * 0.8 - 2) / (1.5 + gapRatio));
            A = Math.max(0, A);

            const gap = A * 0.6;
            const base = 1.5 * A + gap * (count - 1) + 2;
            const n = Math.max(24, Math.ceil(w / 5) + 1);

            for (let L = 0; L < count; L++) {
                const path = pathRefs.current[L];
                if (!path) continue;

                const amp = A * (1 - 0.15 * L);
                const off = base - gap * L;
                const v1 = speed * 52 * (1 + 0.25 * L) * sign;
                const v2 = -speed * 34 * (1 + 0.25 * L) * sign;
                const ph = L * 1.7;

                let d = '';
                for (let i = 0; i < n; i++) {
                    const x = (i * w) / (n - 1);
                    let y =
                        off +
                        amp * Math.sin(k1 * (x - v1 * t) + ph) +
                        amp * 0.5 * Math.sin(k2 * (x - v2 * t) - ph);
                    if (direction === 'down') y = h - y;
                    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(2) + ' ';
                }

                d +=
                    direction === 'down'
                        ? `L${w.toFixed(1)} -1 L0 -1 Z`
                        : `L${w.toFixed(1)} ${h + 1} L0 ${h + 1} Z`;

                path.setAttribute('d', d);
            }
        };

        let raf = 0;
        let running = false;

        const loop = (ms: number) => {
            draw(ms);
            raf = requestAnimationFrame(loop);
        };

        const start = () => {
            if (running || still) return;
            running = true;
            raf = requestAnimationFrame(loop);
        };

        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        draw(typeof performance !== 'undefined' ? performance.now() : 0);

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(() => {
                measure();
                if (!running) draw(performance.now());
            });
            ro.observe(svg);
        }

        let io: IntersectionObserver | null = null;
        if (!still) {
            if (typeof IntersectionObserver !== 'undefined') {
                io = new IntersectionObserver(
                    (entries) => {
                        if (entries[0] && entries[0].isIntersecting) start();
                        else stop();
                    },
                    { threshold: 0.01 }
                );
                io.observe(svg);
            } else {
                start();
            }
        }

        return () => {
            stop();
            if (ro) ro.disconnect();
            if (io) io.disconnect();
        };
    }, [animate, flow, responsive, waveLength, swell, speed, direction, count]);

    const order: number[] = [];
    for (let L = count - 1; L >= 0; L--) order.push(L);

    return (
        <div
            className={`kinetic-wave-divider ${className}`}
            style={{
                position: 'relative',
                width: '100%',
                height: typeof height === 'number' ? `${height}px` : height,
                background,
                pointerEvents: 'none',
                zIndex: 20,
                ...style,
            }}
            aria-hidden="true"
        >
            <svg
                ref={svgRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                }}
            >
                {order.map((L) => (
                    <path
                        key={L}
                        ref={(el) => {
                            pathRefs.current[L] = el;
                        }}
                        fill={colour}
                        fillOpacity={LAYER_OPACITY[L]}
                    />
                ))}
            </svg>
        </div>
    );
}
