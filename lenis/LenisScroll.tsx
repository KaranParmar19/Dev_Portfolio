'use client';

// LenisScroll provider powered by NextSmoothScroll (Framer component)
// Source: https://framer.com/m/NextSmoothScroll-4fhrqO.js@CUL9Rnqi9k64fNtJwwEW

import React, { ReactNode } from 'react';
import Lenis from 'lenis';
import NextSmoothScroll, {
    useNextSmoothScroll,
    NextSmoothScrollProps,
    EASINGS,
} from '@/app/components/NextSmoothScroll';

// Re-export hook so existing components continue to function seamlessly
export const useLenis = (): Lenis | null => useNextSmoothScroll();

export { EASINGS };
export type { NextSmoothScrollProps };

export interface LenisProviderProps extends NextSmoothScrollProps {
    children: ReactNode;
}

/**
 * LenisProvider initializes the Framer NextSmoothScroll engine.
 * Includes duration/intensity curves, smooth anchor navigation,
 * MutationObserver scroll-lock handling, and GSAP ScrollTrigger sync.
 */
export const LenisProvider = ({
    children,
    intensity = 10,
    easing = 'default',
    orientation = 'vertical',
    wheelMultiplier = 1,
    touchMultiplier = 1,
    smoothTouch = false,
    respectReducedMotion = true,
    disableBelow = 0,
    smoothAnchors = true,
    preventSelectors = '',
    showProgress = false,
    showScrollTop = false,
    ...rest
}: LenisProviderProps) => {
    return (
        <NextSmoothScroll
            intensity={intensity}
            easing={easing}
            orientation={orientation}
            wheelMultiplier={wheelMultiplier}
            touchMultiplier={touchMultiplier}
            smoothTouch={smoothTouch}
            respectReducedMotion={respectReducedMotion}
            disableBelow={disableBelow}
            smoothAnchors={smoothAnchors}
            preventSelectors={preventSelectors}
            showProgress={showProgress}
            showScrollTop={showScrollTop}
            {...rest}
        >
            {children}
        </NextSmoothScroll>
    );
};

export default LenisProvider;
