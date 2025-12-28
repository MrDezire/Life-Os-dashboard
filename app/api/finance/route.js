import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM transactions ORDER BY createdAt DESC');
        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { type, amount, description } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?)',
            args: [type, amount, description || '']
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), type, amount, description });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        if (id) {
            // Delete single transaction
            await db.execute({
                sql: 'DELETE FROM transactions WHERE id = ?',
                args: [id]
            });
        } else {
            // Reset all transactions
            await db.execute('DELETE FROM transactions');
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
