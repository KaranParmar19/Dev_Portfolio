'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React, { useId, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

interface GooeyTextRevealProps {
    text: string;
    className: string;
    as?: 'h1' | 'h2';
}

const GooeyTextReveal = ({ text, className, as = 'h2' }: GooeyTextRevealProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const defsRef = useRef<SVGDefsElement>(null);
    const filterId = `gooey-text-${useId().replace(/[^a-zA-Z0-9]/gu, '')}`;
    const Heading = as;

    useGSAP(() => {
        const element = textRef.current;
        const defs = defsRef.current;
        if (!element || !defs || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let activeTimeline: gsap.core.Timeline | null = null;
        let activeTriggers: ScrollTrigger[] = [];

        const split = SplitText.create(element, {
            type: 'lines',
            linesClass: 'gooey-text-line',
            autoSplit: true,
            onSplit(instance) {
                activeTimeline?.scrollTrigger?.kill();
                activeTimeline?.kill();
                activeTriggers.forEach((trigger) => trigger.kill());
                activeTriggers = [];
                defs.replaceChildren();

                const lines = instance.lines as HTMLElement[];
                const blurNodes: SVGFEGaussianBlurElement[] = [];
                const matrixNodes: SVGFEColorMatrixElement[] = [];
                const edgeNodes: SVGFEGaussianBlurElement[] = [];
                const blurAmount = 0.8 * (parseFloat(getComputedStyle(element).fontSize) || 16);

                lines.forEach((line, index) => {
                    line.style.display = 'block';
                    line.style.willChange = 'filter, opacity';

                    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.id = `${filterId}-${index}`;
                    filter.setAttribute('x', '-30%');
                    filter.setAttribute('y', '-200%');
                    filter.setAttribute('width', '160%');
                    filter.setAttribute('height', '500%');

                    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    blur.setAttribute('in', 'SourceGraphic');
                    blur.setAttribute('stdDeviation', String(blurAmount));
                    filter.appendChild(blur);

                    const matrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
                    matrix.setAttribute('type', 'matrix');
                    matrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -65');
                    filter.appendChild(matrix);

                    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    edge.setAttribute('stdDeviation', '0.4');
                    filter.appendChild(edge);
                    defs.appendChild(filter);

                    blurNodes.push(blur);
                    matrixNodes.push(matrix);
                    edgeNodes.push(edge);
                    line.style.opacity = '0';
                    line.style.filter = `url(#${filterId}-${index})`;
                });

                const states = lines.map(() => ({ goo: 1, opacity: 0 }));
                const apply = () => states.forEach((state, index) => {
                    const line = lines[index];
                    const blur = blurNodes[index];
                    const matrix = matrixNodes[index];
                    const edge = edgeNodes[index];
                    if (!line || !blur || !matrix || !edge) return;
                    const goo = state.goo;
                    line.style.opacity = state.opacity >= 0.999 ? '' : String(state.opacity);
                    blur.setAttribute('stdDeviation', String(Math.max(0.01, goo * blurAmount)));
                    const easedGoo = goo * goo;
                    matrix.setAttribute(
                        'values',
                        `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${1 + 254 * easedGoo} ${-65 * easedGoo}`,
                    );
                    edge.setAttribute('stdDeviation', String(Math.max(0.01, 0.4 * easedGoo)));
                    if (goo <= 0.001) line.style.filter = 'none';
                });

                apply();
                const appearDuration = 1.5;
                const appearStagger = 0.75;
                const appearTotal = appearDuration + (lines.length - 1) * appearStagger;
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 92%',
                        end: () => {
                            const height = element.offsetHeight;
                            const viewport = window.innerHeight;
                            const distance = height <= viewport * 0.6
                                ? viewport * 0.42 + height / 2
                                : viewport * 0.12 + height;
                            return `+=${Math.max(distance, viewport * 0.35)}`;
                        },
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                    onUpdate: apply,
                });
                timeline.to(states, { opacity: 1, duration: appearDuration, stagger: appearStagger, ease: 'sine.inOut' }, 0);
                timeline.to(states, { goo: 0, duration: 3, stagger: 1.5, ease: 'sine.inOut' }, appearTotal + 1.5);
                activeTimeline = timeline;
                if (timeline.scrollTrigger) activeTriggers.push(timeline.scrollTrigger);
                return timeline;
            },
        });

        return () => {
            activeTriggers.forEach((trigger) => trigger.kill());
            activeTimeline?.kill();
            split.revert();
            defs.replaceChildren();
        };
    }, { scope: wrapperRef, dependencies: [text, filterId] });

    return (
        <div ref={wrapperRef} className="gooey-text-reveal">
            <svg aria-hidden="true" focusable="false" className="gooey-text-defs">
                <defs ref={defsRef} />
            </svg>
            <Heading ref={textRef} className={className}>
                {text}
            </Heading>
        </div>
    );
};

export default GooeyTextReveal;