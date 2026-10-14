'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, SplitText);
gsap.config({ force3D: true });

interface IntroOverlayProps {
    shouldPlay: boolean;
    onComplete: () => void;
}

const IntroOverlay = ({ shouldPlay, onComplete }: IntroOverlayProps) => {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const firstTextRef = useRef<HTMLParagraphElement | null>(null);
    const secondTextRef = useRef<HTMLParagraphElement | null>(null);

    const hasCompletedRef = useRef(false);

    useGSAP(() => {
        if (!shouldPlay || !overlayRef.current || !firstTextRef.current || !secondTextRef.current) {
            return;
        }

        let firstSplit: SplitText | null = null;
        let secondSplit: SplitText | null = null;
        let timeline: GSAPTimeline | null = null;

        let isActive = true;

        const finishIntro = () => {
            if (hasCompletedRef.current) return;
            hasCompletedRef.current = true;
            sessionStorage.setItem('portfolio-intro-played', 'true');
            onComplete();
        };

        document.fonts.ready.then(() => {
            if (!isActive || !overlayRef.current || !firstTextRef.current || !secondTextRef.current) {
                return;
            }

            // Split the text into characters
            firstSplit = new SplitText(firstTextRef.current, { type: 'chars' });
            secondSplit = new SplitText(secondTextRef.current, { type: 'chars' });

            // Hide chars and collapse their width so the brackets start close together
            gsap.set([firstSplit.chars, secondSplit.chars], {
                autoAlpha: 0,
                display: 'inline-block',
                overflow: 'hidden', // Crucial: clips the char while width is 0
                width: 0,           // Collapse to 0 width
                willChange: 'opacity, width, transform',
            });

            // NOW it is safe to un-hide the parent wrappers
            gsap.set([firstTextRef.current, secondTextRef.current], {
                autoAlpha: 1
            });

            timeline = gsap.timeline({
                defaults: { ease: 'none' },
                onComplete: finishIntro,
            });

            timeline
                // 1. Type out first phrase (Expands brackets)
                .to(firstSplit.chars, {
                    autoAlpha: 1,
                    width: "auto", // Grows to natural letter width, pushing brackets out
                    duration: 0.04,
                    stagger: 0.045,
                    ease: 'power2.out'
                }, 0.25)
                .to({}, { duration: 0.8 }) // Pause to read

                // 2. Erase first phrase backwards (Collapses brackets)
                .to(firstSplit.chars.slice().reverse(), {
                    autoAlpha: 0,
                    width: 0, // Shrink back to 0
                    duration: 0.03,
                    stagger: 0.03,
                    ease: 'power2.in'
                })

                // 3. Swap the layout (Swaps instantly while brackets are closed)
                .set(firstTextRef.current, { display: 'none' })
                .set(secondTextRef.current, { display: 'block' })

                // 4. Type out second phrase (Expands brackets again for your name)
                .to(secondSplit.chars, {
                    autoAlpha: 1,
                    width: "auto",
                    duration: 0.04,
                    stagger: 0.055,
                    ease: 'power2.out',
                })
                .to({}, { duration: 0.7 }) // Pause to read

                // 5. Brutalist Exit: Slide the whole overlay up
                .to(overlayRef.current, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'expo.inOut',
                });
        });

        return () => {
            isActive = false;

            timeline?.kill();
            firstSplit?.revert();
            secondSplit?.revert();
        };
    }, { scope: overlayRef, dependencies: [shouldPlay, onComplete] });

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fffdf2] px-4 text-black will-change-transform"
            aria-label="Intro animation"
        >
            <div className="flex items-center justify-center text-xl sm:text-2xl font-black uppercase tracking-tight">

                {/* Left Bracket */}
                <span className="text-[#e26d5c]">[</span>

                {/* Text Wrapper - Added whitespace-nowrap so text doesn't wrap while width is 0 */}
                <div className="flex items-center mx-1 sm:mx-3 mt-2 overflow-hidden">

                    <p ref={firstTextRef} className="m-0 invisible opacity-0 whitespace-nowrap">
                        appreciate your stopping by.
                    </p>

                    <p ref={secondTextRef} className="m-0 hidden invisible opacity-0 whitespace-nowrap">
                        Karan Parmar
                    </p>

                </div>

                {/* Right Bracket */}
                <span className="text-[#e26d5c]">]</span>

            </div>
        </div>
    );
};

export default IntroOverlay;