export interface ProjectType {
    id: number;
    name: string;
    subtitle: string;
    tech: string[];
    live: string;
    img: string;
    gallery?: string[];
    bg: string;
}

export const projectData: ProjectType[] = [
    {
        id: 1,
        name: 'DevLens AI',
        subtitle: 'Intelligent Codebase Explorer (FastAPI + LangChain/RAG)',
        tech: [
            'FastAPI',
            'LangChain',
            'RAG',
            'Celery',
            'Redis',
            'PostgreSQL',
            'WebSockets',
            'Python',
            'TypeScript'
        ],
        live: 'https://github.com/Karan19',
        img: '/projectImg/devlens-architecture.png',
        gallery: [
            '/projectImg/devlens-architecture.png',
            '/projectImg/devlens-codeflow.png',
            '/projectImg/devlens-chat.png',
            '/projectImg/devlens-onboarding.png',
            '/projectImg/devlens.png'
        ],
        bg: 'bg-[#e3f2ff]',
    },
    {
        id: 2,
        name: 'Lantern APM',
        subtitle: 'Open Source APM Platform (Node.js + InfluxDB + Socket.IO)',
        tech: [
            'Node.js',
            'InfluxDB',
            'Socket.IO',
            'BullMQ',
            'Redis',
            'Express.js',
            'TypeScript'
        ],
        live: 'https://github.com/Karan19',
        img: '/projectImg/lantern.png',
        gallery: [
            '/projectImg/lantern.png',
            '/projectImg/lantern-dashboard.png',
            '/projectImg/lantern-how-it-works.png',
            '/projectImg/lantern-traces.png',
            '/projectImg/lantern-alerts.png'
        ],
        bg: 'bg-[#fff3e3]',
    },
    {
        id: 3,
        name: 'Voxa Workspace',
        subtitle: 'Real Time Collaborative Workspace (MERN + WebRTC)',
        tech: [
            'React',
            'Node.js',
            'Express',
            'MongoDB',
            'WebRTC',
            'Fabric.js',
            'Tailwind CSS'
        ],
        live: 'https://github.com/Karan19',
        img: '/projectImg/voxa.png',
        gallery: [
            '/projectImg/voxa-hero.png',
            '/projectImg/voxa.png',
            '/projectImg/voxa-dashboard.png',
            '/projectImg/voxa-canvas.png',
            '/projectImg/voxa-features.png'
        ],
        bg: 'bg-[#f3ffe3]',
    }
];