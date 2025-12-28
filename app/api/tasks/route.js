import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM tasks ORDER BY createdAt DESC');
        const tasks = rs.rows;
        // Convert integer completed to boolean for frontend convenience
        const formatted = tasks.map(t => ({ ...t, completed: Boolean(t.completed) }));
        return NextResponse.json(formatted);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { text } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO tasks (text) VALUES (?)',
            args: [text]
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), text, completed: false });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        await db.execute({
            sql: 'DELETE FROM tasks WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { id, completed } = await request.json();
        await db.execute({
            sql: 'UPDATE tasks SET completed = ? WHERE id = ?',
            args: [completed ? 1 : 0, id]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
