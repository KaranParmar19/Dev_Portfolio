"use client";

import React, { useRef } from 'react';
import DetailsButton from './Button';
import Image from 'next/image';

// GSAP Imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@gsap/react';

// Assuming ProjectType is exported from your data file
import { ProjectType } from '@/public/data/projectData';
import StickerAnimation from './StickerAnimation';
import CurveFlowCarousel from './CurveFlowCarousel';

gsap.config({
    force3D: true
});

gsap.registerPlugin(ScrollTrigger, useGSAP);


interface ProjectCardProps {
    project: ProjectType;
    index: number;
    className?: string;
}

const ProjectCard = ({ project, index, className = '' }: ProjectCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!imageContainerRef.current || !cardRef.current) return;

        gsap.fromTo(
            imageContainerRef.current,
            {
                clipPath: "inset(100% 0% 0% 0%)"
            },
            {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className={`
            ${className} 
            ${project.bg} 
            border-b-2 md:border-b-0 h-auto will-change-transform 
            border-t-2 
            [--tab-size:3rem] md:[--tab-size:4rem]
            
            /* Mobile: Relative blocks that naturally stack on top of each other. Full width/height. */
            relative w-full 
            
            /* Desktop: Absolute positioning, full height, calculated width to create the visual stack */
            md:absolute md:top-0 md:left-0 md:h-full md:w-[calc(100%-var(--dynamic-offset))]
            `}
            style={{
                zIndex: index,
                '--dynamic-offset': `calc(${index} * var(--tab-size))`
            } as React.CSSProperties}
        >
            <div className='flex flex-row h-full w-full relative'>
                {/* sticker  */}
                <StickerAnimation imgLink='/images/illu6.webp' style='absolute top-[10%] right-[2%] z-40 aspect-square w-[25vw] -translate-x-[15vw] -translate-y-[8vh] sm:top-[20%] sm:w-[20vw] md:w-[15vw] lg:w-[10vw] scale-50 opacity-0 pointer-events-none' />
                <StickerAnimation imgLink='/images/illu2.webp' style='absolute md:bottom-2 -bottom-[10%] right-[2%] z-40 aspect-square -translate-x-[15vw] -translate-y-[8vh] sm:w-[10vw] w-[15vw] md:w-[5vw] scale-50 opacity-0 pointer-events-none' />

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 py-4 md:py-6 flex flex-col justify-between w-full h-full relative z-30 overflow-y-auto overflow-x-hidden">
                    <div className="px-4 md:px-10 xl:px-16 pt-1 shrink-0">
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2 font-futura shrink-0 text-black">
                            {project.name}
                        </h3>

                        {project.subtitle && (
                            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#e26d5c] mb-2 md:mb-3 shrink-0">
                                {project.subtitle}
                            </p>
                        )}

                        {/* Tech stack tags */}
                        <div className="mb-2 max-w-xl flex flex-wrap gap-2 shrink-0">
                            {project.tech.map((techItem, i) => {
                                const tilt = i % 2 === 0 ? '-rotate-2' : 'rotate-2';
                                return (
                                    <span
                                        key={i}
                                        className={`px-3 py-1 text-xs md:text-sm font-bold uppercase tracking-wider bg-[#fffaf0] text-black border-2 border-black ${tilt} hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-default`}
                                    >
                                        {techItem}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* CURVE FLOW CAROUSEL - Full Edge-to-Edge WebGL 3D Ribbon */}
                    <div
                        ref={imageContainerRef}
                        className="w-full relative flex-1 min-h-[380px] md:min-h-[460px] lg:min-h-[520px] max-h-[58vh] my-1 flex items-center justify-center overflow-hidden bg-transparent"
                    >
                        <CurveFlowCarousel
                            slides={project.gallery && project.gallery.length > 0 ? project.gallery : [project.img]}
                            frame={{
                                heightPct: 70,
                                heightCap: 750,
                                fit: "fixed",
                                ratio: 1.45,
                                spacing: 48,
                                corner: 0,
                                anchor: 50,
                                offset: 0,
                                centreSmall: true,
                            }}
                            curve={{
                                flatPct: 18,
                                edgeScale: 1.52,
                                speedFlare: 1.2,
                                fringe: 1,
                                fringeOuter: "rgb(160, 197, 246)",
                                fringeInner: "rgb(244, 199, 146)",
                                split: 1.2,
                            }}
                            drive={{
                                drag: 1,
                                glide: 0.42,
                                wheel: "sideways",
                                wheelGain: 1,
                                autoplay: 40,
                                holdOnHover: false,
                                keys: true,
                            }}
                            reveal={{
                                mode: "lift",
                                time: 0.8,
                                gap: 0.07,
                                wait: 0.15,
                                repeat: false,
                            }}
                            press={{
                                behaviour: "focus",
                                newTab: false,
                            }}
                            backdrop={{
                                fill: "transparent",
                                grid: false,
                            }}
                        />
                    </div>

                    <div className="px-4 md:px-10 xl:px-16 pb-2 shrink-0">
                        <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <DetailsButton text='View Project' />
                        </a>
                    </div>
                </div>

                {/* THE TAB SECTION */}
                <div className="w-[var(--tab-size)] h-auto border-l-2 flex items-center justify-center shrink-0 bg-black/5 text-black">
                    <span className="text-lg md:text-2xl font-bold tracking-widest uppercase [writing-mode:vertical-rl]">
                        {project.name}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default ProjectCard;