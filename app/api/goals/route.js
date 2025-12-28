import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM goals');
        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { id, progress, title } = await request.json();
        if (progress !== undefined) {
            await db.execute({
                sql: 'UPDATE goals SET progress = ? WHERE id = ?',
                args: [progress, id]
            });
        }
        if (title !== undefined) {
            await db.execute({
                sql: 'UPDATE goals SET title = ? WHERE id = ?',
                args: [title, id]
            });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
