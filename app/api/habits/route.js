export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM habits WHERE userId = ?',
            args: [userId]
        });

        if (rs.rows.length === 0) {
            // Seed default habits for new user
            const defaults = ['Drink Water', 'Exercise', 'Study'];
            for (const name of defaults) {
                await db.execute({
                    sql: 'INSERT INTO habits (userId, name, completedDays) VALUES (?, ?, ?)',
                    args: [userId, name, '']
                });
            }
            const newRs = await db.execute({
                sql: 'SELECT * FROM habits WHERE userId = ?',
                args: [userId]
            });
            return NextResponse.json(newRs.rows);
        }

        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO habits (userId, name, completedDays) VALUES (?, ?, ?)',
            args: [userId, name, '']
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), userId, name, completedDays: '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, completedDays } = await request.json();
        await db.execute({
            sql: 'UPDATE habits SET completedDays = ? WHERE id = ? AND userId = ?',
            args: [completedDays, id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url, 'http://localhost');
    const id = searchParams.get('id');
    try {
        await db.execute({
            sql: 'DELETE FROM habits WHERE id = ? AND userId = ?',
            args: [id, userId]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
