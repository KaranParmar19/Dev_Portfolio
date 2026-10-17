'use client';

import React, { useEffect, useState } from 'react';
import ScrollBlurByAki, { ScrollBlurProps } from './ScrollBlurByAki';
import { useLenis } from '@/lenis/LenisScroll';

interface BottomScrollBlurProps extends ScrollBlurProps {
    threshold?: number;
    footerId?: string;
}

export default function BottomScrollBlur({
    direction = 'bottom',
    blur = 20,
    quality = 'high',
    className = '',
    footerId = 'contact-editorial-footer',
    ...rest
}: BottomScrollBlurProps) {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const lenis = useLenis();

    useEffect(() => {
        let frame = 0;

        const checkBottom = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                const footer = document.getElementById(footerId);
                const clientHeight = window.innerHeight;
                const scrollHeight = document.documentElement.scrollHeight;
                const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
                const scrollableHeight = scrollHeight - clientHeight;
                const distanceFromBottom = scrollableHeight - scrollTop;

                let atBottom = false;

                if (footer) {
                    const rect = footer.getBoundingClientRect();
                    // When the footer reaches the bottom area of the viewport,
                    // smoothly hide the blur so the footer text is completely sharp and legible.
                    atBottom = rect.top < clientHeight + 20;
                } else {
                    // Fallback to remaining scroll distance if element is not in DOM
                    const threshold = window.innerWidth < 640 ? 220 : 160;
                    atBottom = scrollableHeight > 0 && distanceFromBottom <= threshold;
                }

                setIsAtBottom((prev) => (prev !== atBottom ? atBottom : prev));
                frame = 0;
            });
        };

        checkBottom();
        window.addEventListener('scroll', checkBottom, { passive: true });
        window.addEventListener('resize', checkBottom);

        let unbindLenis: (() => void) | undefined;
        if (lenis) {
            unbindLenis = lenis.on('scroll', checkBottom);
        }

        return () => {
            window.removeEventListener('scroll', checkBottom);
            window.removeEventListener('resize', checkBottom);
            if (unbindLenis) unbindLenis();
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [lenis, footerId]);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 h-24 sm:h-32 z-30 pointer-events-none transition-all duration-500 ease-out ${
                isAtBottom ? 'opacity-0 invisible' : 'opacity-100 visible'
            } ${className}`}
            style={{
                transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), visibility 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            aria-hidden="true"
        >
            <ScrollBlurByAki direction={direction} blur={blur} quality={quality} {...rest} />
        </div>
    );
}
