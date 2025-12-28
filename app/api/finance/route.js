export const dynamic = 'force-dynamic';
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const rs = await db.execute({
            sql: 'SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC',
            args: [userId]
        });
        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { type, amount, description } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO transactions (userId, type, amount, description) VALUES (?, ?, ?, ?)',
            args: [userId, type, amount, description || '']
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), userId, type, amount, description });
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
        if (id) {
            // Delete single transaction
            await db.execute({
                sql: 'DELETE FROM transactions WHERE id = ? AND userId = ?',
                args: [id, userId]
            });
        } else {
            // Reset all transactions for this user
            await db.execute({
                sql: 'DELETE FROM transactions WHERE userId = ?',
                args: [userId]
            });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
