'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export interface CurtainLoadScreenProps {
    phase: 'covering' | 'revealing';
    color?: string;
}

/**
 * Interactive Components/Preloader/LoadScreen
 * Recreated from Framer: https://framer.com/m/Interactive-Components-Preloader-LoadScreen-j67ejr.js@avLwyyJ0iIdSjc2rmvzz
 * 
 * Features:
 * - 5 vertical columns spanning 20% viewport width each.
 * - 1px semi-transparent borders separating each column.
 * - Center-outwards curtain sequence:
 *   - Column 3 (center) moves first.
 *   - Columns 2 & 4 (flanks) follow.
 *   - Columns 1 & 5 (edges) complete the motion.
 * - Framer's signature cubic-bezier tween: [1, 0, 0.56, 1].
 */
export default function CurtainLoadScreen({
    phase,
    color = 'rgb(255, 47, 0)',
}: CurtainLoadScreenProps) {
    if (typeof document === 'undefined') return null;

    // 5 vertical columns, center-outwards stagger:
    // Index 2 is center (distance 0)
    // Index 1, 3 are inner flanks (distance 1)
    // Index 0, 4 are outer edges (distance 2)
    const columns = [0, 1, 2, 3, 4];

    return createPortal(
        <div
            aria-hidden="true"
            className="curtain-load-screen"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2147483000,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
        >
            {columns.map((index) => {
                const distanceFromCenter = Math.abs(index - 2);

                const coverDelay = distanceFromCenter * 0.07;
                const revealDelay = distanceFromCenter * 0.16;

                return (
                    <motion.div
                        key={index}
                        initial={phase === 'covering' ? { scaleY: 0 } : { scaleY: 1 }}
                        animate={phase === 'covering' ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{
                            duration: phase === 'covering' ? 0.45 : 0.8,
                            delay: phase === 'covering' ? coverDelay : revealDelay,
                            ease: [1, 0, 0.56, 1],
                        }}
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            bottom: '-20px',
                            left: `${index * 20}%`,
                            width: '20.15%',
                            backgroundColor: color,
                            borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRight: index === 4 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                            transformOrigin: 'top',
                            willChange: 'transform',
                        }}
                    />
                );
            })}
        </div>,
        document.body
    );
}
