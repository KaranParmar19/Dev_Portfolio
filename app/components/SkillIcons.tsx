'use client';

import React from 'react';

export function SkillIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
    switch (name) {
        case 'React.js':
            return (
                <svg viewBox="0 0 115 102.3" fill="none" className={className}>
                    <ellipse rx="11" ry="4.2" transform="matrix(.866 .5 -.5 .866 57.5 51.1)" stroke="#00d8ff" strokeWidth="4.4" />
                    <ellipse rx="11" ry="4.2" transform="matrix(0 1 -1 0 57.5 51.1)" stroke="#00d8ff" strokeWidth="4.4" />
                    <ellipse rx="11" ry="4.2" transform="matrix(.866 -.5 .5 .866 57.5 51.1)" stroke="#00d8ff" strokeWidth="4.4" />
                    <circle cx="57.5" cy="51.1" r="5" fill="#00d8ff" />
                </svg>
            );
        case 'Next.js':
            return (
                <svg viewBox="0 0 180 180" fill="none" className={className}>
                    <circle cx="90" cy="90" r="90" fill="#000" />
                    <path d="M149.5 149.5L78.8 54H60v72h14.4V73.4l62.2 83.2c4.4-2.1 8.8-4.4 12.9-7.1z" fill="url(#next-g)" />
                    <path d="M118.8 54h14.4v72h-14.4z" fill="#fff" />
                    <defs>
                        <linearGradient id="next-g" x1="109.5" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#fff" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            );
        case 'TypeScript':
            return (
                <svg viewBox="0 0 128 128" className={className}>
                    <path fill="#3178c6" d="M0 0h128v128H0z" />
                    <path fill="#fff" d="M68 85.5c2 3.6 5.4 6 10.2 6 5.8 0 9.3-3 9.3-7.2 0-5.1-4.2-7.1-11.4-10.2-10.3-4.4-15.1-10.1-15.1-19.4 0-11.4 8.9-19.7 22.8-19.7 9.8 0 16.8 3.5 21.2 11.4l-9.1 5.8c-2.4-4.4-5.6-6.4-11.4-6.4-5.3 0-8.6 3.2-8.6 6.8 0 4.4 3.3 6.4 10.5 9.5 11.7 5.1 16.5 10.5 16.5 20.3 0 13.5-10.3 20.9-24.8 20.9-12.7 0-21.2-5.4-25.2-14.6l9.5-3.2zm-49-38.7h40.4v10.5H46.5v44.8H33.4v-44.8H19V46.8z" />
                </svg>
            );
        case 'JavaScript':
            return (
                <svg viewBox="0 0 128 128" className={className}>
                    <path fill="#f7df1e" d="M0 0h128v128H0z" />
                    <path d="M67.3 100.8c2.4 4 6.7 6.6 12 6.6 6.7 0 11-3.4 11-8.1 0-5.6-4.4-7.8-12.3-11.2-11.4-4.9-16.6-11.1-16.6-21.3 0-12.5 9.7-21.7 24.9-21.7 10.7 0 18.5 3.8 23.3 12.5l-9.9 6.4c-2.7-4.8-6.1-7.1-12.4-7.1-5.8 0-9.4 3.5-9.4 7.5 0 4.8 3.6 7 11.5 10.4 12.8 5.6 18.1 11.5 18.1 22.3 0 14.8-11.3 22.9-27.2 22.9-13.9 0-23.2-5.9-27.6-16l9.6-3.7zm-40.7 1.2c2.4 4.1 5.6 7.4 11.3 7.4 5.8 0 9.5-2.9 9.5-14.2V46.8h13.1v48.6c0 18.5-10.7 26.6-25 26.6-11.3 0-18-5.7-21.6-14l12.7-6z" />
                </svg>
            );
        case 'Tailwind CSS':
            return (
                <svg viewBox="0 0 54 33" fill="#38bdf8" className={className}>
                    <path d="M13.5 0C6.075 0 1.013 3.712 0 11.138c2.7-3.375 5.738-4.725 9.113-4.05 1.925.385 3.3 1.782 4.823 3.328C16.42 12.93 19.346 15.9 27 15.9c7.425 0 12.488-3.712 13.5-11.137-2.7 3.375-5.738 4.725-9.113 4.05-1.925-.385-3.3-1.783-4.823-3.328C24.08 2.97 21.154 0 13.5 0zm13.5 16.5C19.575 16.5 14.513 20.212 13.5 27.638c2.7-3.375 5.738-4.725 9.113-4.05 1.925.385 3.3 1.782 4.823 3.328C29.92 29.43 32.846 32.4 40.5 32.4c7.425 0 12.488-3.712 13.5-11.138-2.7 3.375-5.738 4.725-9.113 4.05-1.925-.385-3.3-1.782-4.823-3.328C37.58 19.47 34.654 16.5 27 16.5z" />
                </svg>
            );
        case 'Fabric.js':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" />
                    <circle cx="12" cy="12" r="3" fill="#f472b6" />
                </svg>
            );
        case 'HTML5 & CSS3':
            return (
                <svg viewBox="0 0 512 512" fill="none" className={className}>
                    <path fill="#e34f26" d="M71 460L32 0h448l-39 460-185 52z" />
                    <path fill="#ef652a" d="M256 472l149-41 33-391H256z" />
                    <path fill="#ebebeb" d="M256 208h-63l-4-48h67V112H137l13 144h106zm0 156l-67-18-4-48h-48l7 89 112 31z" />
                    <path fill="#fff" d="M256 208v48h60l-6 64-54 15v50l110-31 16-176H256zm0-96v48h119l4-48z" />
                </svg>
            );
        case 'Responsive UI':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect width="18" height="14" x="3" y="3" rx="2" />
                    <path d="M7 21h10M12 17v4" />
                </svg>
            );
        case 'LangChain':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            );
        case 'RAG & Embeddings':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="12" r="3" fill="#8b5cf6" />
                    <circle cx="4" cy="6" r="2" />
                    <circle cx="20" cy="6" r="2" />
                    <circle cx="4" cy="18" r="2" />
                    <circle cx="20" cy="18" r="2" />
                    <path d="M6 7l4 3.5M18 7l-4 3.5M6 17l4-3.5M18 17l-4-3.5" />
                </svg>
            );
        case 'OpenAI API':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3a9 9 0 0 1 7.8 4.5l-6.8 3.9" />
                    <path d="M21 12a9 9 0 0 1-4.5 7.8l-3.9-6.8" />
                    <path d="M12 21a9 9 0 0 1-7.8-4.5l6.8-3.9" />
                    <path d="M3 12a9 9 0 0 1 4.5-7.8l3.9 6.8" />
                </svg>
            );
        case 'Claude Code & Copilot':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#d97757" fillOpacity="0.2" />
                </svg>
            );
        case 'AWS Cloud':
            return (
                <svg viewBox="0 0 24 24" fill="none" className={className}>
                    <path d="M6.5 17c-2.5 0-4.5-1.8-4.5-4 0-1.9 1.4-3.5 3.4-3.9C5.9 6.2 8.7 4 12 4c3.8 0 7 2.9 7 6.5 1.7.5 3 2 3 3.8 0 2.2-2 4-4.5 4" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 19c3 1.8 7 1.8 10 0" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );
        case 'Docker':
            return (
                <svg viewBox="0 0 24 24" fill="#2496ed" className={className}>
                    <path d="M13 6h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6 3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6 3h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm-3 0h2v2H4zm17.5 1.5c-.3-.2-.9-.4-1.6-.3-.3-1.2-1.3-1.7-1.4-1.7l-.3.2s-.5.3-.9 1c-.3-.1-.8-.2-1.3-.2H1v3.5C1 18.5 4.5 21 9 21c6 0 9.8-3.3 11-7.5.8 0 1.9-.3 2.5-1.2.1-.2 0-.6-.5-.8z" />
                </svg>
            );
        case 'CI/CD Pipelines':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            );
        case 'Git / GitHub Actions':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#f05032" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <line x1="6" y1="3" x2="6" y2="15" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                </svg>
            );
        case 'FastAPI':
            return (
                <svg viewBox="0 0 24 24" fill="none" className={className}>
                    <circle cx="12" cy="12" r="10" fill="#009688" />
                    <path d="M13 4L6 14h5l-2 6 9-11h-5l2-5z" fill="#fff" />
                </svg>
            );
        case 'Node.js':
            return (
                <svg viewBox="0 0 24 24" fill="#339933" className={className}>
                    <path d="M12 2l9 5.2v10.4L12 22.8 3 17.6V7.2L12 2z" />
                </svg>
            );
        case 'Express.js':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 8h8M8 12h5M8 16h8" />
                </svg>
            );
        case 'Redis':
            return (
                <svg viewBox="0 0 24 24" fill="#dc382d" className={className}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l-9-4.5V12l9 4.5 9-4.5V6.5L12 11zm0 5l-9-4.5V17l9 5 9-5v-5.5L12 16z" />
                </svg>
            );
        case 'Celery':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#37814a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M12 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4z" fill="#37814a" fillOpacity="0.2" />
                    <path d="M6 14c-2 0-3 2-3 4 0 2 3 4 9 4s9-2 9-4c0-2-1-4-3-4" />
                </svg>
            );
        case 'BullMQ':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M4 6c0-2 2-4 4-4s4 2 4 4M20 6c0-2-2-4-4-4s-4 2-4 4" />
                    <circle cx="12" cy="14" r="7" />
                    <circle cx="9" cy="13" r="1" fill="#e11d48" />
                    <circle cx="15" cy="13" r="1" fill="#e11d48" />
                </svg>
            );
        case 'Socket.IO':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            );
        case 'WebSockets & WebRTC':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                    <circle cx="12" cy="12" r="2" fill="#2563eb" />
                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2" />
                </svg>
            );
        case 'Python':
            return (
                <svg viewBox="0 0 128 128" className={className}>
                    <path fill="#3776ab" d="M63.7 0c-16.7 0-30 4.2-30 18.8v14.4h30.6v4.6H23.9C9.7 37.8 0 46.9 0 63.6s9 25.1 23.9 25.1h7.8V77.4c0-9 8.2-16.4 17.5-16.4h30.6c7.7 0 13.9-6.3 13.9-14V18.8C93.7 4.2 80.4 0 63.7 0zm-8.3 9.4c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5z" />
                    <path fill="#ffd43b" d="M64.3 128c16.7 0 30-4.2 30-18.8V94.8H63.7v-4.6h40.4c14.2 0 23.9-9.1 23.9-25.8s-9-25.1-23.9-25.1h-7.8v11.3c0 9-8.2 16.4-17.5 16.4H48.2c-7.7 0-13.9 6.3-13.9 14v28.2c0 14.6 13.3 18.8 30 18.8zm8.3-9.4c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                </svg>
            );
        case 'C/C++':
            return (
                <svg viewBox="0 0 128 128" className={className}>
                    <path fill="#00599c" d="M64 0L119.4 32v64L64 128 8.6 96V32L64 0z" />
                    <path fill="#fff" d="M64 36c-15.5 0-28 12.5-28 28s12.5 28 28 28c8.8 0 16.6-4.1 21.6-10.4l-9.8-6.4c-3.1 3.5-7.6 5.8-11.8 5.8-9.4 0-17-7.6-17-17s7.6-17 17-17c4.2 0 8.7 2.3 11.8 5.8l9.8-6.4C80.6 40.1 72.8 36 64 36zm28 24h6v-6h4v6h6v4h-6v6h-4v-6h-6v-4zm18 0h6v-6h4v6h6v4h-6v6h-4v-6h-6v-4z" />
                </svg>
            );
        case 'PostgreSQL':
            return (
                <svg viewBox="0 0 128 128" className={className}>
                    <path fill="#336791" d="M64.6 2C30.2 2 2.2 29.8 2.2 64.2c0 24.8 14.5 46.2 35.4 56.1 1.9-5.9 4-13.1 4-17.4 0-1.8-.4-3.5-.9-5.1-4.8-15.6-8.5-28.7-8.5-34.9 0-14.7 11.9-26.6 26.6-26.6 14.7 0 26.6 11.9 26.6 26.6 0 6.2-3.7 19.3-8.5 34.9-.5 1.6-.9 3.3-.9 5.1 0 4.3 2.1 11.5 4 17.4 20.9-9.9 35.4-31.3 35.4-56.1C127 29.8 99 2 64.6 2z" />
                </svg>
            );
        case 'MongoDB':
            return (
                <svg viewBox="0 0 24 24" fill="#47a248" className={className}>
                    <path d="M12 1.5C11.5 2 7 8 7 13.5c0 3.5 2.5 7.5 5 9 2.5-1.5 5-5.5 5-9 0-5.5-4.5-11.5-5-12z" />
                </svg>
            );
        case 'MySQL':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#4479a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <ellipse cx="12" cy="6" rx="8" ry="3" />
                    <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
                    <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
                </svg>
            );
        case 'InfluxDB':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#22adf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            );
        case 'DSA & Algorithms':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="5" r="2" fill="#f59e0b" />
                    <circle cx="6" cy="19" r="2" fill="#f59e0b" />
                    <circle cx="18" cy="19" r="2" fill="#f59e0b" />
                    <path d="M12 7v5M12 12l-6 5M12 12l6 5" />
                </svg>
            );
        case 'System Design & OOP':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
                    <circle cx="12" cy="12" r="10" />
                </svg>
            );
    }
}
