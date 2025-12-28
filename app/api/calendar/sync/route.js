import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { calendarUrl } = await request.json();

        if (!calendarUrl) {
            return NextResponse.json({ error: 'Calendar URL is required' }, { status: 400 });
        }

        // Fetch the iCal data
        const response = await fetch(calendarUrl);
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 400 });
        }

        const icalData = await response.text();

        // Parse iCal data (simple parser for VEVENT)
        const events = parseICalEvents(icalData);

        // Filter events for the next 7 days
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= now && eventDate <= nextWeek;
        });

        let count = 0;

        for (const event of upcomingEvents) {
            const taskText = `📅 ${event.summary} - ${new Date(event.start).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`;

            // Check if task already exists
            const rs = await db.execute({
                sql: 'SELECT id FROM tasks WHERE text = ?',
                args: [taskText]
            });

            if (rs.rows.length === 0) {
                await db.execute({
                    sql: 'INSERT INTO tasks (text, completed) VALUES (?, ?)',
                    args: [taskText, 0]
                });
                count++;
            }
        }

        return NextResponse.json({ success: true, count });
    } catch (e) {
        console.error('Calendar sync error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

function parseICalEvents(icalData) {
    const events = [];
    const lines = icalData.split('\n');
    let currentEvent = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            if (currentEvent.summary && currentEvent.start) {
                events.push(currentEvent);
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith('SUMMARY:')) {
                currentEvent.summary = line.substring(8);
            } else if (line.startsWith('DTSTART')) {
                // Parse date (handles both DTSTART: and DTSTART;VALUE=DATE:)
                const dateMatch = line.match(/:([\dTZ]+)/);
                if (dateMatch) {
                    currentEvent.start = parseICalDate(dateMatch[1]);
                }
            }
        }
    }

    return events;
}

function parseICalDate(dateStr) {
    // Format: 20250128T100000Z or 20250128
    if (dateStr.includes('T')) {
        // DateTime format
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(9, 11);
        const minute = dateStr.substring(11, 13);
        return `${year}-${month}-${day}T${hour}:${minute}:00`;
    } else {
        // Date only format
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}T00:00:00`;
    }
}
