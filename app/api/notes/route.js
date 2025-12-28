import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM notes WHERE id = 1');
        const note = rs.rows[0];
        return NextResponse.json(note || { content: '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) { // Save note (Auto-save style)
    try {
        const { content } = await request.json();
        await db.execute({
            sql: 'UPDATE notes SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = 1',
            args: [content]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
