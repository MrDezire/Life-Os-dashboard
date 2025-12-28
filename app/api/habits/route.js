import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM habits');
        return NextResponse.json(rs.rows);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name } = await request.json();
        const rs = await db.execute({
            sql: 'INSERT INTO habits (name) VALUES (?)',
            args: [name]
        });
        return NextResponse.json({ id: Number(rs.lastInsertRowid), name, completedDays: '' });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { id, completedDays } = await request.json();
        await db.execute({
            sql: 'UPDATE habits SET completedDays = ? WHERE id = ?',
            args: [completedDays, id]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    try {
        await db.execute({
            sql: 'DELETE FROM habits WHERE id = ?',
            args: [id]
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
