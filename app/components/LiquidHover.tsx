'use client';

import React, { useEffect, useRef, useId, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';

export interface LiquidHoverProps {
    children: React.ReactNode;
    distortion?: number;
    speed?: number;
    waveDetail?: number;
    className?: string;
    style?: React.CSSProperties;
    enabled?: boolean;
}

export default function LiquidHover({
    children,
    distortion = 45,
    speed = 1,
    waveDetail = 0.01,
    className = '',
    style,
    enabled = true,
}: LiquidHoverProps) {
    const rawId = useId().replace(/:/g, '');
    const [filterId] = useState(() => `liquid-hover-${rawId}`);

    const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
    const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
    const scale = useMotionValue(enabled ? distortion : 0);
    const wobbleTime = useRef(0);
    const wobbleRafId = useRef<number | null>(null);

    useEffect(() => {
        return scale.on('change', (v) => {
            if (displacementRef.current) {
                displacementRef.current.setAttribute('scale', String(v));
            }
        });
    }, [scale]);

    useEffect(() => {
        if (!enabled) {
            scale.set(0);
            if (displacementRef.current) {
                displacementRef.current.setAttribute('scale', '0');
            }
            if (wobbleRafId.current) {
                cancelAnimationFrame(wobbleRafId.current);
                wobbleRafId.current = null;
            }
            return;
        }

        let loopControls: ReturnType<typeof animate> | null = null;
        let isCancelled = false;

        // Smooth continuous framer-motion liquid animation
        // Ramps up smoothly from current scale (0) to initial distortion, then loops infinitely
        const rampControls = animate(
            scale,
            distortion * 0.8,
            {
                duration: 1.2 / speed,
                ease: "easeOut",
                onComplete: () => {
                    if (isCancelled) return;
                    loopControls = animate(
                        scale,
                        [distortion * 0.8, distortion * 1.15, distortion * 0.8],
                        {
                            duration: 3 / speed,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                    );
                }
            }
        );

        const loop = () => {
            wobbleTime.current += 0.02 * speed;
            if (turbulenceRef.current) {
                const f = waveDetail + Math.sin(wobbleTime.current) * waveDetail * 0.35;
                turbulenceRef.current.setAttribute('baseFrequency', `${f} ${f * 1.5}`);
            }
            wobbleRafId.current = requestAnimationFrame(loop);
        };

        wobbleRafId.current = requestAnimationFrame(loop);

        return () => {
            isCancelled = true;
            rampControls.stop();
            loopControls?.stop();
            if (wobbleRafId.current) {
                cancelAnimationFrame(wobbleRafId.current);
                wobbleRafId.current = null;
            }
        };
    }, [enabled, distortion, speed, waveDetail, scale]);

    return (
        <div
            className={`relative select-none ${className || 'inline-block'}`}
            style={{
                position: 'relative',
                ...style,
            }}
        >
            <svg
                width="0"
                height="0"
                style={{ position: 'absolute', pointerEvents: 'none' }}
                aria-hidden="true"
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            ref={turbulenceRef}
                            type="fractalNoise"
                            baseFrequency={`${waveDetail} ${waveDetail * 1.5}`}
                            numOctaves={2}
                            seed={7}
                            result="noise"
                        />
                        <feDisplacementMap
                            ref={displacementRef}
                            in="SourceGraphic"
                            in2="noise"
                            scale="0"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>
            <div
                style={{
                    filter: enabled ? `url(#${filterId})` : 'none',
                    willChange: enabled ? 'filter' : undefined,
                }}
            >
                {children}
            </div>
        </div>
    );
}
