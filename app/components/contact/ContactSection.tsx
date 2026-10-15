'use client'
import React, { useRef } from 'react';
import Cloud from './Cloud';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const ContactSection = () => {
    const cloud1Ref = useRef<HTMLDivElement | null>(null)
    const cloud2Ref = useRef<HTMLDivElement | null>(null)
    const shipRef = useRef<HTMLDivElement | null>(null)
    const contactSectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        gsap.to(cloud1Ref.current, {
            x: '20%',
            duration: 3,
            repeat: -1,
            ease: 'none',
            yoyo: true,
        })
        gsap.to(cloud2Ref.current, {
            x: '-20%',
            duration: 3,
            repeat: -1,
            ease: 'none',
            yoyo: true,
        })

        const mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 639px)",
            isTablet: "(min-width: 640px) and (max-width: 1023px)",
            isDesktop: "(min-width: 1024px)"
        }, (context) => {
            const { isMobile, isTablet, isDesktop } = context.conditions as { isMobile: boolean, isTablet: boolean, isDesktop: boolean };

            gsap.to(shipRef.current, {
                y: isMobile ? '-20%' : isTablet ? '-5%' : '-15%',
                rotation: 3,
                duration: 2.5,
                repeat: -1,
                ease: 'sine.inOut',
                yoyo: true,
            })
        });

    }, { scope: contactSectionRef })

    return (
        <div ref={contactSectionRef} className=' relative z-10 bg-[#F4F1EB]'>
            <div>
                <div className='sm:h-[60vh] h-[50vh] w-full relative overflow-hidden flex items-center justify-center'>
                    <div ref={cloud1Ref} className='absolute sm:-left-[10%] will-change-transform -left-[15%] top-0'>
                        <Cloud src='/cloud.svg' />
                    </div>
                    <div className='flex items-center justify-center '>
                        <p className="
                            uppercase
                            font-bold
                            text-[12vw] md:text-[10vw] w-fit  cursor-pointer hover:text-[#e4fe9e] duration-150 ease-in transition-all tracking-wider
                            text-foreground
                            [-webkit-text-stroke:2px_#0e0e0e]
                            font-futura">
                            contact
                        </p>
                    </div>
                    <div ref={cloud2Ref} className='absolute sm:-right-[10%] will-change-transform -right-[15%] bottom-0'>
                        <Cloud src='/cloud.svg' />
                    </div>
                </div>

                <div id='bgImgLayer' className='h-[20vh] sm:h-[30vh]  xl:h-[40vh]  w-full relative  '>
                    <div className='absolute inset-0 z-10'>
                        <Image
                            src={'/layer3.webp'}
                            alt='layer3'
                            fill
                            unoptimized
                            className='object-contain object-bottom'
                        />
                    </div>

                    <div className='absolute inset-0 z-20'>
                        <Image
                            src={'/layer2.webp'}
                            alt='layer2'
                            fill
                            unoptimized
                            className='object-contain object-bottom'
                        />
                    </div>

                    <div ref={shipRef} className='absolute left-[5%] md:left-[10%]  bottom-[10%] sm:bottom-[15%] lg:bottom-[30%] xl:bottom-[40%] w-[25vw] max-w-[120px] sm:max-w-[180px] xl:max-w-[220px] aspect-square z-[25]'>
                        <Image
                            src={'/merry.webp'}
                            alt='ship'
                            fill
                            unoptimized
                            className='object-contain object-bottom'
                        />
                    </div>

                    <div className='absolute inset-0 z-30'>
                        <Image
                            src={'/layer1.webp'}
                            alt='layer1'
                            fill
                            unoptimized
                            className='object-contain object-bottom'
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactSection;