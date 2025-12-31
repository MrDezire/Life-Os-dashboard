export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            args: [userId]
        });
        // We only support one goal for now in the widget
        const goal = result.rows[0] || null;
        return NextResponse.json(goal ? { ...goal, title: goal.text } : null); // Map text->title for compatibility
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { title, target, progress } = await request.json();

        // Delete existing goal? (Single goal logic)
        await db.execute({ sql: 'DELETE FROM goals WHERE user_id = ?', args: [userId] });

        const result = await db.execute({
            sql: 'INSERT INTO goals (user_id, text, target, progress) VALUES (?, ?, ?, ?)',
            args: [userId, title, target || 100, progress || 0]
        });

        return NextResponse.json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { progress } = await request.json();
        // Update the latest goal
        await db.execute({
            sql: 'UPDATE goals SET progress = ? WHERE user_id = ?',
            args: [progress, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
