import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rs = await db.execute('SELECT * FROM settings WHERE id = 1');
        return NextResponse.json(rs.rows[0]);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { name, theme } = await request.json();
        if (name !== undefined) {
            await db.execute({
                sql: 'UPDATE settings SET name = ? WHERE id = 1',
                args: [name]
            });
        }
        if (theme !== undefined) {
            await db.execute({
                sql: 'UPDATE settings SET theme = ? WHERE id = 1',
                args: [theme]
            });
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
