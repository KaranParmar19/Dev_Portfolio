'use client';

// Scroll Blur By Aki Component based on Framer ScrollBlurByAki
// Source: https://framer.com/m/ScrollBlurByAki-pwMQyG.js@SLso7ynHNmZV87OgToUp
// Lightweight progressive backdrop blur made from layered gradient masks.

import React, { useMemo } from 'react';

const LAYER_MIN = 1;
const LAYER_MAX = 8;
const QUALITY_LAYER_PRESETS: Record<'low' | 'balanced' | 'high', number> = {
    low: 3,
    balanced: 4,
    high: 6,
};

export type ScrollBlurQuality = 'low' | 'balanced' | 'high' | 'custom';
export type ScrollBlurDirection = 'top' | 'bottom';

export interface ScrollBlurProps {
    direction?: ScrollBlurDirection;
    blur?: number;
    quality?: ScrollBlurQuality;
    layers?: number;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}

function clampLayerCount(value: number): number {
    return Math.min(LAYER_MAX, Math.max(LAYER_MIN, Math.round(value)));
}

function resolveLayerCount(quality: ScrollBlurQuality, customLayers?: number): number {
    if (quality === 'custom' && customLayers !== undefined) {
        return clampLayerCount(customLayers);
    }
    return clampLayerCount(QUALITY_LAYER_PRESETS[quality as 'low' | 'balanced' | 'high'] ?? 4);
}

function getMaskDirection(direction: ScrollBlurDirection): string {
    return direction === 'top' ? 'to bottom' : 'to top';
}

function buildLayerMask(direction: ScrollBlurDirection, index: number, total: number): string {
    const segment = 100 / total;
    const edge = 100 - index * segment;
    const softStart = Math.max(0, edge - segment);
    return `linear-gradient(${getMaskDirection(direction)}, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${softStart}%, rgba(255,255,255,0) ${edge}%)`;
}

function buildLayerStyle(
    direction: ScrollBlurDirection,
    index: number,
    total: number,
    blur: number
): React.CSSProperties {
    const layerBlur = (blur * (index + 1)) / total;
    const blurFilter = `blur(${layerBlur}px)`;
    const mask = buildLayerMask(direction, index, total);

    return {
        position: 'absolute',
        inset: 0,
        backdropFilter: blurFilter,
        WebkitBackdropFilter: blurFilter,
        maskImage: mask,
        WebkitMaskImage: mask,
        pointerEvents: 'none',
    };
}

export default function ScrollBlurByAki({
    direction = 'top',
    blur = 16,
    quality = 'high',
    layers = 6,
    height,
    className = '',
    style,
}: ScrollBlurProps) {
    const effectiveLayers = resolveLayerCount(quality, layers);

    const layerElements = useMemo(() => {
        if (blur <= 0) return null;
        const elements: React.ReactNode[] = [];
        for (let i = 0; i < effectiveLayers; i++) {
            elements.push(
                <div
                    key={i}
                    style={buildLayerStyle(direction, i, effectiveLayers, blur)}
                    aria-hidden="true"
                />
            );
        }
        return elements;
    }, [direction, blur, effectiveLayers]);

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
    };

    return (
        <div className={`scroll-blur-by-aki ${className}`} style={containerStyle} aria-hidden="true">
            {layerElements}
        </div>
    );
}
