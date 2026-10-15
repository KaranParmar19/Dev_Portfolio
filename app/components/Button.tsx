import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Force 3D for hardware acceleration
gsap.config({ force3D: true });
gsap.registerPlugin(useGSAP);

interface DetailsButtonProps {
    text?: string;
}

const DetailsButton: React.FC<DetailsButtonProps> = ({ text = 'Live' }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { contextSafe } = useGSAP({ scope: buttonRef });

    const handleMouseEnter = contextSafe(() => {
        gsap.to('.button-text', {
            x: 8,
            duration: 0.3,
            ease: 'power2.out'
        });
        gsap.to('.arrow-circle', {
            x: 4,
            rotate: 15,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    const handleMouseLeave = contextSafe(() => {
        gsap.to('.button-text', {
            x: 0,
            duration: 0.2,
            ease: 'power1.inOut'
        });
        gsap.to('.arrow-circle', {
            x: 0,
            rotate: 0,
            duration: 0.2,
            ease: 'power1.inOut'
        });
    });

    return (
        <button
            ref={buttonRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group cursor-pointer w-fit relative inline-flex items-center gap-3 sm:gap-4 md:gap-6 px-5 py-2.5 sm:px-6 md:px-6.5 md:py-2.5 bg-[#FFFAF0] text-black  font-semibold border-2 border-black 
            /* 1. Added 4px and 6px X-offsets to the shadow */
            shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] 
            hover:shadow-none 
            /* 2. Added translate-x to match the shadow angle on hover */
            hover:translate-x-[4px] hover:translate-y-[4px] 
            md:hover:translate-x-[6px] md:hover:translate-y-[6px] 
            transition-all duration-150 ease-linear"
            onClick={() => console.log('Button clicked!')}
        >
            <span className="button-text text-base sm:text-lg lg:text-xl inline-block">{text}</span>

            <div className="arrow-circle flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12  bg-[#FFFF64] rounded-full border border-black shadow-inner shrink-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-black"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </button>
    );
};

export default DetailsButton;