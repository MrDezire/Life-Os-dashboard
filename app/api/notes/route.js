export const dynamic = 'force-dynamic';
export const revalidate = 0;
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM notes WHERE userId = ?',
            args: [userId]
        });

        if (rs.rows.length === 0) {
            // Seed default note for new user
            await db.execute({
                sql: 'INSERT INTO notes (userId, content) VALUES (?, ?)',
                args: [userId, '']
            });
            return NextResponse.json({ userId, content: '' });
        }

        return NextResponse.json(rs.rows[0]);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) { // Save note
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { content } = await request.json();
        await db.execute({
            sql: 'UPDATE notes SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ?',
            args: [content, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
