'use client'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import React, { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger)

const Cloud = ({ src, alt = 'cloudImg' }: { src: string, alt?: string }) => {

    const cloudRef = useRef<HTMLDivElement | null>(null)

    useGSAP(()=>{
        gsap.to(cloudRef.current, {
                scale:1,
                duration: 1.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: cloudRef.current,
                    start: 'clamp(top 90%)'
                }
            });
    }, {scope: cloudRef})
    return (
        <div ref={cloudRef} className='lg:w-[30vw] md:w-[40vw] w-[60vw] scale-10 sm:w-[50vw] aspect-video'>
            <Image src={src} alt={alt} fill className='object-contain' sizes='50vw' />
        </div>
    );
};

export default Cloud;