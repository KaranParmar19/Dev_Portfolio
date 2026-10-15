"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { navbarData } from '@/public/data/NavbarData';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeSimple, Folder, List, Newspaper, User, X, Compass } from '@phosphor-icons/react';
import CircleFillButton from './CircleFillButton';

interface NavbarProps {
    isHeroAnimationDone?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
    projects: Folder,
    about: User,
    journey: Compass,
    skills: Newspaper,
    contact: EnvelopeSimple,
};

const Navbar = ({ isHeroAnimationDone: _isHeroAnimationDone }: NavbarProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 640px)');
        const updateViewport = () => {
            setIsMobile(mediaQuery.matches);
            setIsOpen(false);
        };

        updateViewport();
        mediaQuery.addEventListener('change', updateViewport);
        return () => mediaQuery.removeEventListener('change', updateViewport);
    }, []);

    const navigateWithCurtain = (event: React.MouseEvent<HTMLAnchorElement>, link: string, _index?: number) => {
        const targetId = link.startsWith('#') ? link.slice(1) : '';
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        event.preventDefault();

        if (isMobile) {
            setIsOpen(false);
        }

        // About, Journey & Skills links use the PageTear transition
        if (link === '#about' || link === '#skills' || link === '#journey') {
            let tearColor = '#1b1b1a';
            if (link === '#skills') tearColor = '#f4f1eb';
            if (link === '#journey') tearColor = '#dcfce7'; // user requested mint green from image
            window.dispatchEvent(new CustomEvent('portfolio:page-tear-navigation', {
                detail: { link, color: tearColor },
            }));
            return;
        }

        // Projects & Contact use the Framer Curtain LoadScreen (Projects uses vibrant blue #0266ff from user image)
        const curtainColor = link === '#projects' ? '#0266ff' : 'rgb(255, 47, 0)';
        window.dispatchEvent(new CustomEvent('portfolio:curtain-navigation', {
            detail: { link, color: curtainColor },
        }));
    };

    return (
        <div className="top-nav-viewport">
            <motion.div
                layout
                className={`top-nav-capsule${isMobile ? ' top-nav-capsule--mobile' : ''}`}
                transition={{ type: 'spring', stiffness: 260, damping: 26, mass: 1, duration: 0.6 }}
                onMouseEnter={() => !isMobile && setIsOpen(true)}
                onMouseLeave={() => !isMobile && setIsOpen(false)}
            >
                <div className="top-nav-brand-row">
                    <a
                        href="#home"
                        className="top-nav-brand"
                        aria-label="Karan Parmar, back to top"
                        onClick={(event) => navigateWithCurtain(event, '#home', 4)}
                    >
                        <Image src={navbarData.logo.imgLink} alt={navbarData.logo.alt} width={60} height={28} />
                    </a>
                    {isMobile && (
                        <button
                            type="button"
                            className="top-nav-toggle"
                            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
                            aria-expanded={isOpen}
                            onClick={() => setIsOpen((open) => !open)}
                        >
                            {isOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
                        </button>
                    )}
                </div>

                <AnimatePresence initial={false}>
                    {(!isMobile || isOpen) && (
                        <motion.nav
                            layout
                            className="top-nav-items"
                            aria-label="Main navigation"
                            initial={isMobile ? { opacity: 0, height: 0 } : false}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 26 }}
                        >
                            {navbarData.links.map((item, index) => {
                                const Icon = iconMap[item.name.toLowerCase()] || Folder;
                                return (
                                    <motion.a
                                        layout
                                        key={item.id}
                                        href={item.link}
                                        className="top-nav-link"
                                        onClick={(event) => navigateWithCurtain(event, item.link, index)}
                                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                                    >
                                        <Icon size={24} weight="regular" aria-hidden="true" />
                                        <motion.span
                                            className="top-nav-link-label"
                                            initial={false}
                                            animate={{ width: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                            transition={{ duration: 0.25, ease: 'easeOut' }}
                                        >
                                            {item.name[0].toUpperCase() + item.name.slice(1)}
                                        </motion.span>
                                    </motion.a>
                                );
                            })}
                            {isMobile && (
                                <div className="pt-2 border-t border-black/10 mt-1 flex justify-center w-full">
                                    <CircleFillButton
                                        text="Resume"
                                        hoverText="Hire me"
                                        link="https://drive.google.com/file/d/1FZaPrWzZruhE2X1j9ScbOjrvs_5yvFEn/view?usp=sharing"
                                        newTab={true}
                                        style={{ width: "100%", justifyContent: "center" }}
                                    />
                                </div>
                            )}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </motion.div>

        </div>
    );
};

export default Navbar;
