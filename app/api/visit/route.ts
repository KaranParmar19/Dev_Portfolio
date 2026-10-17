import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function parseUserAgent(ua: string) {
    let os = 'Unknown OS';
    if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/windows nt/i.test(ua)) os = 'Windows';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/cros/i.test(ua)) os = 'ChromeOS';

    let browser = 'Unknown Browser';
    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/opr|opera/i.test(ua)) browser = 'Opera';
    else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua)) browser = 'Safari';

    let deviceType = 'Desktop';
    if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';
    else if (/mobile|iphone|android/i.test(ua)) deviceType = 'Mobile';

    return { os, browser, deviceType };
}

function isBot(ua: string): boolean {
    const botPattern =
        /bot|spider|crawl|lighthouse|pingdom|uptime|semrush|ahrefs|discordbot|slackbot|whatsapp|telegrambot|twitterbot|facebookexternalhit|meta-externalagent|bytespider|yandex/i;
    return botPattern.test(ua);
}

function formatReferrer(raw: string): string {
    if (!raw || raw === 'Direct') return '🔗 Direct / Bookmark';
    try {
        const url = new URL(raw);
        const host = url.hostname.toLowerCase();
        if (host.includes('linkedin.com')) return `💼 LinkedIn (${raw})`;
        if (host.includes('github.com')) return `🐙 GitHub (${raw})`;
        if (host.includes('twitter.com') || host.includes('x.com')) return `🐦 X / Twitter (${raw})`;
        if (host.includes('google.')) return `🔍 Google Search (${raw})`;
        if (host.includes('instagram.com')) return `📸 Instagram (${raw})`;
        if (host.includes('reddit.com')) return `👽 Reddit (${raw})`;
        return `🌐 ${host} (${raw})`;
    } catch {
        return `🌐 ${raw}`;
    }
}

export async function POST(request: NextRequest) {
    try {
        const ua = request.headers.get('user-agent') || '';

        // Ignore common search bots and automated crawlers
        if (isBot(ua)) {
            return NextResponse.json({ success: true, ignored: 'bot' });
        }

        const body = await request.json().catch(() => ({}));
        const { referrer = 'Direct', screen = '', language = '', timezone = '' } = body;

        const { os, browser, deviceType } = parseUserAgent(ua);
        const referrerLabel = formatReferrer(referrer);

        // Vercel / Cloudflare edge location headers
        const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || '';
        const region = request.headers.get('x-vercel-ip-country-region') || '';
        const city = request.headers.get('x-vercel-ip-city') || '';

        let location = 'Unknown';
        if (city && country) {
            location = `${decodeURIComponent(city)}, ${country}`;
        } else if (country) {
            location = country;
        } else if (timezone) {
            location = timezone;
        }

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            // Not configured yet; silently succeed
            return NextResponse.json({
                success: true,
                warning: 'DISCORD_WEBHOOK_URL environment variable is not configured.',
            });
        }

        const now = new Date();
        const istTime = now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        const discordPayload = {
            username: 'Portfolio Tracker',
            avatar_url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            embeds: [
                {
                    title: '🚀 New Portfolio Visitor!',
                    color: 0xfe9066, // portfolio brand coral
                    fields: [
                        {
                            name: '🌐 Source / Referrer',
                            value: referrerLabel,
                            inline: false,
                        },
                        {
                            name: '📍 Location',
                            value: location,
                            inline: true,
                        },
                        {
                            name: '💻 Device',
                            value: `${deviceType} · ${os} · ${browser}`,
                            inline: true,
                        },
                        {
                            name: '🖥️ Screen & Lang',
                            value: `${screen || 'Unknown'} · ${language || 'Unknown'}`,
                            inline: true,
                        },
                        {
                            name: '🕒 Timestamp',
                            value: `${istTime} IST`,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: 'Karan Parmar Portfolio · Invisible Analytics',
                    },
                    timestamp: now.toISOString(),
                },
            ],
        };

        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });

        if (!res.ok) {
            console.error(`[VisitorTracker] Discord webhook returned status ${res.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[VisitorTracker] Error processing visitor ping:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
