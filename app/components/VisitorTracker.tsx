'use client';

import { useEffect } from 'react';

const SESSION_KEY = 'portfolio_visit_logged';

export default function VisitorTracker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            // Deduplicate per browser session (avoid spamming webhook on page reloads)
            const alreadyLogged = sessionStorage.getItem(SESSION_KEY);
            if (alreadyLogged) return;
            sessionStorage.setItem(SESSION_KEY, 'true');

            const payload = {
                referrer: document.referrer || 'Direct',
                screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
                language: navigator.language || '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                path: window.location.pathname || '/',
            };

            fetch('/api/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true,
            }).catch(() => {
                // Silently swallow errors - completely invisible to the visitor
            });
        } catch {
            // Silently swallow any storage or security restriction errors
        }
    }, []);

    return null;
}
