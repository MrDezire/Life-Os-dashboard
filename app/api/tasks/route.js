import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC',
            args: [userId]
        });
        const tasks = rs.rows;
        // Convert integer completed to boolean for frontend convenience
        const formatted = tasks.map(t => ({ ...t, completed: Boolean(t.completed) }));
        return NextResponse.json(formatted);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { text } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO tasks (userId, text) VALUES (?, ?)',
            args: [userId, text]
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), userId, text, completed: false });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        await db.execute({
            sql: 'DELETE FROM tasks WHERE id = ? AND userId = ?',
            args: [id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, completed } = await request.json();
        await db.execute({
            sql: 'UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?',
            args: [completed ? 1 : 0, id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
