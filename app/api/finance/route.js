export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM finance WHERE user_id = ? ORDER BY date DESC',
            args: [userId]
        });
        return NextResponse.json(result.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { type, amount, category, description } = await request.json();

        const result = await db.execute({
            sql: 'INSERT INTO finance (user_id, type, amount, category, description) VALUES (?, ?, ?, ?, ?)',
            args: [userId, type, amount, category, description]
        });

        return NextResponse.json({
            success: true,
            id: Number(result.lastInsertRowid)
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await db.execute({
            sql: 'DELETE FROM finance WHERE user_id = ?',
            args: [userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
