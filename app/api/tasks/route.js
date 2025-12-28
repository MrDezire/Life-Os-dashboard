export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            args: [session.userId]
        });

        // Convert integer 1/0 to boolean
        const tasks = result.rows.map(row => ({
            ...row,
            completed: Boolean(row.completed)
        }));

        return NextResponse.json(tasks);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { text, completed } = await request.json();

        const result = await db.execute({
            sql: 'INSERT INTO tasks (user_id, text, completed) VALUES (?, ?, ?)',
            args: [session.userId, text, completed ? 1 : 0]
        });

        return NextResponse.json({
            success: true,
            id: Number(result.lastInsertRowid),
            text,
            completed
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, completed } = await request.json();

        await db.execute({
            sql: 'UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?',
            args: [completed ? 1 : 0, id, session.userId]
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
            sql: 'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            args: [id, session.userId]
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
