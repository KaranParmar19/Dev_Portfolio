'use client';

// Shape Divider Component based on Framer Shape Divider Pro
// Source: https://framer.com/m/Shape-Divider-Pro-fonVSR.js@TnA9n01Mj3z9OtUMIQxn

import React, { useId, useMemo } from 'react';

export const SHAPES = {
    wave: 'M0,40 C300,100 900,0 1200,40 L1200,120 L0,120 Z',
    waveSteep: 'M0,20 C400,120 800,0 1200,60 L1200,120 L0,120 Z',
    curve: 'M0,100 Q600,0 1200,100 L1200,120 L0,120 Z',
    curveAsymmetrical: 'M0,20 Q900,120 1200,40 L1200,120 L0,120 Z',
    tilt: 'M0,0 L1200,120 L0,120 Z',
    triangle: 'M600,0 L1200,120 L0,120 Z',
    triangleAsymmetrical: 'M0,120 L1000,0 L1200,120 Z',
    arrow: 'M0,120 L550,0 L600,30 L650,0 L1200,120 Z',
    split: 'M0,0 L600,120 L1200,0 L1200,120 L0,120 Z',
    zigzag: 'M0,60 L150,20 L300,60 L450,20 L600,60 L750,20 L900,60 L1050,20 L1200,60 L1200,120 L0,120 Z',
    zigzagFine: 'M0,80 L100,40 L200,80 L300,40 L400,80 L500,40 L600,80 L700,40 L800,80 L900,40 L1000,80 L1100,40 L1200,80 L1200,120 L0,120 Z',
    clouds: 'M0,80 Q75,40 150,80 Q225,40 300,80 Q375,40 450,80 Q525,40 600,80 Q675,40 750,80 Q825,40 900,80 Q975,40 1050,80 Q1125,40 1200,80 L1200,120 L0,120 Z',
    mountains: 'M0,120 L150,30 L300,120 L450,15 L600,120 L750,35 L900,120 L1050,20 L1200,120 Z',
    book: 'M0,30 C300,0 300,110 600,90 C900,70 900,10 1200,30 L1200,120 L0,120 Z',
    arc: 'M0,120 Q600,-20 1200,120 Z',
    bell: 'M0,120 C0,40 1200,40 1200,120 Z',
    roundedStep: 'M0,60 L500,60 Q550,60 550,10 L650,10 Q700,10 700,60 L1200,60 L1200,120 L0,120 Z',
    stairs: 'M0,120 L0,90 L200,90 L200,60 L400,60 L400,30 L600,30 L600,0 L1200,0 L1200,120 Z',
};

export type ShapeType = keyof typeof SHAPES;

export interface ShapeDividerProps {
    shape?: ShapeType;
    color?: string;
    height?: number;
    position?: 'top' | 'bottom';
    flip?: boolean;
    opacity?: number;
    shadow?: 'none' | 'subtle' | 'strong';
    className?: string;
    style?: React.CSSProperties;
}

export default function ShapeDivider({
    shape = 'triangle',
    color = '#fe9066',
    height = 60,
    position = 'top',
    flip = false,
    opacity = 1,
    shadow = 'none',
    className = '',
    style,
}: ShapeDividerProps) {
    const reactId = useId();
    const clipId = useMemo(
        () => `sd-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}-clip`,
        [reactId]
    );

    const shapePath = SHAPES[shape] ?? SHAPES.triangle;

    const transforms: string[] = [];
    if (position === 'top') transforms.push('scaleY(-1)');
    if (flip) transforms.push('scaleX(-1)');
    const transformValue = transforms.length ? transforms.join(' ') : undefined;

    const shadowFilter =
        shadow === 'subtle'
            ? 'drop-shadow(0 -4px 10px rgba(0, 0, 0, 0.06))'
            : shadow === 'strong'
            ? 'drop-shadow(0 -8px 20px rgba(0, 0, 0, 0.16))'
            : undefined;

    return (
        <div
            className={`shape-divider ${className}`}
            style={{
                position: 'relative',
                width: '100%',
                height,
                pointerEvents: 'none',
                overflow: 'visible',
                transform: transformValue,
                transformOrigin: 'center',
                filter: shadowFilter,
                zIndex: 20,
                ...style,
            }}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{ display: 'block', width: '100%', height: '100%' }}
            >
                <path d={shapePath} fill={color} opacity={opacity} />
            </svg>
        </div>
    );
}
