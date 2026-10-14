'use client'
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';

// Register the GSAP React hook
gsap.registerPlugin(useGSAP, SplitText);

gsap.config({ force3D: true })

interface HeroProps {
    onAnimationComplete?: () => void;
    shouldStartAnimation?: boolean;
    isFullyRevealed?: boolean;
}

const Hero: React.FC<HeroProps> = ({ onAnimationComplete, shouldStartAnimation = true }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const leftContentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const nameContentRef = useRef<HTMLDivElement>(null);
    const techAccentLineRef = useRef<HTMLDivElement>(null);
    const techAccentDotRef = useRef<HTMLDivElement>(null);
    const hasCompletedRef = useRef(false);

    useGSAP(() => {
        if (!shouldStartAnimation) {
            return;
        }

        const mm = gsap.matchMedia();
        let splitText: SplitText | null = null;
        let tl: GSAPTimeline | null = null;
        let isActive = true;

        document.fonts.ready.then(() => {
            if (!isActive || !lineRef.current || !leftContentRef.current || !textRef.current || !nameContentRef.current || !techAccentLineRef.current || !techAccentDotRef.current) return;

            splitText = new SplitText(textRef.current, {
                type: 'words, lines',
                mask: 'lines'
            });


            gsap.set([textRef.current, lineRef.current, leftContentRef.current], { autoAlpha: 1 });

            const timeline = gsap.timeline({
                // Using an exponential ease for a sharper, more engineered snap
                defaults: { ease: 'expo.out', duration: 1.4 },
                onComplete: () => {
                    if (hasCompletedRef.current) return;
                    hasCompletedRef.current = true;
                    splitText?.revert();
                    onAnimationComplete?.();
                }
            });
            tl = timeline;

            mm.add({
                isMobile: "(max-width: 639px)",
                isDesktop: "(min-width: 640px)",
            }, (context) => {
                const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

                timeline.fromTo(lineRef.current,
                    isMobile
                        ? { scaleX: 0, transformOrigin: 'left' }
                        : { scaleY: 0, transformOrigin: 'top' },
                    isMobile
                        ? { scaleX: 1 }
                        : { scaleY: 1 }
                );
            });

            timeline
                // 1. Staggered PortFolio Text reveal
                .fromTo(splitText.words,
                    { yPercent: 105 },
                    { yPercent: 0, stagger: 0.1 },
                    "-=1.0"
                )

                // 2. Left side infographic details stagger in
                .fromTo(leftContentRef.current.children,
                    { autoAlpha: 0, x: -15 },
                    { autoAlpha: 1, x: 0, stagger: 0.15, duration: 1 },
                    "-=1.2"
                )


                .fromTo(techAccentLineRef.current,
                    { scaleX: 0, transformOrigin: "right" },
                    {
                        scaleX: 1,
                        duration: 1,
                        ease: 'power3.inOut'
                    },
                    "-=0.8"
                )

                .fromTo(techAccentDotRef.current,
                    { scale: 0 },
                    { scale: 1, duration: 0.4, ease: "back.out(2)" },
                    "-=0.3"
                );
        });

        return () => {
            isActive = false;
            tl?.kill();
            mm.revert();
            splitText?.revert();
        };

    }, { scope: containerRef, dependencies: [shouldStartAnimation, onAnimationComplete] });

    return (
        <div
            className="w-full h-full flex items-end justify-end px-4 sm:px-8 md:px-12 py-4 relative"
            ref={containerRef}
        >
            <div className="flex font-neulis items-stretch gap-6 md:gap-12 sm:flex-row flex-col w-full justify-end">

                <div
                    ref={leftContentRef}
                    className={`flex flex-col justify-end text-right pb-3 md:pb-6 ${shouldStartAnimation ? 'invisible' : ''}`}
                >
                    <div ref={nameContentRef} className="relative inline-block ml-auto pb-3">
                        <p className="text-xl md:text-2xl font-bold tracking-tight text-black">Karan Parmar</p>

                        {/* Sleek, professional geometric accent line replacing the sketch */}
                        <div ref={techAccentLineRef} className="absolute bottom-0 right-0 h-[2px] w-[95%] bg-[#e26d5c] flex items-center justify-start flex-row-reverse">
                            <div ref={techAccentDotRef} className="w-1.5 h-1.5 bg-[#e26d5c] translate-x-[50%]" />
                        </div>
                    </div>

                    <div className="mt-4 md:mt-5 text-sm md:text-base text-gray-600 font-medium tracking-wide flex flex-col items-end border-r-2 border-black/10 pr-4">
                        <p>Full-Stack Developer</p>
                        <p className="text-gray-400">&</p>
                        <p>Systems Engineer</p>
                    </div>

                    <div className="mt-6 md:mt-8 flex justify-end">
                        <p className="text-xs font-mono font-bold tracking-widest text-white bg-foreground px-3 py-1 uppercase">
                            Est. 2026
                        </p>
                    </div>
                </div>

                {/* Technical Vertical Divider */}
                <div
                    ref={lineRef}
                    className={`h-[2px] w-full sm:h-auto sm:w-[3px] bg-black shrink-0 my-2 md:my-4 relative ${shouldStartAnimation ? 'invisible' : ''}`}
                >
                    {/* Crosshair accents on the divider line to enhance the technical look */}
                    <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-4 h-px bg-black" />
                    <div className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-black" />
                </div>


                <div className="text-[4.5rem] px-1 sm:text-[6rem] md:text-[8rem] xl:text-[11rem] items-end font-black flex flex-col uppercase font-futura leading-none">
                    <p ref={textRef} className={shouldStartAnimation ? 'invisible' : ''}>
                        Port <br /> Folio
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Hero;