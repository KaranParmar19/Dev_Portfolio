'use client'
import React, { useRef } from "react";
import gsap from "gsap";
import GooeyTextReveal from '@/app/components/GooeyTextReveal';
import SmartContactLink from "./SmartContactLink";
import ArrowedLink from "./ArrowedLink";

const ContactPage = () => {
    // Refs for the first arrow ("Social Networks")
    const arrow1ShaftRef = useRef<SVGPathElement>(null);
    const arrow1HeadRef = useRef<SVGPathElement>(null);

    // Refs for the second arrow ("Let's Talk")
    const arrow2ShaftRef = useRef<SVGPathElement>(null);
    const arrow2HeadRef = useRef<SVGPathElement>(null);

    // --- Hover Handlers for "SOCIAL NETWORKS" ---
    const handleEnter1 = () => {
        gsap.killTweensOf([arrow1ShaftRef.current, arrow1HeadRef.current]);

        gsap.to(arrow1ShaftRef.current, {
            scale: 1.5,
            strokeWidth: 3,
            transformOrigin: "0% 0%",
            duration: 0.5,
            ease: "back.out(1.5)",
            overwrite: "auto",
        });
        gsap.to(arrow1HeadRef.current, {
            x: 8,
            y: 8,
            duration: 0.5,
            ease: "back.out(1.5)",
            overwrite: "auto",
        });
    };

    const handleLeave1 = () => {
        gsap.killTweensOf([arrow1ShaftRef.current, arrow1HeadRef.current]);

        gsap.to([arrow1ShaftRef.current, arrow1HeadRef.current], {
            scale: 1,
            strokeWidth: 1.5,
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
                gsap.set([arrow1ShaftRef.current, arrow1HeadRef.current], {
                    clearProps: "transform,strokeWidth",
                });
            },
        });
    };

    // --- Hover Handlers for "LET'S TALK" ---
    const handleEnter2 = () => {
        gsap.killTweensOf([arrow2ShaftRef.current, arrow2HeadRef.current]);

        gsap.to(arrow2ShaftRef.current, {
            scaleY: 1.5,
            transformOrigin: "bottom center",
            duration: 0.5,
            ease: "back.out(1.5)",
            overwrite: "auto",
        });
        gsap.to(arrow2HeadRef.current, {
            y: -15,
            duration: 0.5,
            ease: "back.out(1.5)",
            overwrite: "auto",
        });
    };

    const handleLeave2 = () => {
        gsap.killTweensOf([arrow2ShaftRef.current, arrow2HeadRef.current]);

        gsap.to([arrow2ShaftRef.current, arrow2HeadRef.current], {
            scaleY: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
                gsap.set([arrow2ShaftRef.current, arrow2HeadRef.current], {
                    clearProps: "transform",
                });
            },
        });
    };

    return (
        <div className="bg-[#F4F1EB] h-full text-black font-neulis border-t-2 border-black w-full flex flex-col">

            {/* --- TOP GRID SECTION --- */}
            <div className="w-full border-y-2">
                <div className="grid max-w-container grid-cols-1 xl:grid-cols-2 ">

                    {/* Left: Social Networks Header */}
                    <div className="py-4 md:py-8 lg:py-12 border-b-2 xl:border-b-0 xl:border-r-2 border-black flex flex-col justify-center">
                        <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.35em] text-gray-500 uppercase mb-6">
                            [ Connect ]
                        </p>

                        <div
                            onMouseEnter={handleEnter1}
                            onMouseLeave={handleLeave1}
                            className="flex w-fit items-start gap-x-6 cursor-pointer group"
                        >
                            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black font-futura uppercase leading-[0.9] group-hover:text-[#e26d5c] transition-colors duration-300">
                                Social<br />Networks
                            </h2>

                            <div className="overflow-visible mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-8 sm:size-12 lg:size-16 overflow-visible rotate-45 xl:-rotate-45 text-black group-hover:text-[#e26d5c] transition-colors duration-300"
                                    style={{ overflow: "visible" }}
                                >
                                    <path
                                        ref={arrow1ShaftRef}
                                        vectorEffect="non-scaling-stroke"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m4.5 4.5 15 15"
                                    />
                                    <path
                                        ref={arrow1HeadRef}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25V19.5H8.25"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right: Links List */}
                    <div className="py-4 md:py-8 lg:py-12 flex flex-col justify-center items-end text-right -gap-y-1 sm:gap-y-4 font-bold text-base md:text-3xl lg:text-4xl uppercase w-full">
                        <ArrowedLink
                            label="LeetCode"
                            url="https://leetcode.com/u/Karan_Parmar"
                            openInNewTab
                            textColor="#111111"
                            lineColor="rgba(0,0,0,0.25)"
                            className="w-full flex justify-end"
                        />
                        <ArrowedLink
                            label="Github"
                            url="https://github.com/KaranParmar19"
                            openInNewTab
                            textColor="#111111"
                            lineColor="rgba(0,0,0,0.25)"
                            className="w-full flex justify-end"
                        />
                        <ArrowedLink
                            label="LinkedIn"
                            url="https://www.linkedin.com/in/karan-parmar-280991274/"
                            openInNewTab
                            textColor="#111111"
                            lineColor="rgba(0,0,0,0.25)"
                            className="w-full flex justify-end"
                        />
                        <SmartContactLink
                            value="kp5336464@gmail.com"
                            emailSubject="Contact from Portfolio"
                            containerClassName="mt-4 pt-4 border-t-2 border-black/10 text-right w-fit ml-auto"
                            className="hover:text-[#e26d5c] transition-colors duration-300 cursor-pointer"
                            align="right"
                            placement="top"
                        />
                        <a href="tel:9356258692" className="text-sm md:text-lg font-mono font-normal normal-case text-gray-700 hover:text-[#e26d5c] transition-colors mt-1 text-right">
                            +91 9356258692
                        </a>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION --- */}
            {/* Added flex-grow and justify-between to push the footer to the bottom */}
            <div className="py-4 md:py-8 lg:py-12 bg-white flex-grow flex flex-col justify-between ">

                {/* CTA Area */}
                <div className="w-full max-w-container">
                    <p className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase mb-4">
                        [ Got a Project in Mind? ]
                    </p>

                    <div
                        onMouseEnter={handleEnter2}
                        onMouseLeave={handleLeave2}
                        className="group flex overflow-visible items-end justify-between gap-3 sm:gap-4 cursor-pointer border-b-4 border-transparent hover:border-[#e26d5c] transition-colors duration-500 md:pb-4"
                    >
                        <h1 className="text-3xl min-[380px]:text-4xl sm:text-6xl lg:text-[7.5rem] xl:text-[9.5rem] font-black font-futura uppercase leading-none tracking-tighter group-hover:text-[#e26d5c] transition-colors duration-500">
                            Let&apos;s Talk
                        </h1>

                        <div className="overflow-visible mb-1 sm:mb-2 md:mb-6 shrink-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-8 min-[380px]:size-10 sm:size-14 lg:size-20 overflow-visible text-black group-hover:text-[#e26d5c] transition-colors duration-500"
                                style={{ overflow: "visible" }}
                            >
                                <path
                                    ref={arrow2HeadRef}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 10.5 12 3m0 0 7.5 7.5"
                                />
                                <path
                                    ref={arrow2ShaftRef}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v18"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* --- NEW EDITORIAL METADATA FOOTER --- */}
                <div id="contact-editorial-footer" className="w-full max-w-container flex flex-col md:flex-row justify-between items-start md:items-end mt-16 border-t-2 border-black/10 pt-6 gap-y-6 font-mono text-xs sm:text-sm tracking-widest uppercase text-gray-500">

                    {/* Location */}
                    <div className="flex flex-col gap-1">
                        <span className="text-black font-bold">Location</span>
                        <span>Pune, India</span>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1 md:items-center">
                        <span className="text-black font-bold">Status</span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Available for work
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col gap-1 md:items-end">
                        <span className="text-black font-bold">Karan Parmar</span>
                        <span>© {new Date().getFullYear()} All Rights Reserved</span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ContactPage;