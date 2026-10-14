"use client";

import React, { useRef } from "react";
import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectCard from "@/app/components/ProjectCard";
import { projectData } from "@/public/data/projectData";
import AnimatedColourTypography from "@/app/components/AnimatedColourTypography";



gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.config({ force3D: true });



const Projects = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stickerRef = useRef<HTMLDivElement | null>(null);



    useGSAP(() => {
        // We initialize GSAP matchMedia to handle responsive animations
        const mm = gsap.matchMedia();

        // The sticker animation runs everywhere
        gsap.to(stickerRef.current, {
            scale: 1,
            autoAlpha: 1,
            duration: 1.4,
            x: 0,
            y: 0,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: stickerRef.current,
                start: "top 90%",
            },
        });

        // The card pinning animation ONLY runs on devices 768px (md) and wider
        mm.add("(min-width: 768px)", () => {
            const cards = gsap.utils.toArray<HTMLElement>(".project-card");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${projectData.length * 70}%`,
                    scrub: 1,
                    pin: true,
                },
            });

            cards.forEach((card, index) => {
                if (index === 0) return;

                tl.fromTo(
                    card,
                    { yPercent: 100 },
                    { yPercent: 0, ease: "none" }
                );
                tl.to({}, { duration: 0.2 })
            });
        });


    }, { scope: containerRef });

    return (
        <section className="border-y-2">
            <div className="relative flex items-center justify-center py-8">
                <div
                    ref={stickerRef}
                    className="absolute top-[50%] right-[2%] z-40 aspect-square w-[25vw] scale-50 -translate-x-[15vw] -translate-y-[8vh] opacity-0 sm:top-[20%] sm:w-[20vw] md:w-[15vw] lg:w-[10vw]"
                >
                    <Image src="/ufo.png" alt="projectIcon" fill className="object-contain" />
                </div>

                <div className="w-[90vw] sm:w-[80vw] md:w-[50vw] lg:w-[30vw]">
                    <AnimatedColourTypography
                        text="PROJECTS"
                        palette={["#000000"]}
                        style={{
                            fontFamily: '"Comic Sans MS", "Baloo", cursive',
                            fontSize: "clamp(48px, 10.5vw, 82px)",
                            fontWeight: 800,
                            letterSpacing: "0.01em",
                            lineHeight: "0.92em",
                            textAlign: "center",
                            WebkitTextStrokeWidth: 6,
                            WebkitTextStrokeColor: "#000000",
                            paintOrder: "stroke fill",
                        }}
                    />
                </div>
            </div>

            {/* Changed from h-svh to md:h-svh so mobile can scroll freely */}
            <div
                ref={containerRef}
                className="relative h-auto  md:h-svh projectContainer"
            >
                {projectData.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        className="project-card"
                    />
                ))}
            </div>
        </section>
    );
};

export default Projects;