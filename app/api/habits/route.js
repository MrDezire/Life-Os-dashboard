export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at ASC',
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
        const { name } = await request.json();
        const result = await db.execute({
            sql: 'INSERT INTO habits (user_id, name, completed_days) VALUES (?, ?, ?)',
            args: [userId, name, '']
        });
        return NextResponse.json({ success: true, id: Number(result.lastInsertRowid), name, completed_days: '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, completed_days } = await request.json();
        await db.execute({
            sql: 'UPDATE habits SET completed_days = ? WHERE id = ? AND user_id = ?',
            args: [completed_days, id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        await db.execute({
            sql: 'DELETE FROM habits WHERE id = ? AND user_id = ?',
            args: [id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        // Return success even if fail to avoid UI breakage, or better error handling
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
