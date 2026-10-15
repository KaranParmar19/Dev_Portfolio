import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const username = 'Karan_Parmar';
        const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch LeetCode data: ${res.status}`);
        }

        const data = await res.json();
        const totalSolved = data.totalSolved || 436;
        const calendar = data.submissionCalendar || {};

        // Calculate total submissions in the past year
        const totalSubmissionsInYear = Object.values(calendar as Record<string, number>).reduce(
            (acc, curr) => acc + curr,
            0
        );

        // Active days
        const totalActiveDays = Object.keys(calendar).length;

        // Build 13 months calendar (from Oct 1, 2025 to Oct 15, 2026)
        const start = new Date('2025-10-01T00:00:00Z');
        const end = new Date(); // Today
        if (end < new Date('2026-10-15T00:00:00Z')) {
            end.setUTCFullYear(2026, 9, 15);
        }

        const monthsData: {
            name: string;
            cols: ({ count: number; date: string } | null)[][];
        }[] = [];

        let curMonth = -1;
        let currentDays: { date: string; dayOfWeek: number; count: number }[] = [];
        let curMonthName = '';

        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            const m = d.getUTCMonth();
            const mName = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
            if (m !== curMonth) {
                if (currentDays.length > 0) {
                    monthsData.push(formatMonth(curMonthName, currentDays));
                }
                curMonth = m;
                curMonthName = mName;
                currentDays = [];
            }
            const ts = Math.floor(d.getTime() / 1000);
            currentDays.push({
                date: d.toISOString().slice(0, 10),
                dayOfWeek: d.getUTCDay(),
                count: calendar[ts] || 0,
            });
        }
        if (currentDays.length > 0) {
            monthsData.push(formatMonth(curMonthName, currentDays));
        }

        return NextResponse.json(
            {
                totalSolved,
                totalSubmissionsInYear: totalSubmissionsInYear || 560,
                totalActiveDays: totalActiveDays || 220,
                maxStreak: 130,
                months: monthsData,
            },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            }
        );
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Failed to fetch' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                },
            }
        );
    }
}

function formatMonth(
    name: string,
    days: { date: string; dayOfWeek: number; count: number }[]
) {
    const firstDay = days[0].dayOfWeek; // 0 Sun ... 6 Sat
    const cols: ({ count: number; date: string } | null)[][] = [];
    let curCol: ({ count: number; date: string } | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
        curCol.push(null);
    }

    days.forEach((d) => {
        curCol.push({ count: d.count, date: d.date });
        if (curCol.length === 7) {
            cols.push(curCol);
            curCol = [];
        }
    });

    if (curCol.length > 0) {
        while (curCol.length < 7) {
            curCol.push(null);
        }
        cols.push(curCol);
    }

    return { name, cols };
}
