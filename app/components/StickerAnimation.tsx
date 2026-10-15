'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger)

const StickerAnimation = ({ style, imgLink, alt = 'stickerImg' }: { style: string, imgLink: string, alt?: string }) => {


    const stickerRef = useRef<HTMLImageElement | null>(null)

    useGSAP(() => {
        gsap.to(stickerRef.current, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: "back.out(1.3)",
            scrollTrigger: {
                trigger: stickerRef.current,
                start: "top 95%",
            },
        });
    }, { scope: stickerRef })

    return (

        <div ref={stickerRef} className={`${style}`}>
            <Image src={imgLink} alt={alt} fill sizes='400px' className="object-contain" />
        </div>

    );
};

export default StickerAnimation;