import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM settings WHERE userId = ?',
            args: [userId]
        });

        if (rs.rows.length === 0) {
            // New user, create default settings
            await db.execute({
                sql: 'INSERT INTO settings (userId, name, theme) VALUES (?, ?, ?)',
                args: [userId, 'User', 'dark']
            });
            return NextResponse.json({ userId, name: 'User', theme: 'dark' });
        }

        return NextResponse.json(rs.rows[0]);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, theme } = await request.json();
        if (name !== undefined) {
            await db.execute({
                sql: 'UPDATE settings SET name = ? WHERE userId = ?',
                args: [name, userId]
            });
        }
        if (theme !== undefined) {
            await db.execute({
                sql: 'UPDATE settings SET theme = ? WHERE userId = ?',
                args: [theme, userId]
            });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
