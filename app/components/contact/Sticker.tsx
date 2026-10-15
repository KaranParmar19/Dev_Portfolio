'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger)

const Sticker = ({ link }: { link: string }) => {
    const stickerRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        gsap.to(stickerRef.current, {
            scale: 1,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: stickerRef.current,
                start: 'clamp(top 95%)'
            }
        });
    }, { scope: stickerRef })

    return (
        <div ref={stickerRef} className='scale-10 relative w-25 md:w-35 aspect-square'>
            <Image alt='contactMe-sticker' src={link} sizes='100vw'  fill className='object-contain' />
        </div>
    );
};

export default Sticker;