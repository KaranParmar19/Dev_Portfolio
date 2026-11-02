'use client';

// Next Smooth Scroll Component based on Framer NextSmoothScroll
// Source: https://framer.com/m/NextSmoothScroll-4fhrqO.js@CUL9Rnqi9k64fNtJwwEW
// Complete TypeScript implementation with Lenis smooth-scroll engine,
// easing curves, reduced motion detection, DOM mutation scroll-lock observer,
// smooth anchor navigation, and optional progress / scroll-to-top overlays.

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const LENIS_CSS = `
html.lenis {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
`;

// Ref-count CSS so multiple instances share one style tag safely
let cssRefCount = 0;
function injectCSS() {
    cssRefCount++;
    if (cssRefCount > 1) return;
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('__lenis-css__');
    if (existing) return;
    const style = document.createElement('style');
    style.id = '__lenis-css__';
    style.textContent = LENIS_CSS;
    document.head.appendChild(style);
}

function removeCSS() {
    cssRefCount--;
    if (cssRefCount > 0) return;
    if (typeof document === 'undefined') return;
    document.getElementById('__lenis-css__')?.remove();
}

// Easing curves used together with `duration`. Maps progress 0..1 -> eased 0..1.
export const EASINGS: Record<string, (t: number) => number> = {
    default: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gentle: (t: number) => 1 - Math.pow(1 - t, 3),
    linear: (t: number) => t,
    snappy: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -12 * t)),
};

export type SmoothScrollEasing = 'default' | 'gentle' | 'linear' | 'snappy';
export type SmoothScrollOrientation = 'vertical' | 'horizontal';
export type ScrollTopCorner = 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface NextSmoothScrollProps {
    intensity?: number;
    easing?: SmoothScrollEasing;
    orientation?: SmoothScrollOrientation;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    smoothTouch?: boolean;
    respectReducedMotion?: boolean;
    disableBelow?: number;
    infinite?: boolean;
    resetScrollOnPageChange?: boolean;
    preventSelectors?: string;
    smoothAnchors?: boolean;
    anchorOffset?: number;
    showProgress?: boolean;
    progressColor?: string;
    progressHeight?: number;
    progressPosition?: 'top' | 'bottom';
    showScrollTop?: boolean;
    scrollTopThreshold?: number;
    scrollTopCorner?: ScrollTopCorner;
    scrollTopColor?: string;
    scrollTopIconColor?: string;
    scrollTopSize?: number;
    scrollTopRadius?: number;
    scrollTopOffset?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

// Context to allow child components to access the active Lenis instance
export const NextSmoothScrollContext = createContext<Lenis | null>(null);
export const useNextSmoothScroll = (): Lenis | null => useContext(NextSmoothScrollContext);

function getCornerStyle(corner: ScrollTopCorner, offset: number): React.CSSProperties {
    switch (corner) {
        case 'bottom-left':
            return { left: offset, bottom: offset };
        case 'bottom-center':
            return { left: '50%', bottom: offset };
        case 'bottom-right':
        default:
            return { right: offset, bottom: offset };
    }
}

function getButtonTransform(corner: ScrollTopCorner, visible: boolean): string {
    if (corner === 'bottom-center') {
        return visible ? 'translate(-50%, 0)' : 'translate(-50%, 12px)';
    }
    return visible ? 'translateY(0)' : 'translateY(12px)';
}

const ChevronUp = ({ color }: { color: string }) => (
    <svg
        width="52%"
        height="52%"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M6 15l6-6 6 6" />
    </svg>
);

export default function NextSmoothScroll({
    intensity = 10,
    easing = 'default',
    orientation = 'vertical',
    wheelMultiplier = 1,
    touchMultiplier = 1,
    smoothTouch = false,
    respectReducedMotion = true,
    disableBelow = 0,
    infinite = false,
    resetScrollOnPageChange = false,
    preventSelectors = '',
    smoothAnchors = true,
    anchorOffset = 0,
    showProgress = false,
    progressColor = '#fe9066',
    progressHeight = 4,
    progressPosition = 'top',
    showScrollTop = false,
    scrollTopThreshold = 400,
    scrollTopCorner = 'bottom-right',
    scrollTopColor = '#111111',
    scrollTopIconColor = '#FFFFFF',
    scrollTopSize = 48,
    scrollTopRadius = 24,
    scrollTopOffset = 24,
    style,
    children,
}: NextSmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);
    const [activeLenis, setActiveLenis] = useState<Lenis | null>(null);
    const scrollRestorationRef = useRef<string | null>(null);
    const progressFillRef = useRef<HTMLDivElement | null>(null);
    const thresholdRef = useRef(scrollTopThreshold);
    const anchorOffsetRef = useRef(anchorOffset);
    const lastPastRef = useRef(false);

    const [mounted, setMounted] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [enabledByWidth, setEnabledByWidth] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    const useLenis = enabledByWidth && !(respectReducedMotion && reducedMotion);

    useEffect(() => {
        thresholdRef.current = scrollTopThreshold;
    }, [scrollTopThreshold]);

    useEffect(() => {
        anchorOffsetRef.current = anchorOffset;
    }, [anchorOffset]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Inject Lenis CSS helper stylesheet
    useEffect(() => {
        if (typeof document === 'undefined') return;
        injectCSS();
        return removeCSS;
    }, []);

    // Track the disableBelow breakpoint width
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => setEnabledByWidth(!disableBelow || window.innerWidth >= disableBelow);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [disableBelow]);

    // Track prefers-reduced-motion
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(mq.matches);
        update();
        mq.addEventListener?.('change', update);
        return () => mq.removeEventListener?.('change', update);
    }, []);

    // Init Lenis engine and synchronize with GSAP ScrollTrigger
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateOverlays = (progress: number, position: number) => {
            const clamped = Math.min(1, Math.max(0, progress || 0));
            if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${clamped})`;
            }
            const past = position > thresholdRef.current;
            if (past !== lastPastRef.current) {
                lastPastRef.current = past;
                setShowTopBtn(past);
            }
        };

        const selectors = (preventSelectors || '').trim();
        const preventInside = (node: HTMLElement) => {
            if (!selectors || !node || typeof node.matches !== 'function') return false;
            try {
                return node.matches(selectors);
            } catch {
                return false;
            }
        };

        if (useLenis) {
            const duration = Math.max(0.1, (intensity ?? 10) / 10);
            const easingFn = EASINGS[easing] || EASINGS.default;

            const lenis = new Lenis({
                duration,
                easing: easingFn,
                orientation,
                gestureOrientation: orientation,
                smoothWheel: true,
                syncTouch: smoothTouch,
                wheelMultiplier: wheelMultiplier ?? 1,
                touchMultiplier: touchMultiplier ?? 1,
                infinite,
                prevent: preventInside,
            } as any);

            lenisRef.current = lenis;
            setActiveLenis(lenis);

            // Connect Lenis to GSAP ScrollTrigger for 60fps locked animations
            const removeScrollTriggerUpdate = lenis.on('scroll', (e: any) => {
                ScrollTrigger.update();
                const progress = typeof e?.progress === 'number' ? e.progress : 0;
                const position = e?.animatedScroll ?? e?.scroll ?? window.scrollY ?? 0;
                updateOverlays(progress, position);
            });

            // GSAP ticker drives Lenis raf for zero frame stuttering
            const tickerUpdate = (time: number) => {
                lenis.raf(time * 1000);
            };

            gsap.ticker.add(tickerUpdate);
            gsap.ticker.lagSmoothing(0);

            let refreshFrame = 0;
            let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
            const refreshScroll = () => {
                if (refreshFrame) cancelAnimationFrame(refreshFrame);
                if (refreshTimeout) clearTimeout(refreshTimeout);
                refreshFrame = requestAnimationFrame(() => {
                    lenis.resize();
                    ScrollTrigger.refresh();
                    refreshTimeout = setTimeout(() => {
                        lenis.resize();
                        ScrollTrigger.refresh();
                    }, 250);
                });
            };

            window.addEventListener('resize', refreshScroll);
            window.addEventListener('orientationchange', refreshScroll);
            window.addEventListener('pageshow', refreshScroll);
            window.visualViewport?.addEventListener('resize', refreshScroll);
            refreshScroll();

            updateOverlays(lenis.progress ?? 0, (lenis as any).animatedScroll ?? window.scrollY ?? 0);

            return () => {
                removeScrollTriggerUpdate();
                gsap.ticker.remove(tickerUpdate);
                window.removeEventListener('resize', refreshScroll);
                window.removeEventListener('orientationchange', refreshScroll);
                window.removeEventListener('pageshow', refreshScroll);
                window.visualViewport?.removeEventListener('resize', refreshScroll);
                if (refreshFrame) cancelAnimationFrame(refreshFrame);
                if (refreshTimeout) clearTimeout(refreshTimeout);
                lenis.destroy();
                lenisRef.current = null;
                setActiveLenis(null);
            };
        }

        // Native fallback (when reduced motion or below width)
        const computeNative = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            const position = window.scrollY || doc.scrollTop || 0;
            updateOverlays(max > 0 ? position / max : 0, position);
        };

        computeNative();
        window.addEventListener('scroll', computeNative, { passive: true });
        window.addEventListener('resize', computeNative);

        return () => {
            window.removeEventListener('scroll', computeNative);
            window.removeEventListener('resize', computeNative);
        };
    }, [
        useLenis,
        intensity,
        easing,
        orientation,
        smoothTouch,
        wheelMultiplier,
        touchMultiplier,
        infinite,
        preventSelectors,
    ]);

    // Manual scroll restoration on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (scrollRestorationRef.current === null) {
            scrollRestorationRef.current = history.scrollRestoration || 'auto';
            try {
                history.scrollRestoration = 'manual';
            } catch {
                // Ignore browser restriction errors
            }
        }
        return () => {
            if (scrollRestorationRef.current !== null) {
                try {
                    history.scrollRestoration = scrollRestorationRef.current as ScrollRestoration;
                } catch {
                    // Ignore
                }
                scrollRestorationRef.current = null;
            }
        };
    }, []);

    // Reset scroll on client-side route changes (optional)
    useEffect(() => {
        if (typeof window === 'undefined' || !resetScrollOnPageChange) return;

        const currentPath = { current: window.location.pathname };
        const forceScrollToTop = () => {
            requestAnimationFrame(() => {
                if (lenisRef.current) {
                    lenisRef.current.scrollTo(0, { immediate: true });
                } else {
                    window.scrollTo(0, 0);
                }
            });
        };

        const handleRouteChange = () => {
            if (currentPath.current !== window.location.pathname) {
                currentPath.current = window.location.pathname;
                forceScrollToTop();
            }
        };

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            const value = originalPushState.apply(history, args);
            handleRouteChange();
            return value;
        };

        history.replaceState = function (...args) {
            const value = originalReplaceState.apply(history, args);
            handleRouteChange();
            return value;
        };

        window.addEventListener('popstate', handleRouteChange);

        return () => {
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [resetScrollOnPageChange]);

    // MutationObserver: automatically pause Lenis smoothing when body/html overflow is hidden
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const check = () => {
            if (!lenisRef.current) return;
            const htmlHidden = document.documentElement?.style?.overflow === 'hidden';
            const bodyHidden = document.body?.style?.overflow === 'hidden';
            const stopEl = document.querySelector('[data-frameruni-stop-scroll]');
            if (htmlHidden || bodyHidden || stopEl) {
                lenisRef.current.stop();
            } else {
                lenisRef.current.start();
            }
        };

        check();
        const obs = new MutationObserver(check);
        const targets = [document.documentElement, document.body].filter(Boolean);
        targets.forEach((el) => {
            obs.observe(el, {
                attributes: true,
                attributeFilter: ['style', 'class'],
            });
        });

        return () => obs.disconnect();
    }, [useLenis]);

    // Delegated smooth anchor click handler for #hash links
    useEffect(() => {
        if (typeof document === 'undefined' || !smoothAnchors) return;

        const onClick = (e: MouseEvent) => {
            const lenis = lenisRef.current;
            if (!lenis) return;
            if (e.defaultPrevented || e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const a = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!a) return;
            if (a.target && a.target !== '_self') return;
            if (a.hasAttribute('data-lenis-prevent')) return;

            let url: URL;
            try {
                url = new URL(a.href, window.location.href);
            } catch {
                return;
            }

            // Only intercept same-page hash links
            if (
                url.origin !== window.location.origin ||
                url.pathname !== window.location.pathname ||
                url.search !== window.location.search ||
                !url.hash
            ) {
                return;
            }

            let el: HTMLElement | null = null;
            try {
                el = document.querySelector(decodeURIComponent(url.hash));
            } catch {
                el = null;
            }

            if (!el) return;

            const margin = parseInt(window.getComputedStyle(el).scrollMarginTop) || 0;
            e.preventDefault();
            lenis.scrollTo(el, {
                offset: -(margin + (anchorOffsetRef.current || 0)),
            });
        };

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [smoothAnchors]);

    const handleScrollTop = () => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0);
        } else if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const progressEdge = progressPosition === 'bottom' ? { bottom: 0 } : { top: 0 };

    const overlays =
        mounted && typeof document !== 'undefined'
            ? createPortal(
                  <>
                      {showProgress && (
                          <div
                              ref={progressFillRef}
                              aria-hidden="true"
                              style={{
                                  position: 'fixed',
                                  left: 0,
                                  ...progressEdge,
                                  width: '100%',
                                  height: progressHeight,
                                  background: progressColor,
                                  transformOrigin: '0 50%',
                                  transform: 'scaleX(0)',
                                  willChange: 'transform',
                                  pointerEvents: 'none',
                                  zIndex: 2147483646,
                              }}
                          />
                      )}
                      {showScrollTop && (
                          <button
                              type="button"
                              aria-label="Scroll to top"
                              onClick={handleScrollTop}
                              style={{
                                  position: 'fixed',
                                  ...getCornerStyle(scrollTopCorner, scrollTopOffset),
                                  width: scrollTopSize,
                                  height: scrollTopSize,
                                  borderRadius: scrollTopRadius,
                                  background: scrollTopColor,
                                  color: scrollTopIconColor,
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                                  opacity: showTopBtn ? 1 : 0,
                                  transform: getButtonTransform(scrollTopCorner, showTopBtn),
                                  transition: 'opacity .25s ease, transform .25s ease',
                                  pointerEvents: showTopBtn ? 'auto' : 'none',
                                  zIndex: 2147483647,
                                  padding: 0,
                              }}
                          >
                              <ChevronUp color={scrollTopIconColor} />
                          </button>
                      )}
                  </>,
                  document.body
              )
            : null;

    return (
        <NextSmoothScrollContext.Provider value={activeLenis}>
            <div style={style} />
            {children}
            {overlays}
        </NextSmoothScrollContext.Provider>
    );
}
