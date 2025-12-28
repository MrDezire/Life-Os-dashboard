export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM goals WHERE userId = ?',
            args: [userId]
        });

        if (rs.rows.length === 0) {
            // Seed default goal for new user
            await db.execute({
                sql: 'INSERT INTO goals (userId, title, progress) VALUES (?, ?, ?)',
                args: [userId, 'Master Next.js', 10]
            });
            const newRs = await db.execute({
                sql: 'SELECT * FROM goals WHERE userId = ?',
                args: [userId]
            });
            return NextResponse.json(newRs.rows);
        }

        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, progress, title } = await request.json();
        if (progress !== undefined) {
            await db.execute({
                sql: 'UPDATE goals SET progress = ? WHERE id = ? AND userId = ?',
                args: [progress, id, userId]
            });
        }
        if (title !== undefined) {
            await db.execute({
                sql: 'UPDATE goals SET title = ? WHERE id = ? AND userId = ?',
                args: [title, id, userId]
            });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
