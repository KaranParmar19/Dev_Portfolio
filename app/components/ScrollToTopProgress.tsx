'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useLenis } from '@/lenis/LenisScroll';

const BUTTON_SIZE = 52;
const RING_RADIUS = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ScrollToTopProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const reducedMotion = useReducedMotion();
    const lenis = useLenis();

    const updateScrollProgress = useCallback(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        setIsVisible(scrollTop > 100);
        setScrollProgress(scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0);
    }, []);

    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                updateScrollProgress();
                frame = 0;
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [updateScrollProgress]);

    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(0, {
                duration: reducedMotion ? 0 : 1.5,
                easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
                immediate: Boolean(reducedMotion),
                force: true,
            });
        } else {
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
        }
    };

    const progressOffset = RING_CIRCUMFERENCE * (1 - scrollProgress);

    return (
        <motion.button
            type="button"
            className="scroll-top-progress"
            aria-label="Back to top"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
            onClick={scrollToTop}
            initial={false}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.88, y: isVisible ? 0 : 12 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reducedMotion ? undefined : { scale: 1.05 }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
        >
            <svg
                className="scroll-top-progress-ring"
                width={BUTTON_SIZE + 12}
                height={BUTTON_SIZE + 12}
                viewBox={`0 0 ${BUTTON_SIZE + 12} ${BUTTON_SIZE + 12}`}
                aria-hidden="true"
            >
                <circle
                    cx={(BUTTON_SIZE + 12) / 2}
                    cy={(BUTTON_SIZE + 12) / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="3"
                    opacity="0.12"
                />
                <motion.circle
                    cx={(BUTTON_SIZE + 12) / 2}
                    cy={(BUTTON_SIZE + 12) / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    animate={{ strokeDashoffset: progressOffset }}
                    transition={{ duration: 0.08, ease: 'linear' }}
                    transform={`rotate(-90 ${(BUTTON_SIZE + 12) / 2} ${(BUTTON_SIZE + 12) / 2})`}
                />
            </svg>
            <svg className="scroll-top-progress-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 14l6-6 6 6" />
            </svg>
        </motion.button>
    );
}