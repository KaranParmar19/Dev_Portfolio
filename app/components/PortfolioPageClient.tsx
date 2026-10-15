/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from '@/sections/home';
import Projects from '@/sections/projects';
import ParallaxImageSection from './ParalaxBg';
import AboutMe from '@/sections/aboutMe';
import Journey from '@/sections/Journey';
import Skills from '@/sections/Skills';
import IntroOverlay from './IntroOverlay';
import ContactPage from './contact/test';
import ContactMain from '@/sections/ContactMain';
import { useLenis } from '@/lenis/LenisScroll';
import ScrollToTopProgress from './ScrollToTopProgress';
import PageTearTransition from './PageTearTransition';
import CurtainLoadScreen from './CurtainLoadScreen';
import ScrollBlurByAki from './ScrollBlurByAki';
import SectionMorph from './SectionMorph';

const INTRO_SESSION_KEY = 'portfolio-intro-played';

const PortfolioPageClient = () => {
    // 1. Add a mounted state to track when we are safely on the client
    const [mounted, setMounted] = useState(false);
    const [isIntroComplete, setIsIntroComplete] = useState(false);
    const [shouldPlayIntro, setShouldPlayIntro] = useState(false);
    const [curtainLoad, setCurtainLoad] = useState<{
        phase: 'covering' | 'revealing';
        color: string;
    } | null>(null);
    const curtainLoadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const curtainLoadActive = useRef(false);

    const [pageTear, setPageTear] = useState<{
        phase: 'closing' | 'tearing';
        color: string;
    } | null>(null);
    const pageTearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pageTearActive = useRef(false);

    const lenis = useLenis();

    useEffect(() => {
        // 2. Read sessionStorage ONLY after hydration completes
        const hasPlayedIntro = sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';

        if (hasPlayedIntro) {
            setIsIntroComplete(true);
        } else {
            setShouldPlayIntro(true);
        }

        // 3. Signal that it is safe to render the real content
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        document.body.style.overflow = isIntroComplete ? '' : 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isIntroComplete, mounted]);

    useEffect(() => {
        const handleCurtainNavigation = (event: Event) => {
            const { link, color = 'rgb(255, 47, 0)' } = (event as CustomEvent<{ link: string; color?: string }>).detail;
            const target = document.getElementById(link.slice(1));
            if (!target || curtainLoadActive.current || pageTearActive.current) return;

            curtainLoadActive.current = true;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                target.scrollIntoView();
                window.history.pushState(null, '', link);
                curtainLoadActive.current = false;
                return;
            }

            // Phase 1: Framer LoadScreen columns drop down in center-outwards cascade
            setCurtainLoad({ phase: 'covering', color });

            // After curtain covers viewport (450ms duration + 140ms max delay = ~590ms)
            curtainLoadTimer.current = setTimeout(() => {
                window.history.pushState(null, '', link);

                // Instantly align viewport to target behind the covered curtain
                if (lenis) {
                    lenis.scrollTo(target, { immediate: true });
                } else {
                    target.scrollIntoView();
                }

                // Short settle buffer, then Phase 2: Reveal target section in center-outwards stages (exact Framer LoadScreen)
                setTimeout(() => {
                    setCurtainLoad({ phase: 'revealing', color });

                    // After reveal completes (800ms duration + 320ms max delay = ~1120ms)
                    curtainLoadTimer.current = setTimeout(() => {
                        curtainLoadActive.current = false;
                        setCurtainLoad(null);
                    }, 1150);
                }, 60);
            }, 600);
        };

        window.addEventListener('portfolio:curtain-navigation', handleCurtainNavigation);
        return () => {
            window.removeEventListener('portfolio:curtain-navigation', handleCurtainNavigation);
            if (curtainLoadTimer.current) clearTimeout(curtainLoadTimer.current);
        };
    }, [lenis]);

    useEffect(() => {
        const handlePageTearNavigation = (event: Event) => {
            const { link, color = '#1b1b1a' } = (event as CustomEvent<{ link: string; color?: string }>).detail;
            const target = document.getElementById(link.slice(1));
            if (!target || curtainLoadActive.current || pageTearActive.current) return;

            pageTearActive.current = true;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                target.scrollIntoView();
                pageTearActive.current = false;
                return;
            }

            // Phase 1: Two jagged halves close inward to meet in the middle
            setPageTear({ phase: 'closing', color });

            // Once the two halves meet at center (580ms), the viewport is 100% covered by paper
            pageTearTimer.current = setTimeout(() => {
                window.history.pushState(null, '', link);

                // Instantly position viewport behind the covered paper
                if (lenis) {
                    lenis.scrollTo(target, { immediate: true });
                } else {
                    target.scrollIntoView();
                }

                // Short settle buffer, then Phase 2: Rip apart down the middle to reveal
                setTimeout(() => {
                    setPageTear({ phase: 'tearing', color });

                    // After tear completes (1050ms), remove portal and reset state
                    pageTearTimer.current = setTimeout(() => {
                        pageTearActive.current = false;
                        setPageTear(null);
                    }, 1080);
                }, 70);
            }, 590);
        };

        window.addEventListener('portfolio:page-tear-navigation', handlePageTearNavigation);
        return () => {
            window.removeEventListener('portfolio:page-tear-navigation', handlePageTearNavigation);
            if (pageTearTimer.current) clearTimeout(pageTearTimer.current);
        };
    }, [lenis]);

    const handleIntroComplete = useCallback(() => {
        setIsIntroComplete(true);
        setShouldPlayIntro(false);
        sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    }, []);

    // 4. PREVENT HYDRATION MISMATCH
    // Render a blank screen with your site's background color on the server and first client pass.
    // This perfectly matches, preventing errors, and avoids flashing unstyled content.
    if (!mounted) {
        return <div className="min-h-screen bg-background" suppressHydrationWarning />;
    }

    return (
        <div className='font-neulis' suppressHydrationWarning>
            {!isIntroComplete && (
                <IntroOverlay shouldPlay={shouldPlayIntro} onComplete={handleIntroComplete} />
            )}

            <div id='home'>
                <Home isIntroComplete={isIntroComplete} />
            </div>

            <div id='projects' className='relative z-10'>
                <Projects />
            </div>
            <div>
                <ParallaxImageSection />
            </div>
            <div id='about' className='relative z-10'>
                <AboutMe />
                <SectionMorph
                    topColor="#fe9066"
                    bottomColor="#f4f1eb"
                    visualHeight={250}
                    curveDepth={155}
                    responseMode="elastic"
                />
            </div>
            <div className='relative z-10'>
                <Journey />
                <SectionMorph
                    topColor="#f4f1eb"
                    bottomColor="#f3865e"
                    visualHeight={250}
                    curveDepth={155}
                    responseMode="elastic"
                />
            </div>
            <div id='skills' className='relative z-10'>
                <Skills />
                <SectionMorph
                    topColor="#f3865e"
                    bottomColor="#f4f1eb"
                    visualHeight={250}
                    curveDepth={155}
                    responseMode="elastic"
                />
            </div>
            <div id='contact'>
                <ContactMain />
            </div>

            {/* Progressive Bottom Scroll Blur (ScrollBlurByAki) */}
            <div className="fixed bottom-0 left-0 right-0 h-24 sm:h-32 z-30 pointer-events-none" aria-hidden="true">
                <ScrollBlurByAki direction="bottom" blur={20} quality="high" />
            </div>

            <ScrollToTopProgress />

            {curtainLoad && <CurtainLoadScreen phase={curtainLoad.phase} color={curtainLoad.color} />}

            {pageTear && <PageTearTransition phase={pageTear.phase} color={pageTear.color} />}
        </div>
    );
};

export default PortfolioPageClient;