export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
            args: [session.userId]
        });
        const note = result.rows[0];
        return NextResponse.json({ content: note ? note.content : '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { content } = await request.json();

        // Check if note exists
        const existing = await db.execute({
            sql: 'SELECT id FROM notes WHERE user_id = ? LIMIT 1',
            args: [session.userId]
        });

        if (existing.rows.length > 0) {
            await db.execute({
                sql: 'UPDATE notes SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                args: [content, session.userId]
            });
        } else {
            await db.execute({
                sql: 'INSERT INTO notes (user_id, content) VALUES (?, ?)',
                args: [session.userId, content]
            });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const data = await request.json();
        return NextResponse.json({ success: true, ...data });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
