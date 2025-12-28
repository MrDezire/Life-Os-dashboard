export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at ASC',
            args: [session.userId]
        });
        return NextResponse.json(result.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await request.json();
        const result = await db.execute({
            sql: 'INSERT INTO habits (user_id, name, completed_days) VALUES (?, ?, ?)',
            args: [session.userId, name, '']
        });
        return NextResponse.json({ success: true, id: Number(result.lastInsertRowid), name, completed_days: '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, completed_days } = await request.json();
        await db.execute({
            sql: 'UPDATE habits SET completed_days = ? WHERE id = ? AND user_id = ?',
            args: [completed_days, id, session.userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        await db.execute({
            sql: 'DELETE FROM habits WHERE id = ? AND user_id = ?',
            args: [id, session.userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        // Return success even if fail to avoid UI breakage, or better error handling
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
